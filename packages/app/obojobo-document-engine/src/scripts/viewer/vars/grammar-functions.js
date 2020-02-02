import numberToWords from 'number-to-words'

import Scientific from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/scientific'
import Fractional from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/fractional'
import Hexadecimal from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/hexadecimal'
import Octal from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/octal'
import Binary from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/binary'
import big from '../../../../../../obonode/obojobo-chunks-numeric-assessment/big'
import Decimal from '../../../../../../obonode/obojobo-chunks-numeric-assessment/numerics/decimal'

class GrammarFunctions {
	constructor() {}

	// ==== Math methods ====

	abs(n) {
		return Math.abs(n)
	}

	acos(n) {
		return Math.acos(n)
	}

	asin(n) {
		return Math.asin(n)
	}

	atan(n) {
		return Math.atan(n)
	}

	ceil(n) {
		return Math.ceil(n)
	}

	comb(n, k) {
		return this.fact(n) / (this.fact(k) * this.fact(n - k))
	}

	cos(n) {
		return Math.cos(n)
	}

	cosec(n) {
		return 1 / this.sin(n)
	}

	cotan(n) {
		return 1 / this.tan(n)
	}

	fact(n) {
		if (n === 0 || n === 1) {
			return 1
		}

		for (let i = n - 1; i >= 1; i--) {
			n *= i
		}

		return n
	}

	factorial(n) {
		// Alias for 'fact'
		return this.fact(n)
	}

	floor(n) {
		return Math.floor(n)
	}

	ln(n) {
		return Math.log(n)
	}

	log(n, base = 10) {
		return Math.log(n) / Math.log(base)
	}

	perm(n, k) {
		return this.factorial(n) / this.factorial(n - k)
	}

	permutation(n, k) {
		//Alias for 'perm'
		return this.perm(n, k)
	}

	pi() {
		return Math.PI
	}

	pow(n, exponent) {
		return Math.pow(n, exponent)
	}

	round(n) {
		return Math.round(n)
	}

	to_fixed(n, decimalPlaces) {
		return parseFloat(n.toFixed(decimalPlaces))
	}

	sec(n) {
		return 1 / this.cos(n)
	}

	sin(n) {
		return Math.sin(n)
	}

	sqrt(n) {
		return Math.sqrt(n)
	}

	stddev(list) {
		const m = this.mean(list)
		const squares = list.map(n => Math.pow(n - m, 2))
		const squaresMean = this.mean(squares)

		return Math.sqrt(squaresMean)
	}

	std_dev(list) {
		// Alias for 'stddev'
		return this.stddev(list)
	}

	sum(list) {
		return list.reduce((acc, v) => v + (acc || 0))
	}

	max(list) {
		return Math.max.apply(null, list)
	}

	mean(list) {
		return list.reduce((p, c) => p + c) / list.length
	}

	median(list) {
		list = [].concat(list)

		list.sort()

		const half = Math.floor(list.length / 2)

		if (list.length % 2) {
			return list[half]
		}

		return (list[half - 1] + list[half]) / 2
	}

	min(list) {
		console.log('min', list)
		return Math.min.apply(null, list)
	}

	range(list) {
		return this.max(list) - this.min(list)
	}

	tan(n) {
		return Math.tan(n)
	}

	// ==== End Math Methods ====

	// ==== Logic Methods ====

	and(a, b) {
		return Boolean(a && b)
	}

	or(a, b) {
		return Boolean(a || b)
	}

	xor(a, b) {
		return Boolean((a && !b) || (!a && b))
	}

	not(x) {
		return Boolean(!x)
	}

	// ==== End Logic Methods ====

	// ==== Bitwise Methods ====

	bit_lshift(n, amount) {
		return n << amount
	}

	bit_rshift(n, amount) {
		return n >> amount
	}

	bit_zfrshift(n, amount) {
		return n >>> amount
	}

	bit_and(a, b) {
		return a & b
	}

	bit_or(a, b) {
		return a | b
	}

	bit_xor(a, b) {
		return a ^ b
	}

	bit_not(a) {
		return ~a
	}

	// ==== End Bitwise Methods ====

	// ==== List Methods ====

	concat(a, b) {
		return a.concat(b)
	}

	at(list, index) {
		return list[index]
	}

	count(list) {
		return list.length
	}

	first(list) {
		return list[0]
	}

	last(list) {
		return list[list.length - 1]
	}

	slice(list, start, end) {
		return list.slice(start, end)
	}

