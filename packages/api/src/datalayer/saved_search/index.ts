/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CreateSet,
  keys as modelKeys,
  UpdateSet,
  SavedSearchData,
} from './model'
import DataModel, { DataModelError } from '../model'
import { Knex } from 'knex'
import {
  ENABLE_DB_REQUEST_LOGGING,
  globalCounter,
  logMethod,
  logger,
} from '../helpers'
import { Table } from '../../utils/dictionary'
import DataLoader from 'dataloader'
import { kx as knexConfig } from './../knex_config'

class SavedSearchModel extends DataModel<
  SavedSearchData,
  CreateSet,
  UpdateSet
> {
  public tableName = Table.SAVED_SEARCH
  protected modelKeys = modelKeys

  constructor(kx: Knex = knexConfig, cache = true) {
    super(kx, cache)

    this.loader = new DataLoader(
      async (keys) => {
        if (ENABLE_DB_REQUEST_LOGGING) {
          globalCounter.log(
            this.tableName,
            'saved_search_model',
            JSON.stringify(keys)
          )
        }
        const rows: SavedSearchData[] = await this.kx(this.tableName)
          .select(this.modelKeys)
          .whereIn('userId', keys)

        const keyMap: Record<string, SavedSearchData> = {}
        for (const row of rows) {
          if (row.userId in keyMap) continue
          keyMap[row.userId] = row
        }

        const result = keys.map((userId) => keyMap[userId] || [])

        logger.info(JSON.stringify(result))

        if (result.length !== keys.length) {
          logger.error('DataModel error: count mismatch ', keys, result)
        }
        return result
      },
      { cache }
    )

    this.get = this.loader.load.bind(this.loader)
    this.getMany = this.loader.loadMany.bind(this.loader)
  }

  /**
   * When we crete this, we need to make sure that the position variable always increments.
   * @param params The userId, Query, and name of the Saved Search. The other ones are auto generated.
   * @param tx Transaction Library.
   */
  @logMethod
  async create(
    params: {
      userId: string
      query: string
      name: string
    },
    tx = this.kx
  ): Promise<SavedSearchData> {
    // Is this right? I don't know. We cannot test it because there's no wifi on this plane :(
    const [savedSearch] = (await tx(Table.SAVED_SEARCH)
      .insert({
        ...params,
        position: tx.raw(
          `SELECT MAX(position) + 1
           from omnivore.saved_searches
           WHERE user_id = '${params.userId}'`
        ),
      })
      .returning(modelKeys)) as SavedSearchData[]

    return savedSearch
  }

  async deleteAndUpdatePositions(
    params: {
      id: string
      userId: string
    },
    tx = this.kx
  ): Promise<SavedSearchData | { error: DataModelError }> {
    return tx.transaction(async (tx) => {
      await tx.raw(
        `UPDATE ${Table.SAVED_SEARCH}
                     SET position = position - 1
                     WHERE user_id = '${params.userId}'
                       AND position > (SELECT position FROM ${Table.SAVED_SEARCH} where id = '{params.id}')`
      )
      return super.delete(params.id, tx)
    })
  }

  async updateWithPosition(
    params: Partial<{
      userId: string
      id: string
      name: string
      query: string
      position: number
    }>,
    tx = this.kx
  ): Promise<SavedSearchData | { error: DataModelError }> {
    const { userId, id, ...updateParams } = params

    return tx.transaction(async (tx) => {
      // Only update the positions if the update has changed the position of the item we are updating.
      await tx.raw(
        `UPDATE ${Table.SAVED_SEARCH}
         SET position = position + 1
         WHERE user_id = '${params.userId!}'
           AND position > (SELECT position FROM ${
             Table.SAVED_SEARCH
           } where id = '{params.id}')
           AND ${params.position!} != (SELECT position FROM ${
          Table.SAVED_SEARCH
        } where id = '{params.id}')`
      )
      return super.update(params.id!, updateParams as UpdateSet, tx)
    })
  }
}

export default SavedSearchModel
