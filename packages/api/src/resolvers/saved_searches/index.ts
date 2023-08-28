/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { authorized } from '../../utils/helpers'
import {
  DeleteSavedSearchError,
  DeleteSavedSearchErrorCode,
  DeleteSavedSearchSuccess,
  MutationDeleteSavedSearchArgs,
  MutationUpdateSavedSearchArgs,
  SavedSearch,
  SavedSearchesError,
  SavedSearchesResult, SavedSearchesSuccess,
  UpdateSavedSearchError,
  UpdateSavedSearchErrorCode,
  UpdateSavedSearchSuccess
} from "../../generated/graphql"
import { SavedSearchData } from '../../datalayer/saved_search/model'

type UpdateSavedSearchArgs = Partial<{
  id: string
  name: string
  query: string
  position: number
}>

type DeleteSavedSearchArgs = {
  id: string
}

export const getSavedSearchResolver = authorized<
  SavedSearchesSuccess,
  SavedSearchesError
>(async (_parent, _args, { models, claims: { uid } }) => {
  console.log(uid)

  const savedSearch = (await models.savedSearch.getWhereIn('userId', [
    uid,
  ])) as SavedSearch[]

  console.log(savedSearch)
  return {
    savedSearch,
  }
})

export const deleteSavedSearchResolver = authorized<
  DeleteSavedSearchSuccess,
  DeleteSavedSearchError,
  MutationDeleteSavedSearchArgs
>(async (_parent, { id }, { models, claims: { uid } }) => {
  const [savedSearch] = await models.savedSearch.getWhereIn('id', [id])

  if (!savedSearch) {
    return {
      errorCodes: [DeleteSavedSearchErrorCode.NotFound],
    } as DeleteSavedSearchError
  }

  if (savedSearch.userId != uid) {
    return {
      errorCodes: [DeleteSavedSearchErrorCode.Unauthorized],
    } as DeleteSavedSearchError
  }

  await models.savedSearch.deleteAndUpdatePositions({
    id: id as string,
    userId: uid,
  })

  return {
    id: savedSearch.id,
  }
})

export const updateSavedSearchResolver = authorized<
  UpdateSavedSearchSuccess,
  UpdateSavedSearchError,
  MutationUpdateSavedSearchArgs
>(async (_parent, { input: args }, { models, claims: { uid } }) => {
  const [savedSearchData] = await models.savedSearch.getWhereIn('id', [
    args.id!,
  ])

  if (!savedSearchData) {
    return {
      errorCodes: [UpdateSavedSearchErrorCode.Unauthorized],
    } as UpdateSavedSearchError
  }

  const { userId, ...savedSearch } = savedSearchData
  if (userId != uid) {
    return {
      errorCodes: [UpdateSavedSearchErrorCode.Unauthorized],
    } as UpdateSavedSearchError
  }

  try {
    await models.savedSearch.updateWithPosition({
      userId: uid,
      ...args,
    })
  } catch (e) {
    return {
      errorCodes: [UpdateSavedSearchErrorCode.Unauthorized],
    } as UpdateSavedSearchError
  }

  return {
    savedSearch: savedSearch,
  } as UpdateSavedSearchSuccess
})
