import { gql } from "graphql-request"

export type SavedSearch = {
  id: string
  name: string
  query: string
  position: number
}

export const savedSearchFragment = gql`
  fragment SavedSearchFields on SavedSearch {
    name
    query
    position
  }
`
