import Decimal from './decimal'
import Scientific from './scientific'
import Fractional from './fractional'
import Hexadecimal from './hexadecimal'
import Octal from './octal'
import Binary from './binary'

const NumericClasses = {}

NumericClasses[Decimal.type] = Decimal
NumericClasses[Scientific.type] = Scientific
NumericClasses[Fractional.type] = Fractional
NumericClasses[Hexadecimal.type] = Hexadecimal
NumericClasses[Octal.type] = Octal
NumericClasses[Binary.type] = Binary

export default NumericClasses
