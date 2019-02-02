const setupOctokit = require('./lib/github');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const octokit = setupOctokit();
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const TRANSLATION_PATH = require(path.join(GITHUB_WORKSPACE, process.env.TRANSLATION_PATH))
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_EVENT = require(process.env.GITHUB_EVENT_PATH);

let missingTranslations = [];

const getFiles = async (number) => {
  const result = await octokit.pulls.listFiles({owner: GITHUB_EVENT.repository.owner.login, repo: GITHUB_EVENT.repository.name, number})
  return result.data.filter(file => file.filename.match(/^(?:(?!test).)*.js$/));
}

const run = async() => {
  if (GITHUB_EVENT_NAME !== 'PullRequestEvent' || GITHUB_EVENT.action !== 'opened') {
    console.log('Nothing to do');
  };

  const files = await getFiles(GITHUB_EVENT.number);

  if (files.length > 0) {
    files.forEach(filePath => {
      const fileData = fs.readFileSync(path.join(GITHUB_WORKSPACE, filePath.filename)).toString().split('\n');

      fileData.forEach((line, index) => {
        const regex = line.match(/(?:I18n\.t\(')((\*)|([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*\*?)/);
        if (regex) {
          const isAvailable = _.has(TRANSLATION_PATH, regex[1]);
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
  }

  if (missingTranslations.length > 0) {
    const groupedTranslations = _.groupBy(missingTranslations, 'languageKey');
    let body = `### Missing Translations\n\n`;

    Object.keys(groupedTranslations).forEach((key) => {
      body += `* \`${key}\`\n`;
      groupedTranslations[key].forEach((translation, index) => {
        body += `  * [${translation.filename.split('/').slice(-1)[0]}:${translation.lineNumber}](${translation.fileUrl})`;
        if (index !== missingTranslations.length - 1) {
          body += `\n`;
        }
      })
    })

    octokit.issues.createComment({
      owner: GITHUB_EVENT.repository.owner.login,
      repo: GITHUB_EVENT.repository.name,
      number: GITHUB_EVENT.number, body
    }).then(() => console.log('Comment Added.'));
  }
}

run()
