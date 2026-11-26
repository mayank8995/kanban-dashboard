import type { KanbanState } from '../types'

export const initialState: KanbanState = {
  boards: {
    'board-1': {
      id: 'board-1',
      name: 'My Board',
      columnIds: ['column-todo', 'column-in-progress', 'column-done'],
    },
  },
  columns: {
    'column-todo': {
      id: 'column-todo',
      title: 'To Do',
      cardIds: ['card-1', 'card-2'],
    },
    'column-in-progress': {
      id: 'column-in-progress',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    'column-done': {
      id: 'column-done',
      title: 'Done',
      cardIds: ['card-4'],
    },
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Design the board layout',
      description: 'Sketch how columns and cards are arranged on screen.',
      createdAt: '2026-11-20T09:00:00.000Z',
    },
    'card-2': {
      id: 'card-2',
      title: 'Add drag and drop',
      description: 'Let cards move between columns.',
      createdAt: '2026-11-21T10:30:00.000Z',
    },
    'card-3': {
      id: 'card-3',
      title: 'Build the card component',
      description: 'Show the title and description of each card.',
      createdAt: '2026-11-22T14:15:00.000Z',
    },
    'card-4': {
      id: 'card-4',
      title: 'Scaffold the project',
      description: 'Set up Vite, React, TypeScript, ESLint, Prettier and Vitest.',
      createdAt: '2026-11-19T08:00:00.000Z',
    },
  },
  activeBoardId: 'board-1',
}
