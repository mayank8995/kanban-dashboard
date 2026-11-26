import type { BoardId, Card, CardId, ColumnId } from '../types'

export type CardChanges = Partial<Pick<Card, 'title' | 'description'>>

export type AddBoardAction = {
  type: 'board/add'
  payload: { boardId: BoardId; name: string }
}

export type RenameBoardAction = {
  type: 'board/rename'
  payload: { boardId: BoardId; name: string }
}

export type DeleteBoardAction = {
  type: 'board/delete'
  payload: { boardId: BoardId }
}

export type SetActiveBoardAction = {
  type: 'board/setActive'
  payload: { boardId: BoardId }
}

export type AddColumnAction = {
  type: 'column/add'
  payload: { boardId: BoardId; columnId: ColumnId; title: string }
}

export type RenameColumnAction = {
  type: 'column/rename'
  payload: { columnId: ColumnId; title: string }
}

export type DeleteColumnAction = {
  type: 'column/delete'
  payload: { boardId: BoardId; columnId: ColumnId }
}

export type ReorderColumnsAction = {
  type: 'column/reorder'
  payload: { boardId: BoardId; fromIndex: number; toIndex: number }
}

export type AddCardAction = {
  type: 'card/add'
  payload: { columnId: ColumnId; card: Card }
}

export type EditCardAction = {
  type: 'card/edit'
  payload: { cardId: CardId; changes: CardChanges }
}

export type DeleteCardAction = {
  type: 'card/delete'
  payload: { columnId: ColumnId; cardId: CardId }
}

export type MoveCardAction = {
  type: 'card/move'
  payload: {
    cardId: CardId
    fromColumnId: ColumnId
    toColumnId: ColumnId
    toIndex: number
  }
}

export type KanbanAction =
  | AddBoardAction
  | RenameBoardAction
  | DeleteBoardAction
  | SetActiveBoardAction
  | AddColumnAction
  | RenameColumnAction
  | DeleteColumnAction
  | ReorderColumnsAction
  | AddCardAction
  | EditCardAction
  | DeleteCardAction
  | MoveCardAction

const createId = (): string => crypto.randomUUID()

export const addBoard = (name: string, boardId: BoardId = createId()): AddBoardAction => ({
  type: 'board/add',
  payload: { boardId, name },
})

export const renameBoard = (boardId: BoardId, name: string): RenameBoardAction => ({
  type: 'board/rename',
  payload: { boardId, name },
})

export const deleteBoard = (boardId: BoardId): DeleteBoardAction => ({
  type: 'board/delete',
  payload: { boardId },
})

export const setActiveBoard = (boardId: BoardId): SetActiveBoardAction => ({
  type: 'board/setActive',
  payload: { boardId },
})

export const addColumn = (
  boardId: BoardId,
  title: string,
  columnId: ColumnId = createId(),
): AddColumnAction => ({
  type: 'column/add',
  payload: { boardId, columnId, title },
})

export const renameColumn = (columnId: ColumnId, title: string): RenameColumnAction => ({
  type: 'column/rename',
  payload: { columnId, title },
})

export const deleteColumn = (boardId: BoardId, columnId: ColumnId): DeleteColumnAction => ({
  type: 'column/delete',
  payload: { boardId, columnId },
})

export const reorderColumns = (
  boardId: BoardId,
  fromIndex: number,
  toIndex: number,
): ReorderColumnsAction => ({
  type: 'column/reorder',
  payload: { boardId, fromIndex, toIndex },
})

export const addCard = (
  columnId: ColumnId,
  title: string,
  description = '',
  cardId: CardId = createId(),
  createdAt: string = new Date().toISOString(),
): AddCardAction => ({
  type: 'card/add',
  payload: { columnId, card: { id: cardId, title, description, createdAt } },
})

export const editCard = (cardId: CardId, changes: CardChanges): EditCardAction => ({
  type: 'card/edit',
  payload: { cardId, changes },
})

export const deleteCard = (columnId: ColumnId, cardId: CardId): DeleteCardAction => ({
  type: 'card/delete',
  payload: { columnId, cardId },
})

export const moveCard = (
  cardId: CardId,
  fromColumnId: ColumnId,
  toColumnId: ColumnId,
  toIndex: number,
): MoveCardAction => ({
  type: 'card/move',
  payload: { cardId, fromColumnId, toColumnId, toIndex },
})
