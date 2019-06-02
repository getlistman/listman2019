'use strict'

const fs = require('fs')

const packageJson = JSON.parse(fs.readFileSync('package.json'))

const layerJson = {
  dependencies: packageJson.dependencies
}

fs.writeFileSync('dependencies/nodejs/package.json',
                 JSON.stringify(layerJson, null, 2))
