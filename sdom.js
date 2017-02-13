let registered = new Map()

function createNewApi() {
  return {
    init: function() {},
    listeners: {},
    events: [],
  }
}

function registerApi(app, db, router, registration) {
  if(registered.has(registration.title)) return

  api = {
    static: Object.assign(createNewApi(), registration.static),
    inst: Object.assign(createNewApi(), registration.instance)
  }

  registered.set(registration.title, api)
  api.static.init(app, db, router)

  for(let event in api.static.listeners)
  {
    app.on(event, api.static.listeners[event])
  }
}

function getRegistration(name) {
  return registered.get(name)
}

module.exports = {
  registerApi: registerApi,
  getRegistration: getRegistration
}