import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

export default (app) => {
  app.post(
    '/full-page-examples/how-do-you-want-to-sign-in',
    [
      body('sign-in')
        .exists()
        .not().isEmpty().withMessage('Select how you want to sign in')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/how-do-you-want-to-sign-in/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/how-do-you-want-to-sign-in/confirm')
    }
  )
}
