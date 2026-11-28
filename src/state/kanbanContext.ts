import { createContext, type Dispatch } from 'react'
import type { KanbanAction } from './actions'
import type { KanbanState } from '../types'

export const KanbanStateContext = createContext<KanbanState | null>(null)
KanbanStateContext.displayName = 'KanbanStateContext'

export const KanbanDispatchContext = createContext<Dispatch<KanbanAction> | null>(null)
KanbanDispatchContext.displayName = 'KanbanDispatchContext'
