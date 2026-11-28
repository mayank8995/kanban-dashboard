import { useEffect, useReducer, type ReactNode } from 'react'
import { KanbanDispatchContext, KanbanStateContext } from './kanbanContext'
import { kanbanReducer } from './kanbanReducer'
import { loadState, saveState } from './storage'

type KanbanProviderProps = {
  children: ReactNode
}

export function KanbanProvider({ children }: KanbanProviderProps) {
  const [state, dispatch] = useReducer(kanbanReducer, undefined, () => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <KanbanStateContext value={state}>
      <KanbanDispatchContext value={dispatch}>{children}</KanbanDispatchContext>
    </KanbanStateContext>
  )
}
