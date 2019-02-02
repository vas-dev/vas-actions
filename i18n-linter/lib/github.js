const GitHub = require('@octokit/rest')

module.exports = () => {
  const octokit = new GitHub({
    auth: `token ${process.env.GITHUB_TOKEN}`,
    userAgent: 'octokit/rest.js v1.2.3'
  })

  return octokit
}
