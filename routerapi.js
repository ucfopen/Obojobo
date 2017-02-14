module.exports = class RouterAPI {
  constructor(router, db, endpoints)
  {
    this.router = router;
    this.db = db;
    this.endpoints = endpoints;

    for(let epName in this.endpoints)
    {
      let method = this.endpoints[epName][0]
      let ep     = this.endpoints[epName][1]

      router[method](ep, this[epName].bind(this, ep));
    }

    return router;
  }

  logAndRespondToUnexpected(errorMessage, endpoint, req, jsError)
  {
    app.logError(endpoint, errorMessage, req, jsError, jsError.toString())
    res.unexpected(jsError)
  }
}