export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'complete'
  scheduledDate?: string
  scheduledTime?: string
  duration?: number
  createdAt: string
  order: number
}

export interface QuickTodo {
  id: string
  text: string
  completed: boolean
}

export interface Note {
  id: string
  content: string
  updatedAt: string
}

export type ViewType = 'kanban' | 'calendar'

export interface AppState {
  tasks: Task[]
  quickTodos: QuickTodo[]
  notes: Note[]
  activeView: ViewType
}

export type AppAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'SET_QUICK_TODOS'; payload: QuickTodo[] }
  | { type: 'ADD_QUICK_TODO'; payload: QuickTodo }
  | { type: 'UPDATE_QUICK_TODO'; payload: QuickTodo }
  | { type: 'DELETE_QUICK_TODO'; payload: string }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'LOAD_STATE'; payload: AppState }
