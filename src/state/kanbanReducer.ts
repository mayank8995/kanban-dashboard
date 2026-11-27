import type { KanbanAction } from './actions'
import type { KanbanState } from '../types'

const omitKeys = <T>(record: Record<string, T>, keys: readonly string[]): Record<string, T> => {
  const removed = new Set(keys)
  return Object.fromEntries(Object.entries(record).filter(([key]) => !removed.has(key)))
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const moveItem = <T>(items: readonly T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items]
  const [item] = next.splice(fromIndex, 1)
  next.splice(clamp(toIndex, 0, next.length), 0, item)
  return next
}

const insertAt = <T>(items: readonly T[], index: number, item: T): T[] => {
  const next = [...items]
  next.splice(clamp(index, 0, next.length), 0, item)
  return next
}

export const kanbanReducer = (state: KanbanState, action: KanbanAction): KanbanState => {
  switch (action.type) {
    case 'board/add': {
      const { boardId, name } = action.payload
      if (state.boards[boardId]) return state
      return {
        ...state,
        boards: { ...state.boards, [boardId]: { id: boardId, name, columnIds: [] } },
        activeBoardId: state.activeBoardId ?? boardId,
      }
    }

    case 'board/rename': {
      const { boardId, name } = action.payload
      const board = state.boards[boardId]
      if (!board || board.name === name) return state
      return { ...state, boards: { ...state.boards, [boardId]: { ...board, name } } }
    }

    case 'board/delete': {
      const { boardId } = action.payload
      const board = state.boards[boardId]
      if (!board) return state
      const cardIds = board.columnIds.flatMap((columnId) => state.columns[columnId]?.cardIds ?? [])
      const boards = omitKeys(state.boards, [boardId])
      const activeBoardId =
        state.activeBoardId === boardId ? (Object.keys(boards)[0] ?? null) : state.activeBoardId
      return {
        boards,
        columns: omitKeys(state.columns, board.columnIds),
        cards: omitKeys(state.cards, cardIds),
        activeBoardId,
      }
    }

    case 'board/setActive': {
      const { boardId } = action.payload
      if (!state.boards[boardId] || state.activeBoardId === boardId) return state
      return { ...state, activeBoardId: boardId }
    }

    case 'column/add': {
      const { boardId, columnId, title } = action.payload
      const board = state.boards[boardId]
      if (!board || state.columns[columnId]) return state
      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: { ...board, columnIds: [...board.columnIds, columnId] },
        },
        columns: { ...state.columns, [columnId]: { id: columnId, title, cardIds: [] } },
      }
    }

    case 'column/rename': {
      const { columnId, title } = action.payload
      const column = state.columns[columnId]
      if (!column || column.title === title) return state
      return { ...state, columns: { ...state.columns, [columnId]: { ...column, title } } }
    }

    case 'column/delete': {
      const { boardId, columnId } = action.payload
      const board = state.boards[boardId]
      const column = state.columns[columnId]
      if (!board || !column || !board.columnIds.includes(columnId)) return state
      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: { ...board, columnIds: board.columnIds.filter((id) => id !== columnId) },
        },
        columns: omitKeys(state.columns, [columnId]),
        cards: omitKeys(state.cards, column.cardIds),
      }
    }

    case 'column/reorder': {
      const { boardId, fromIndex, toIndex } = action.payload
      const board = state.boards[boardId]
      if (!board) return state
      const lastIndex = board.columnIds.length - 1
      if (fromIndex < 0 || fromIndex > lastIndex) return state
      if (clamp(toIndex, 0, lastIndex) === fromIndex) return state
      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: { ...board, columnIds: moveItem(board.columnIds, fromIndex, toIndex) },
        },
      }
    }

    case 'card/add': {
      const { columnId, card } = action.payload
      const column = state.columns[columnId]
      if (!column || state.cards[card.id]) return state
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: { ...column, cardIds: [...column.cardIds, card.id] },
        },
        cards: { ...state.cards, [card.id]: card },
      }
    }

    case 'card/edit': {
      const { cardId, changes } = action.payload
      const card = state.cards[cardId]
      if (!card) return state
      const title = changes.title ?? card.title
      const description = changes.description ?? card.description
      if (title === card.title && description === card.description) return state
      return { ...state, cards: { ...state.cards, [cardId]: { ...card, title, description } } }
    }

    case 'card/delete': {
      const { columnId, cardId } = action.payload
      const column = state.columns[columnId]
      if (!column || !column.cardIds.includes(cardId)) return state
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: { ...column, cardIds: column.cardIds.filter((id) => id !== cardId) },
        },
        cards: omitKeys(state.cards, [cardId]),
      }
    }

    case 'card/move': {
      const { cardId, fromColumnId, toColumnId, toIndex } = action.payload
      const fromColumn = state.columns[fromColumnId]
      const toColumn = state.columns[toColumnId]
      if (!fromColumn || !toColumn) return state
      const fromIndex = fromColumn.cardIds.indexOf(cardId)
      if (fromIndex === -1) return state

      if (fromColumnId === toColumnId) {
        const lastIndex = fromColumn.cardIds.length - 1
        if (clamp(toIndex, 0, lastIndex) === fromIndex) return state
        return {
          ...state,
          columns: {
            ...state.columns,
            [fromColumnId]: {
              ...fromColumn,
              cardIds: moveItem(fromColumn.cardIds, fromIndex, toIndex),
            },
          },
        }
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumnId]: {
            ...fromColumn,
            cardIds: fromColumn.cardIds.filter((id) => id !== cardId),
          },
          [toColumnId]: { ...toColumn, cardIds: insertAt(toColumn.cardIds, toIndex, cardId) },
        },
      }
    }

    default: {
      const unhandled: never = action
      return unhandled
    }
  }
}
