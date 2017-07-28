let EventEmitter = require('events')
// Global event emitter for the application
// Not ideal to store this as a global, buuuut
let oboEvents = new EventEmitter(this)

module.exports = oboEvents
