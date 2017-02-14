var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  res.success = function(valueObject) {
    res.send({
      status: 'ok',
      value: valueObject
    })
  }

  res.missing = function(message) {
    return res.status(404).json({
      status: 'error',
      value: {
        type: 'missing',
        message: message
      }
    })
  }

  res.badInput = function(message) {
    return res.status(400).json({
      status: 'error',
      value: {
        type: 'input',
        message: message
      }
    })
  }

  res.unexpected = function(message) {
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

  next();
})

module.exports = router;