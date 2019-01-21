const user = require('./user')
const account = require('./account')
const item = require('./item')
const filter = require('./filter')

const methods = Object.assign({}, user, account, item, filter)

module.exports = methods
