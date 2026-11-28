import { useContext, type Dispatch } from 'react'
import type { KanbanAction } from './actions'
import { KanbanDispatchContext, KanbanStateContext } from './kanbanContext'
import type { KanbanState } from '../types'

export function useKanbanState(): KanbanState {
  const state = useContext(KanbanStateContext)
  if (state === null) {
    throw new Error('useKanbanState must be used within a KanbanProvider')
  }
  return state
}

export function useKanbanDispatch(): Dispatch<KanbanAction> {
  const dispatch = useContext(KanbanDispatchContext)
  if (dispatch === null) {
    throw new Error('useKanbanDispatch must be used within a KanbanProvider')
  }
  return dispatch
}
