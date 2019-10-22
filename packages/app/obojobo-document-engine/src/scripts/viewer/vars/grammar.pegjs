{
	const fns = require('./grammar-functions.js').default
	const constants = require('./grammar-constants.js').default
}

expression
	= "!" _ a:comparision { return !a }
	/ customFunctionDefinition
	/ comparision

customFunctionDefinition
	= fnName:[a-zA-Z_]+ _ "(" _ args:fnArgsList _ ")" _ "=" _ expression:expression {
		return { name:fnName, args, expression }
	}

comparision
	= left:additive _ "<" _ right:comparision { return parseFloat(left) < parseFloat(right) }
	/ left:additive _ ">" _ right:comparision { return parseFloat(left) > parseFloat(right) }
	/ left:additive _ "<=" _ right:comparision { return parseFloat(left) <= parseFloat(right) }
	/ left:additive _ ">=" _ right:comparision { return parseFloat(left) >= parseFloat(right) }
	/ left:additive _ "==" _ right:comparision { return left == right }
	/ left:additive _ "!=" _ right:comparision { return left != right }
	/ additive

additive
	= left:multiplicative _ "+" _ right:additive {
		console.log('adding', left, right)
		return left + right;
		}
	/ left:multiplicative _ "-" _ right:additive { return left - right; }
	/ multiplicative

multiplicative
	= left:primary _ "*" _ right:multiplicative { return left * right; }
	/ left:primary _ "/" _ right:multiplicative { return left / right; }
	/ primary

primary
	= "-" _ value:value { return -1 * value }
	/ value

value
	= fn
	/ "(" _ e:expression _ ")" { return e; }
	/ list
	/ atom

fnArgsList
	= firstArg:expression _ "," _ otherArgs:fnArgsList { return [firstArg, ...otherArgs] }
	/ arg:expression { return [arg] }

fn
	= fnName:[a-zA-Z_]+ '(' _ args:fnArgsList _ ')' {
		fnName = fnName.join('')
		console.log(options, fns)
		let fn = options.customFunctions[fnName]
		if(!fn) {
			fn = fns[fnName]
		}
		if(!fn) {
			throw `Unrecognized function "${fnName}"`
		}

		return fn.apply(fns, args)
	 }

list
	= '[' _ listElements:listElements _ ']' { return listElements }
	// / atom:atom { return [atom] }

listElements
	= expression:expression _ ',' _ listElements:listElements { return [expression].concat(listElements) }
	/ expression:expression { return [expression] }

atom
	// / negativeNumber
	= number
	/ string
	/ boolean
	/ var
	/ constant

constant
	= 'e' { return constants.e }
	/ 'pi'i { return constants.pi }
	/ 'the_answer_to_life_the_universe_and_everything'i { return constants.the_answer_to_life_the_universe_and_everything }

boolean
	= 'true'i { return true }
	/ 'false'i { return false }

// negativeNumber
// 	= '-' number:number { return number * -1 }

number
	= float
	/ integer

float
	= left:integer "." right:integer { return parseFloat(`${left}.${right}`) }

integer
	= digits:[0-9]+ { return parseInt(digits.join(''), 10) }

var
	= name:name "[" _ index:expression _  "]" { return options.vars[name][index] }
	/ name:name { return typeof options.vars[name] !== 'undefined' ? options.vars[name] : constants[name.toLowerCase()] }

string
	= '"' contents:(!'"' c:. { return c })* '"' { return contents.join('') }
	/ "'" contents:(!"'" c:. { return c })* "'" { return contents.join('') }

name
	= firstChar:[A-Za-z_] lastChars:[A-Za-z_0-9]* { return firstChar + lastChars.join('') }

// optional whitespace
_  = [ \t\r\n]*