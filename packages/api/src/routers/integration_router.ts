import axios from 'axios'
import cors from 'cors'
import express from 'express'
import { env } from '../env'
import { getClaimsByToken } from '../utils/auth'
import { corsConfig } from '../utils/corsConfig'
import { logger } from '../utils/logger'

export function integrationRouter() {
  const router = express.Router()
  // request token from pocket
  router.post(
    '/pocket/auth',
    cors<express.Request>(corsConfig),
    async (req: express.Request, res: express.Response) => {
      logger.info('pocket/request-token')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const token = (req.cookies.auth as string) || req.headers.authorization
      const claims = await getClaimsByToken(token)
      if (!claims) {
        return res.status(401).send('UNAUTHORIZED')
      }

      const consumerKey = env.pocket.consumerKey
      const redirectUri = `${env.client.url}/settings/integrations`
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const state = req.body.state as string
      try {
        // make a POST request to Pocket to get a request token
        const response = await axios.post<{ code: string }>(
          'https://getpocket.com/v3/oauth/request',
          {
            consumer_key: consumerKey,
            redirect_uri: redirectUri,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Accept': 'application/json',
            },
          },
        )
        const { code } = response.data
        // redirect the user to Pocket to authorize the request token
        res.redirect(
          `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${redirectUri}${encodeURIComponent(
            `?pocketToken=${code}&state=${state}`,
          )}`,
        )
      } catch (error) {
        if (axios.isAxiosError(error)) {
          logger.error(error.response)
        } else {
          logger.error('pocket/request-token exception:', error)
        }

        res.redirect(
          `${env.client.url}/settings/integrations?errorCodes=UNKNOWN`,
        )
      }
    },
  )
  return router
}
