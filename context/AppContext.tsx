'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { AppState, AppAction, Task, QuickTodo, Note, ViewType } from '@/types'

const STORAGE_KEY = 'vibeflow-state'

const initialState: AppState = {
  tasks: [],
  quickTodos: [],
  notes: [],
  activeView: 'kanban',
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      }
    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload }
    case 'SET_QUICK_TODOS':
      return { ...state, quickTodos: action.payload }
    case 'ADD_QUICK_TODO':
      return { ...state, quickTodos: [...state.quickTodos, action.payload] }
    case 'UPDATE_QUICK_TODO':
      return {
        ...state,
        quickTodos: state.quickTodos.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }
    case 'DELETE_QUICK_TODO':
      return {
        ...state,
        quickTodos: state.quickTodos.filter((t) => t.id !== action.payload),
      }
    case 'SET_NOTES':
      return { ...state, notes: action.payload }
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] }
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      }
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      }
    case 'SET_VIEW':
      return { ...state, activeView: action.payload }
    case 'LOAD_STATE':
      return action.payload
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  addTask: (title: string, description?: string) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Task['status']) => void
  addQuickTodo: (text: string) => void
  toggleQuickTodo: (id: string) => void
  deleteQuickTodo: (id: string) => void
  updateNote: (id: string, content: string) => void
  setView: (view: ViewType) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [isHydrated, setIsHydrated] = React.useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } })
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save state to localStorage:', error)
      }
    }
  }, [state, isHydrated])

  const addTask = useCallback((title: string, description?: string) => {
    const maxOrder = state.tasks
      .filter((t) => t.status === 'todo')
      .reduce((max, t) => Math.max(max, t.order), -1)

    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
    }
    dispatch({ type: 'ADD_TASK', payload: task })
  }, [state.tasks])

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task })
  }, [])

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }, [])

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (task) {
      const maxOrder = state.tasks
        .filter((t) => t.status === newStatus)
        .reduce((max, t) => Math.max(max, t.order), -1)

      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, status: newStatus, order: maxOrder + 1 },
      })
    }
  }, [state.tasks])

  const addQuickTodo = useCallback((text: string) => {
    const todo: QuickTodo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
    }
    dispatch({ type: 'ADD_QUICK_TODO', payload: todo })
  }, [])

  const toggleQuickTodo = useCallback((id: string) => {
    const todo = state.quickTodos.find((t) => t.id === id)
    if (todo) {
      dispatch({
        type: 'UPDATE_QUICK_TODO',
        payload: { ...todo, completed: !todo.completed },
      })
    }
  }, [state.quickTodos])

  const deleteQuickTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_QUICK_TODO', payload: id })
  }, [])

  const updateNote = useCallback((id: string, content: string) => {
    const existingNote = state.notes.find((n) => n.id === id)
    if (existingNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { ...existingNote, content, updatedAt: new Date().toISOString() },
      })
    } else {
      const note: Note = {
        id,
        content,
        updatedAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_NOTE', payload: note })
    }
  }, [state.notes])

  const setView = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addQuickTodo,
        toggleQuickTodo,
        deleteQuickTodo,
        updateNote,
        setView,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
