import parser from './grammar'

export default (expression, vars = {}) => {
	return parser.parse(expression.replace(/\s+/g, ''), { vars })
}
