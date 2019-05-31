import Decimal from './decimal.js'
import Scientific from './scientific.js'
import Fractional from './fractional.js'
import Hexadecimal from './hexadecimal.js'
import Octal from './octal.js'
import Binary from './binary.js'

const NumericClasses = {}

NumericClasses[Decimal.type] = Decimal
NumericClasses[Scientific.type] = Scientific
NumericClasses[Fractional.type] = Fractional
NumericClasses[Hexadecimal.type] = Hexadecimal
NumericClasses[Octal.type] = Octal
NumericClasses[Binary.type] = Binary

export default NumericClasses
