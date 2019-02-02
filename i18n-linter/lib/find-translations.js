const fs = require('fs')
const path = require('path')
const _ = require('lodash')

module.exports = async (octokit, workspace, owner, repo, number) => {
  const TRANSLATION_PATH = require(path.join(workspace, process.env.TRANSLATION_PATH))
  const result = await octokit.pulls.listFiles({ owner, repo, number })
  const fileList = result.data.filter(file => file.filename.match(/^(?:(?!test).)*.js$/))
  
  try {
    let missingTranslations = []
    fileList.forEach(filePath => {
      const fileData = fs.readFileSync(path.join(workspace, filePath.filename)).toString().split('\n')

      fileData.forEach((line, index) => {
        const regex = line.match(/(?:I18n\.t\(')((\*)|([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*\*?)/)
        if (regex) {
          const isAvailable = _.has(TRANSLATION_PATH, regex[1])
          if (!isAvailable) {
            missingTranslations.push({
              lineNumber: index + 1,
              filename: filePath.filename,
              languageKey: regex[1],
              fileUrl: `${filePath.blob_url}#L${index + 1}`
            });
          }
        }
      });
    });
    
    return missingTranslations
  } catch (error) {
    throw error
  }
}
