
let success = (req, res, next, valueObject) => {
  return res.status(200).json({
    status: 'ok',
    value: valueObject
  })
}

let missing = (req, res, next, message) => {
  return res.status(404).json({
    status: 'error',
    value: {
      type: 'missing',
      message: message
    }
  })
}

// @TODO - in the controller - throw an error instead of calling this
// let the main response handler catch it and respond with this
let badInput = (req, res, next, message) => {
  return res.status(400).json({
    status: 'error',
    value: {
      type: 'input',
      message: message
    }
  })
}

let unexpected = (req, res, next, message) => {
  if(message instanceof Error)
  {
    console.error('error thrown', message.stack)
    message = message.toString()
  }
  return res.status(500).json({
    status: 'error',
    value: {
      type: 'unexpected',
      message: message
    }
  })
}

module.exports = (req, res, next) => {
  // use bind to wrap the function
  // theoretically reduces some overhead of creating the whole funciton every request
  res.success = success.bind(this, req, res, next)
  res.missing = missing.bind(this, req, res, next)
  res.badInput = badInput.bind(this, req, res, next)
  res.unexpected = unexpected.bind(this, req, res, next)
  next();
};
