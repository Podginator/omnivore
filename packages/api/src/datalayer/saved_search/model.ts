import { exclude, Partialize, PickTuple } from '../../util'

//                                 Table "omnivore.saved_searches"
//      Column     |           Type           | Collation | Nullable |                Default
// ----------------+--------------------------+-----------+----------+---------------------------------------
//  id             | uuid                     |           | not null | uuid_generate_v1mc()
//  user_id        | uuid                     |           | not null |
//  name           | text                     |           | not null |
//  query          | text                     |           | not null |
//  position       | integer                  |           | not null |
//  created_at     | timestamp with time zone |           | not null | CURRENT_TIMESTAMP

export interface SavedSearchData {
  id: string
  userId: string
  name: string
  query: string
  position?: number | null
  createdAt: Date
}

export const keys = [
  'id',
  'userId',
  'name',
  'query',
  'position',
  'createdAt',
] as const

export const defaultedKeys = ['id', 'createdAt'] as const

type DefaultedSet = PickTuple<SavedSearchData, typeof defaultedKeys>

export const createKeys = exclude(keys, defaultedKeys)

export type CreateSet = PickTuple<SavedSearchData, typeof createKeys> &
  Partialize<DefaultedSet>

export const updateKeys = ['name', 'query', 'position'] as const

export type UpdateSet = PickTuple<SavedSearchData, typeof updateKeys>
