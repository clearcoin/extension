#!/usr/bin/env node
const pify = require('pify')
const exec = pify(require('child_process').exec, { multiArgs: true })
const VERSION = require('../dist/chrome/manifest.json').version

start().catch(console.error)

async function start () {
  const authWorked = await checkIfAuthWorks()
  if (!authWorked) {
    console.log(`Sentry auth failed...`)
  }
  // check if version exists or not
  const versionAlreadyExists = await checkIfVersionExists()
  // abort if versions exists
  if (versionAlreadyExists) {
    console.log(`Version "${VERSION}" already exists on Sentry, aborting sourcemap upload.`)
    return
  }

  // create sentry release
  console.log(`creating Sentry release for "${VERSION}"...`)
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' new ${VERSION}`)
  console.log(`removing any existing files from Sentry release "${VERSION}"...`)
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' files ${VERSION} delete --all`)
  // upload sentry source and sourcemaps
  console.log(`uploading source files Sentry release "${VERSION}"...`)
  await exec(`for FILEPATH in ./dist/chrome/*.js; do [ -e $FILEPATH ] || continue; export FILE=\`basename $FILEPATH\` && echo uploading $FILE && sentry-cli releases --org 'metamask' --project 'metamask' files ${VERSION} upload $FILEPATH metamask/$FILE; done;`)
  console.log(`uploading sourcemaps Sentry release "${VERSION}"...`)
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' files ${VERSION} upload-sourcemaps ./dist/sourcemaps/ --url-prefix 'sourcemaps'`)
  console.log('all done!')
}

async function checkIfAuthWorks () {
  const itWorked = await doesNotFail(async () => {
    await exec(`sentry-cli releases --org 'metamask' --project 'metamask' list`)
  })
  return itWorked
}

async function checkIfVersionExists () {
  const versionAlreadyExists = await doesNotFail(async () => {
    await exec(`sentry-cli releases --org 'metamask' --project 'metamask' info ${VERSION}`)
  })
  return versionAlreadyExists
}

async function doesNotFail (asyncFn) {
  try {
    await asyncFn()
    return true
  } catch (err) {
    return false
  }
}
