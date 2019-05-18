'use strict'

const fs = require('fs')

const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const serverBundle = require('../dist/bundle/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/bundle/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

module.exports = (event, cookies, callback) => {
  
  const appContext = {
    url: event.path,
    cookies: cookies,
    title: event.headers.Host
  }
  
  renderer.renderToString(appContext, callback)
}
