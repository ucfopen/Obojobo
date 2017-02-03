let registered = new Map()

function createNewApi() {
  return {
    init: function() {},
    listeners: {},
    events: [],
  }
}

function registerApi(app, db, router, registration) {
  console.log('REGISTER API', registration.title)

  if(registered.has(registration.title)) return

  // console.log('111REGISTER API', registration)

  api = {
    static: Object.assign(createNewApi(), registration.static),
    inst: Object.assign(createNewApi(), registration.instance)
  }

  registered.set(registration.title, api)
  api.static.init(app, db, router)

  // console.log('api.static', api.static)

  for(let event in api.static.listeners)
  {
    console.log('APPON', event)
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