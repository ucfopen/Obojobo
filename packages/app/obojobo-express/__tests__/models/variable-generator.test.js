jest.mock('obojobo-document-engine/src/scripts/common/util/shuffle')

const shuffle = require('obojobo-document-engine/src/scripts/common/util/shuffle')

// ideally we could import the list of constants defined in the document engine
// unfortunately they're exported in a way Node doesn't like because JavaScript is stupid
// revisit this when JavaScript is less stupid
const STATIC_VALUE = 'static-value'
const RANDOM_NUMBER = 'random-number'
const STATIC_LIST = 'static-list'
const RANDOM_LIST = 'random-list'
const RANDOM_SEQUENCE = 'random-sequence'
const PICK_ONE = 'pick-one'
const PICK_LIST = 'pick-list'

const VariableGenerator = require('../../server/models/variable-generator')

// there are other methods used by this class which we can't test directly
// we'll have to make due by checking their outputs to make sure everything works
describe('VariableGenerator', () => {
	// we need Math.random to act predictably if we're to have any hope of testing some of these
	// const realMath = global.Math
	// beforeAll(() => {
	// 	global.Math.random = jest.fn()
	// })
	// beforeEach(() => {
	// 	global.Math.random.mockReset()
	// })
	// afterAll(() => {
	// 	global.Math = realMath
	// })

	beforeEach(() => {
		jest.restoreAllMocks()
	})

	// technically we should also do these same tests with decimalPlaces
	// but it'll be the same as min/max, so this should be fine for now
	// also technically, we should also do these same tests for other range-based methods
	// but again, it'll be the same as getRandomList, so this should be fine for now
	test('getRandomList throws when min/max size string is not defined', () => {
		expect(() => {
			VariableGenerator.getRandomList({})
		}).toThrow("Range 'undefined' is invalid!")
	})

	test('getRandomList throws when min/max size string is null', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: null
			})
		}).toThrow("Range 'null' is invalid!")
	})

	test('getRandomList throws when min/max size string an empty string', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: ''
			})
		}).toThrow("Range '' has non-numeric values!")
	})

	test('getRandomList throws when min/max size string is formatted to be non-inclusive', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: '(1,1)'
			})
		}).toThrow("Range '(1,1)' must be inclusive!")
	})

	test('getRandomList throws when min/max size string has a higher value before a lower value', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: '[2,1]'
			})
		}).toThrow("Range '[2,1]' is inverted!")
	})

	test('getRandomList throws when min/max size string has a non-numeric min or max values', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: '["invalid",1]'
			})
		}).toThrow('Range \'["invalid",1]\' has non-numeric values!')
		expect(() => {
			VariableGenerator.getRandomList({
				size: '[1,"invalid"]'
			})
		}).toThrow('Range \'[1,"invalid"]\' has non-numeric values!')
	})

	test('getRandomList throws when decimalPlaces contains negative numbers', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: '[1,1]',
				value: '[1,2]',
				decimalPlaces: '[-1,0]'
			})
		}).toThrow("Range '[-1,0]' must be positive!")
	})

	test('getRandomList throws when decimalPlaces contains non-integers', () => {
		expect(() => {
			VariableGenerator.getRandomList({
				size: '[1,1]',
				value: '[1,2]',
				decimalPlaces: '[0,1.2]'
			})
		}).toThrow("Range '[0,1.2]' must be int values only!")
	})

	// this is kind of a lie - we can't really test that everything works with randomly selected values in ranges
	// we'll mostly be testing that things are being called correctly
	test('getRandomList correctly generates a random list - non-unique values allowed', () => {
		// we'll be testing this function on its own later
		// being able to circumvent it allows us to test everything else more easily
		jest
			.spyOn(VariableGenerator, 'rand')
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(2)

		const varDef = {
			size: '[1,2]',
			value: '[1,10]',
			decimalPlaces: '[1,2]',
			unique: false
		}
		const randomList = VariableGenerator.getRandomList(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(5)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([1, 2]) // size
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([1, 2]) // decimal places
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([1, 10, 1]) // first value - third arg is decimal places
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([1, 2]) // decimal places again
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([1, 10, 1]) // second value
		expect(randomList).toEqual([2, 2])
	})

	test('getRandomList correctly generates a random list - only unique values allowed', () => {
		// we'll be testing this function on its own later
		// being able to circumvent it allows us to test everything else more easily
		jest
			.spyOn(VariableGenerator, 'rand')
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(3)

		const varDef = {
			size: '[1,2]',
			value: '[1,10]',
			decimalPlaces: '[1,2]',
			unique: true
		}
		const randomList = VariableGenerator.getRandomList(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(7)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([1, 2]) // size
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([1, 2]) // decimal places
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([1, 10, 1]) // first value - third arg is decimal places
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([1, 2]) // decimal places again
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([1, 10, 1]) // second value
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([1, 2]) // decimal places again... again
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([1, 10, 1]) // second value, second attempt
		expect(randomList).toEqual([2, 3])
	})

	test('getRandomSequence throws when given an invalid series type', () => {
		const varDef = {
			start: 1,
			step: 1,
			size: '[1,1]',
			seriesType: 'invalid-series-type'
		}
		expect(() => {
			VariableGenerator.getRandomSequence(varDef)
		}).toThrow('Invalid sequence seriesType!')
	})

	test('getRandomSequence correctly generates a sequence - arithmetic', () => {
		// luckily the only thing randomly selected here is the list size
		jest.spyOn(VariableGenerator, 'rand').mockReturnValueOnce(3)

		const varDef = {
			start: 10,
			step: 2,
			size: '[2,4]',
			seriesType: 'arithmetic'
		}
		const randomSequence = VariableGenerator.getRandomSequence(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(1)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([2, 4]) // size
		expect(randomSequence).toEqual([10, 12, 14])
	})

	test('getRandomSequence correctly generates a sequence - geometric', () => {
		// luckily the only thing randomly selected here is the list size
		jest.spyOn(VariableGenerator, 'rand').mockReturnValueOnce(3)

		const varDef = {
			start: 10,
			step: 2,
			size: '[2,4]',
			seriesType: 'geometric'
		}
		const randomSequence = VariableGenerator.getRandomSequence(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(1)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([2, 4]) // size
		expect(randomSequence).toEqual([10, 20, 40])
	})

	test('getRandomSequence correctly forces start and step to 1 if they are unset', () => {
		// luckily the only thing randomly selected here is the list size
		jest.spyOn(VariableGenerator, 'rand').mockReturnValueOnce(3)

		const varDef = {
			size: '[2,4]',
			seriesType: 'arithmetic'
		}
		const randomSequence = VariableGenerator.getRandomSequence(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(1)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([2, 4]) // size
		expect(randomSequence).toEqual([1, 2, 3])
	})

	// we're mocking the function that actually generates the random number here, so this is a lie
	// but we're mostly just making sure the correct arguments are being sent to what we're mocking anyway
	test('getRandomNumber gets a random number', () => {
		jest
			.spyOn(VariableGenerator, 'rand')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(3)

		const varDef = {
			value: '[2,4]',
			decimalPlaces: '[0,1]'
		}
		const randomNumber = VariableGenerator.getRandomNumber(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(2)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([0, 1]) // decimal places
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([2, 4, 0]) // value
		expect(randomNumber).toBe(3)
	})

	// see above re: randomness being a lie
	test('getPickOne returns a random item from a list', () => {
		jest.spyOn(VariableGenerator, 'rand').mockReturnValueOnce(2)

		const varDef = {
			value: '2,4,6,8,10,12,420'
		}
		const randomNumber = VariableGenerator.getPickOne(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(1)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([0, 6])
		expect(randomNumber).toBe('6')
	})

	test('getPickList throws when choose contains zero', () => {
		jest.spyOn(VariableGenerator, 'rand')

		const varDef = {
			choose: '[0,0]',
			value: '1,2'
		}
		expect(() => {
			VariableGenerator.getPickList(varDef)
		}).toThrow("Range '[0,0]' values must be non-zero!")
		expect(VariableGenerator.rand).not.toHaveBeenCalled()
	})

	test('getPickList throws when chooseMin is higher than the list size', () => {
		jest.spyOn(VariableGenerator, 'rand')

		const varDef = {
			choose: '[3,3]',
			value: '1,2'
		}
		expect(() => {
			VariableGenerator.getPickList(varDef)
		}).toThrow('min or max cannot be larger than the size of the list!')
		expect(VariableGenerator.rand).not.toHaveBeenCalled()
	})

	test('getPickList throws when chooseMax is higher than the list size', () => {
		jest.spyOn(VariableGenerator, 'rand')

		const varDef = {
			choose: '[2,3]',
			value: '1,2'
		}
		expect(() => {
			VariableGenerator.getPickList(varDef)
		}).toThrow('min or max cannot be larger than the size of the list!')
		expect(VariableGenerator.rand).not.toHaveBeenCalled()
	})

	test('getPickList returns a random list in order', () => {
		jest
			.spyOn(VariableGenerator, 'rand')
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(4)

		const varDef = {
			choose: '[2,4]',
			value: '2,4,6,8,10,12,420',
			ordered: true
		}
		const pickList = VariableGenerator.getPickList(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(5)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([2, 4]) // list size
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([0, 0]) // decimal places
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([0, 6, 0]) // first list index
		expect(VariableGenerator.rand.mock.calls[3]).toEqual([0, 0]) // decimal places
		expect(VariableGenerator.rand.mock.calls[4]).toEqual([0, 6, 0]) // second list index
		expect(pickList).toEqual(['4', '10'])
	})

	test('getPickList returns a random list, unordered', () => {
		// again - we're not testing that the list is actually shuffled, just that this is being called
		shuffle.mockReturnValueOnce(['10', '4'])

		jest
			.spyOn(VariableGenerator, 'rand')
			.mockReturnValueOnce(2)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(4)

		const varDef = {
			choose: '[2,4]',
			value: '2,4,6,8,10,12,420'
		}
		const pickList = VariableGenerator.getPickList(varDef)
		expect(VariableGenerator.rand).toHaveBeenCalledTimes(5)
		expect(VariableGenerator.rand.mock.calls[0]).toEqual([2, 4]) // list size
		expect(VariableGenerator.rand.mock.calls[1]).toEqual([0, 0]) // decimal places
		expect(VariableGenerator.rand.mock.calls[2]).toEqual([0, 6, 0]) // first list index
		expect(VariableGenerator.rand.mock.calls[3]).toEqual([0, 0]) // decimal places
		expect(VariableGenerator.rand.mock.calls[4]).toEqual([0, 6, 0]) // second list index

		expect(shuffle).toHaveBeenCalledTimes(1)
		expect(shuffle).toHaveBeenCalledWith(['4', '10'])

		expect(pickList).toEqual(['10', '4'])
	})

	test('rand throws if the provided min is larger than the provided max', () => {
		expect(() => {
			VariableGenerator.rand(10, 1)
		}).toThrow('Min cannot be above max!')
	})

	test('rand throws if the provided number of decimals is lower than 0', () => {
		expect(() => {
			VariableGenerator.rand(1, 1, -1)
		}).toThrow('Decimals must be >= 0!')
	})

	test('generateOne throws if given an invalid variable type', () => {
		expect(() => {
			VariableGenerator.generateOne({ type: 'invalid-type ' })
		}).toThrow('Unexpected type!')
	})

	test.each`
		variableType       | targetFunction
		${RANDOM_LIST}     | ${'getRandomList'}
		${RANDOM_SEQUENCE} | ${'getRandomSequence'}
		${RANDOM_NUMBER}   | ${'getRandomNumber'}
		${PICK_ONE}        | ${'getPickOne'}
		${PICK_LIST}       | ${'getPickList'}
		${STATIC_VALUE}    | ${'var-val'}
		${STATIC_LIST}     | ${'var-val'}
	`(
		"generateOne calls internal function $targetFunction when variable type is '$variableType'",
		({ variableType, targetFunction }) => {
			const allFunctions = [
				'getRandomList',
				'getRandomSequence',
				'getRandomNumber',
				'getPickOne',
				'getPickList'
			]
			// mock all of the functions downstream of generateOne
			// have them return their own name just so we can make sure they're being called
			// actual implementations of each don't matter here, we just want to check what's called
			allFunctions.forEach(fName => {
				jest.spyOn(VariableGenerator, fName).mockReturnValue(fName)
			})

			const result = VariableGenerator.generateOne({ type: variableType, value: 'var-val' })
			allFunctions.forEach(fName => {
				if (fName === targetFunction) {
					expect(VariableGenerator[fName]).toHaveBeenCalledTimes(1)
				} else {
					expect(VariableGenerator[fName]).not.toHaveBeenCalled()
				}
				// reset any calls that might have been made to this function
				VariableGenerator[fName].mockReset()
			})

			// we're kind of overloading targetFunction to equal the return value for the static variable types
			expect(result).toBe(targetFunction)
		}
	)
})
