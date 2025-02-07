import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

export default (app) => {
  app.post(
    '/full-page-examples/have-you-changed-your-name',
    [
      body('changed-name')
        .exists()
        .not().isEmpty().withMessage('Select if you have changed your name')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/have-you-changed-your-name/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/have-you-changed-your-name/confirm')
    }
  )
}
