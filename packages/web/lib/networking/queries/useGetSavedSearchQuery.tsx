import { gql } from 'graphql-request'
import useSWR from 'swr'
import { publicGqlFetcher } from '../networkHelpers'
import { SavedSearch, savedSearchFragment } from "../fragments/savedSearchFragment"

type SavedSearchResponse = {
  savedSearch?: SavedSearch[]
  savedSearchErrors?: unknown
  isLoading: boolean
}

type SavedSearchResponseData = {
  savedSearch: SavedSearch[]
}

export function useGetSavedSearchQuery(): SavedSearchResponse {
  const query = gql`
    query SavedSearches {
      savedSearches { 
        ... on SavedSearchesSuccess { 
          savedSearch { 
            ...SavedSearchFields
          }
        }
        ... on SavedSearchesError {
          errorCodes
        }
      }
    }
    ${savedSearchFragment}
  `
  //
  const { data, error } = useSWR(query, publicGqlFetcher);
  const { savedSearch } = (data ?? {}) as SavedSearchResponseData

  return {
    savedSearch: savedSearch ?? [],
    savedSearchErrors: error ?? {},
    isLoading: false,
  }
}
