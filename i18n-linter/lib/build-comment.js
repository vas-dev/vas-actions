const _ = require('lodash')

module.exports = missingTranslations => {
  const groupedTranslations = _.groupBy(missingTranslations, 'languageKey')
  let body = `### Missing Translations\n\n`

  Object.keys(groupedTranslations).forEach((key) => {
    body += `* \`${key}\`\n`
    groupedTranslations[key].forEach((translation, index) => {
      body += `  * [${translation.filename.split('/').slice(-1)[0]}:${translation.lineNumber}](${translation.fileUrl})`
      if (index !== missingTranslations.length - 1) {
        body += `\n`
      }
    })
  })

  return body
}
