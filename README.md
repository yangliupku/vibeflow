# Vibeflow

A minimalist project management app for vibe coders. Features a Kanban board with drag-and-drop, calendar view for scheduling, and a clean dark theme designed for developers.

![Vibeflow](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8)

## Features

### Kanban Board
- Three columns: Todo, In Progress, Complete
- Drag and drop tasks between columns
- Click on any task to edit details
- Quick task creation

### Calendar View
- Weekly, daily, and monthly views
- Drag tasks to reschedule
- Resize events to change duration
- Drag unscheduled tasks from sidebar onto calendar

### Sidebar Panels
- **Quick Todos**: Simple checklist for quick items
- **Notes**: Freeform text area with auto-save
- **Unscheduled Tasks** (calendar view): List of tasks without a scheduled time
- Resizable panels - drag borders to adjust width

### Data Persistence
- All data saved to localStorage
- Survives page refresh

### Keyboard Shortcuts
- `Cmd/Ctrl + 1`: Switch to Kanban view
- `Cmd/Ctrl + 2`: Switch to Calendar view

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: @dnd-kit
- **Calendar**: @fullcalendar/react
- **State**: React Context + useReducer
- **Storage**: localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yangliupku/vibeflow.git
cd vibeflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
vibeflow/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main app page
│   └── globals.css         # Global styles
├── components/
│   ├── calendar/           # Calendar view components
│   ├── kanban/             # Kanban board components
│   ├── layout/             # Header, ViewToggle
│   ├── sidebar/            # Left/Right panels, QuickTodos, Notes
│   └── ui/                 # Reusable UI components
├── context/
│   └── AppContext.tsx      # Global state management
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Design

- **Color Palette**: Near-black background (#0a0a0b), subtle borders (#27272a), blue accent (#3b82f6)
- **Typography**: Monospace font for code-editor feel
- **Style**: Flat design, minimal shadows, sharp corners, high contrast

## License

MIT