	splice(list, start, deleteCount) {
		return list.splice(start, deleteCount)
	}

	length(list) {
		return list.length
	}

	reverse(list) {
		return [...list].reverse()
	}

	sort(list) {
		return [...list].sort()
	}

	join(list, delim = '') {
		return list.join(delim)
	}

	// ==== End List Methods ====

	// ==== Print Methods ====

	to_decimal(n) {
		return Decimal.getString(big(n))
	}

	to_scientific(n) {
		return Scientific.getString(big(n))
	}

	to_fraction(n) {
		return Fractional.getString(big(n))
	}

	to_hex(n) {
		return Hexadecimal.getString(big(n))
	}

	to_octal(n) {
		return Octal.getString(big(n))
	}

	to_binary(n) {
		return Binary.getString(big(n))
	}

	ord(n) {
		return numberToWords.toOrdinal(n)
	}

	num_to_words(n) {
		return numberToWords.toWords(n)
	}

	num_to_words_ord(n) {
		return numberToWords.toWordsOrdinal(n)
	}

	num_to_ord(n) {
		return numberToWords.toOrdinal(n)
	}

	lowercase(s) {
		return s.toLowerCase()
	}

	uppercase(s) {
		return s.toUpperCase()
	}

	capitalize(s) {
		return s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase()
	}

	split(s, delim) {
		return s.split(delim)
	}

	substring(s, start, end) {
		return s.substring(start, end)
	}

	print_array(a) {
		return `[${a.toString().replace(/,/g, ', ')}]`
	}

	// ==== End Print Methods ====

	// ==== Cast/Conversion Methods ====

	string(x) {
		return x.toString()
	}

	bool(x) {
		return Boolean(x)
	}

	int(x) {
		if (x === true) return 1
		if (x === false) return 0
		return parseInt(x, 10)
	}

	number(x) {
		if (x === true) return 1
		if (x === false) return 0
		return parseFloat(x)
	}

	deg_to_rad(n) {
		return n * (Math.PI / 180)
	}

	rad_to_deg(n) {
		return n * (180 / Math.PI)
	}

	// ==== End Cast/Conversion Methods ====

	// ==== Conditional Methods ====

	if(condition, success, fail) {
		return condition ? success : fail
	}

	// ==== End Conditional Methods

	// ==== Matrix Methods ====

	// matrix(rows, cols, ...values) {
	// 	return this.list_to_matrix(rows, cols, values)
	// }

	list_to_matrix(rows, cols, list) {
		const matrix = []
		list = [...list]

		for (let i = 0; i < rows; i++) {
			// const row = []

			// for(const j = 0; j < cols; j++) {
			// 	row.push
			// }
			matrix.push(list.splice(0, cols))

			// matrix.push(row)
		}

		return matrix
	}

	matrix_to_list(matrix) {
		return matrix.reduce((m, list) => m.concat(list), [])
	}

	// ==== End Matrix Methods

	// ==== Latex Print Methods ====

	latex(s) {
		return {
			style: '_latex',
			text: s
		}
	}

	latex_matrix(matrix, type = 'matrix') {
		console.log('lm', matrix)
		const rows = matrix.map(row => {
			return row.join(' & ')
		})
		return {
			style: '_latex',
			text: `\\begin{${type}}
${rows.join('\\\\\n')}
\\end{${type}}`
		}
	}

	latex_frac(fractionalString) {
		console.log('fs', fractionalString, typeof fractionalString)
		const tokens = fractionalString.split('/')
		return `\\frac{${tokens[0]}}{${tokens[1]}}`
	}

	latex_scientific(n) {
		const s = this.to_scientific(n)
		const terms = Scientific.getTerms(s)

		return `${parseFloat(terms.bigDigit)} \\times 10^${parseFloat(terms.bigExponential)}`
	}

	// ==== End Latex Print Methods ====

	// from_scientific(s) {
	// 	const n = new Scientific(s)
	// 	return parseFloat(n.bigValue)
	// }

	//@TODO - Turn these into simply "a < b"
	// lt(a, b) {
	// 	return a < b
	// }

	// lte(a, b) {
	// 	return a <= b
	// }

	// gt(a, b) {
	// 	return a > b
	// }

	// gte(a, b) {
	// 	return a >= b
	// }

	// eq(a, b) {
	// 	return a === b
	// }
	//@TODO - End
}

const grammarFunctions = new GrammarFunctions()

export default grammarFunctions
