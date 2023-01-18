const { parse } = require('path')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const { minimatch } = require('minimatch')
const pseudoclasses = require('postcss-pseudo-classes')
const unmq = require('postcss-unmq')
const unopacity = require('postcss-unopacity')
const unrgba = require('postcss-unrgba')

/**
 * PostCSS config
 *
 * @param {object} context - PostCSS context
 * @param {string} context.env - Browserslist environment
 * @param {string | import('vinyl')} [context.file] - File path or object
 * @returns {import('postcss-load-config').Config} PostCSS config
 */
module.exports = ({ env, file = '' }) => {
  const { dir, name } = parse(typeof file === 'object'
    ? file.path // Normalise to string path
    : file
  )

  // IE8 stylesheets
  const isIE8 = name.endsWith('-ie8') || name.endsWith('-ie8.min')

  const plugins = [
    autoprefixer({ env: isIE8 ? 'oldie' : env })
  ]

  // Minify CSS
  if (name.endsWith('.min')) {
    plugins.push(cssnano())
  }

  // Add review app auto-generated 'companion' classes for each pseudo-class
  // For example ':hover' and ':focus' classes to simulate form label states
  if (minimatch(dir, '**/app/assets/scss')) {
    plugins.push(pseudoclasses({
      restrictTo: [
        ':link',
        ':visited',
        ':hover',
        ':active',
        ':focus'
      ]
    }))
  }

  // Transpile CSS for Internet Explorer
  if (isIE8) {
    plugins.push(
      unmq(),
      unopacity({ browsers: 'ie 8' }),
      unrgba({ filter: true })
    )
  }

  return {
    plugins
  }
}
