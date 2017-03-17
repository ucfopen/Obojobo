module.exports = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}
