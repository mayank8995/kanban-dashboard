import { initialState } from './initialState'
import type { Board, Card, Column, KanbanState } from '../types'

export const STORAGE_KEY = 'kanban-dashboard/state'
const STORAGE_VERSION = 1

type StoredState = {
  version: number
  state: KanbanState
}

const getStorage = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString)

const isCard = (value: unknown): value is Card =>
  isObject(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.description) &&
  isString(value.createdAt) &&
  !Number.isNaN(Date.parse(value.createdAt))

const isColumn = (value: unknown): value is Column =>
  isObject(value) && isString(value.id) && isString(value.title) && isStringArray(value.cardIds)

const isBoard = (value: unknown): value is Board =>
  isObject(value) && isString(value.id) && isString(value.name) && isStringArray(value.columnIds)

const isRecordOf = <T extends { id: string }>(
  value: unknown,
  isItem: (item: unknown) => item is T,
): value is Record<string, T> =>
  isObject(value) && Object.entries(value).every(([key, item]) => isItem(item) && item.id === key)

const hasUniqueValues = (lists: string[][]): boolean => {
  const all = lists.flat()
  return new Set(all).size === all.length
}

const isConsistent = (state: KanbanState): boolean => {
  const boards = Object.values(state.boards)
  const columns = Object.values(state.columns)
  const columnLists = boards.map((board) => board.columnIds)
  const cardLists = columns.map((column) => column.cardIds)

  return (
    columnLists.every((ids) => ids.every((id) => id in state.columns)) &&
    cardLists.every((ids) => ids.every((id) => id in state.cards)) &&
    hasUniqueValues(columnLists) &&
    hasUniqueValues(cardLists) &&
    (state.activeBoardId === null ? boards.length === 0 : state.activeBoardId in state.boards)
  )
}

export const isKanbanState = (value: unknown): value is KanbanState => {
  if (!isObject(value)) return false
  const { boards, columns, cards, activeBoardId } = value
  return (
    isRecordOf(boards, isBoard) &&
    isRecordOf(columns, isColumn) &&
    isRecordOf(cards, isCard) &&
    (activeBoardId === null || isString(activeBoardId)) &&
    isConsistent({ boards, columns, cards, activeBoardId })
  )
}

export const loadState = (storage: Storage | null = getStorage()): KanbanState => {
  if (!storage) return initialState
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return initialState
    const parsed: unknown = JSON.parse(raw)
    if (!isObject(parsed) || parsed.version !== STORAGE_VERSION) return initialState
    return isKanbanState(parsed.state) ? parsed.state : initialState
  } catch {
    return initialState
  }
}

export const saveState = (state: KanbanState, storage: Storage | null = getStorage()): boolean => {
  if (!storage) return false
  try {
    const stored: StoredState = { version: STORAGE_VERSION, state }
    storage.setItem(STORAGE_KEY, JSON.stringify(stored))
    return true
  } catch {
    return false
  }
}
