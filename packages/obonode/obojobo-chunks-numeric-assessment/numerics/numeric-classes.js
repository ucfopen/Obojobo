const Decimal = require('./decimal')
const Scientific = require('./scientific')
const Fractional = require('./fractional')
const Hexadecimal = require('./hexadecimal')
const Octal = require('./octal')
const Binary = require('./binary')

const NumericClasses = {}

NumericClasses[Decimal.type] = Decimal
NumericClasses[Scientific.type] = Scientific
NumericClasses[Fractional.type] = Fractional
NumericClasses[Hexadecimal.type] = Hexadecimal
NumericClasses[Octal.type] = Octal
NumericClasses[Binary.type] = Binary

module.exports = NumericClasses
