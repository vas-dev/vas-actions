const setupOctokit = require('./lib/github')
const findTranslations = require('./lib/find-translations')
const buildComment = require('./lib/build-comment')
const _ = require('lodash')

const octokit = setupOctokit()
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME
const GITHUB_EVENT = require(process.env.GITHUB_EVENT_PATH)
const GITHUB_OWNER = GITHUB_EVENT.repository.owner.login
const GITHUB_REPO = GITHUB_EVENT.repository.name

console.log('Event Name: ', GITHUB_EVENT_NAME)
console.log('Event Action: ', GITHUB_EVENT.action)

if (GITHUB_EVENT_NAME !== 'pull_request' || GITHUB_EVENT.action !== 'opened') {
  console.log('Nothing to do')
  process.exit()
}

findTranslations(octokit, GITHUB_WORKSPACE, GITHUB_OWNER, GITHUB_REPO, GITHUB_EVENT.number)
  .then(async missingTranslations => {
    if (missingTranslations.length > 0) {
      const body = buildComment(missingTranslations)

      return octokit.issues.createComment({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        number: GITHUB_EVENT.number,
        body
      })
    } else {
      process.exit()
    }
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
