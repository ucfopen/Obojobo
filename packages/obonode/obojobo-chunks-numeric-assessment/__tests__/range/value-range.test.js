/* eslint-disable no-new */

import ValueRange from '../../range/value-range'

describe('ValueRange', () => {
	test('Constructor with no arguments creates class with expected values', () => {
		expect(new ValueRange().toJSON()).toEqual({
			isempty: false,
			min: null,
			isMinInclusive: null,
			max: null,
			isMaxInclusive: null
		})
	})

	test.each`
		input                                                               | isempty  | min     | isMinInclusive | max     | isMaxInclusive
		${''}                                                               | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${null}                                                             | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${false}                                                            | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${0}                                                                | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${''}                                                               | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${1}                                                                | ${false} | ${null} | ${null}        | ${null} | ${null}
		${'truthy'}                                                         | ${false} | ${null} | ${null}        | ${null} | ${null}
		${true}                                                             | ${false} | ${null} | ${null}        | ${null} | ${null}
		${{}}                                                               | ${false} | ${null} | ${null}        | ${null} | ${null}
		${'[1,2]'}                                                          | ${false} | ${1}    | ${true}        | ${2}    | ${true}
		${'(*,2]'}                                                          | ${false} | ${null} | ${null}        | ${2}    | ${true}
		${'[1,*)'}                                                          | ${false} | ${1}    | ${true}        | ${null} | ${null}
		${'(1,2)'}                                                          | ${false} | ${1}    | ${false}       | ${2}    | ${false}
		${'(*,2)'}                                                          | ${false} | ${null} | ${null}        | ${2}    | ${false}
		${'(1,*)'}                                                          | ${false} | ${1}    | ${false}       | ${null} | ${null}
		${'1'}                                                              | ${false} | ${1}    | ${true}        | ${1}    | ${true}
		${'[1,1]'}                                                          | ${false} | ${1}    | ${true}        | ${1}    | ${true}
		${'(*,*)'}                                                          | ${false} | ${null} | ${null}        | ${null} | ${null}
		${'*'}                                                              | ${false} | ${null} | ${null}        | ${null} | ${null}
		${'(1,1)'}                                                          | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${{ isempty: true }}                                                | ${true}  | ${null} | ${null}        | ${null} | ${null}
		${{ min: 1 }}                                                       | ${false} | ${1}    | ${true}        | ${null} | ${null}
		${{ min: 1, isMinInclusive: false }}                                | ${false} | ${1}    | ${false}       | ${null} | ${null}
		${{ min: 1, isMinInclusive: true }}                                 | ${false} | ${1}    | ${true}        | ${null} | ${null}
		${{ max: 2 }}                                                       | ${false} | ${null} | ${null}        | ${2}    | ${true}
		${{ max: 2, isMaxInclusive: false }}                                | ${false} | ${null} | ${null}        | ${2}    | ${false}
		${{ max: 2, isMaxInclusive: true }}                                 | ${false} | ${null} | ${null}        | ${2}    | ${true}
		${{ min: 1, isMinInclusive: false, max: 2, isMaxInclusive: false }} | ${false} | ${1}    | ${false}       | ${2}    | ${false}
	`(
		`Constructor($input)={isempty:$isempty,min:$min,isMinInclusive:$isMinInclusive,max:$max,isMaxInclusive:$isMaxInclusive}`,
		({ input, isempty, min, isMinInclusive, max, isMaxInclusive }) => {
			expect(new ValueRange(input).toJSON()).toEqual({
				isempty,
				min,
				isMinInclusive,
				max,
				isMaxInclusive
			})
		}
	)

	test('Backwards range throws error', () => {
		expect(() => {
			new ValueRange('[99,-99]')
		}).toThrow('Invalid range: min value must be larger than max value')
	})

	test('Non-inclusive singular range throws error', () => {
		expect(() => {
			new ValueRange('[1,1)')
		}).toThrow('Invalid range: Singular range must have inclusive min and max')

		expect(() => {
			new ValueRange('(1,1]')
		}).toThrow('Invalid range: Singular range must have inclusive min and max')
	})

	test('init resets values to default all-values range', () => {
		const r = new ValueRange()

		r.isempty = 'a'
		r.min = 'b'
		r.max = 'c'
		r.isMinInclusive = 'd'
		r.isMaxInclusive = 'e'

		expect(r.toJSON()).toEqual({
			isempty: 'a',
			min: 'b',
			max: 'c',
			isMinInclusive: 'd',
			isMaxInclusive: 'e'
		})

		r.init()

		expect(r.toJSON()).toEqual({
			isempty: false,
			min: null,
			isMinInclusive: null,
			max: null,
			isMaxInclusive: null
		})
	})

	test('close results values to a empty range', () => {
		const r = new ValueRange()

		r.isempty = 'a'
		r.min = 'b'
		r.max = 'c'
		r.isMinInclusive = 'd'
		r.isMaxInclusive = 'e'

		expect(r.toJSON()).toEqual({
			isempty: 'a',
			min: 'b',
			max: 'c',
			isMinInclusive: 'd',
			isMaxInclusive: 'e'
		})

		r.close()

		expect(r.toJSON()).toEqual({
			isempty: true,
			min: null,
			isMinInclusive: null,
			max: null,
			isMaxInclusive: null
		})
	})

	test('isValueInRange will return boolean if given value is inside a range', () => {
		//-Infinity to Infinity
		expect(new ValueRange().isValueInRange(-Infinity)).toBe(true)
		expect(new ValueRange().isValueInRange(-1.1)).toBe(true)
		expect(new ValueRange().isValueInRange(-1)).toBe(true)
		expect(new ValueRange().isValueInRange(0)).toBe(true)
		expect(new ValueRange().isValueInRange(1)).toBe(true)
		expect(new ValueRange().isValueInRange(1.1)).toBe(true)
		expect(new ValueRange().isValueInRange(Infinity)).toBe(true)

		//-1 to 1
		expect(new ValueRange('[-1,1]').isValueInRange(-Infinity)).toBe(false)
		expect(new ValueRange('[-1,1]').isValueInRange(-1.1)).toBe(false)
		expect(new ValueRange('[-1,1]').isValueInRange(-1)).toBe(true)
		expect(new ValueRange('[-1,1]').isValueInRange(0)).toBe(true)
		expect(new ValueRange('[-1,1]').isValueInRange(1)).toBe(true)
		expect(new ValueRange('[-1,1]').isValueInRange(1.1)).toBe(false)
		expect(new ValueRange('[-1,1]').isValueInRange(Infinity)).toBe(false)

		// > -1 and < 1
		expect(new ValueRange('(-1,1)').isValueInRange(-Infinity)).toBe(false)
		expect(new ValueRange('(-1,1)').isValueInRange(-1.1)).toBe(false)
		expect(new ValueRange('(-1,1)').isValueInRange(-1)).toBe(false)
		expect(new ValueRange('(-1,1)').isValueInRange(0)).toBe(true)
		expect(new ValueRange('(-1,1)').isValueInRange(1)).toBe(false)
		expect(new ValueRange('(-1,1)').isValueInRange(1.1)).toBe(false)
		expect(new ValueRange('(-1,1)').isValueInRange(Infinity)).toBe(false)

		// >= -1
		expect(new ValueRange('[-1,*)').isValueInRange(-Infinity)).toBe(false)
		expect(new ValueRange('[-1,*)').isValueInRange(-1.1)).toBe(false)
		expect(new ValueRange('[-1,*)').isValueInRange(-1)).toBe(true)
		expect(new ValueRange('[-1,*)').isValueInRange(0)).toBe(true)
		expect(new ValueRange('[-1,*)').isValueInRange(1)).toBe(true)
		expect(new ValueRange('[-1,*)').isValueInRange(1.1)).toBe(true)
		expect(new ValueRange('[-1,*)').isValueInRange(Infinity)).toBe(true)

		// <= 1
		expect(new ValueRange('(*,1]').isValueInRange(-Infinity)).toBe(true)
		expect(new ValueRange('(*,1]').isValueInRange(-1.1)).toBe(true)
		expect(new ValueRange('(*,1]').isValueInRange(-1)).toBe(true)
		expect(new ValueRange('(*,1]').isValueInRange(0)).toBe(true)
		expect(new ValueRange('(*,1]').isValueInRange(1)).toBe(true)
		expect(new ValueRange('(*,1]').isValueInRange(1.1)).toBe(false)
		expect(new ValueRange('(*,1]').isValueInRange(Infinity)).toBe(false)

		// No values (empty range)
		expect(new ValueRange('').isValueInRange(-Infinity)).toBe(false)
		expect(new ValueRange('').isValueInRange(-1.1)).toBe(false)
		expect(new ValueRange('').isValueInRange(-1)).toBe(false)
		expect(new ValueRange('').isValueInRange(0)).toBe(false)
		expect(new ValueRange('').isValueInRange(1)).toBe(false)
		expect(new ValueRange('').isValueInRange(1.1)).toBe(false)
		expect(new ValueRange('').isValueInRange(Infinity)).toBe(false)
	})

	test.each`
		range       | test         | position
		${'[-1,1]'} | ${-Infinity} | ${'below'}
		${'[-1,1]'} | ${-1.1}      | ${'below'}
		${'[-1,1]'} | ${-1}        | ${'equal'}
		${'[-1,1]'} | ${0}         | ${'above'}
		${'[-1,1]'} | ${1}         | ${'above'}
		${'[-1,1]'} | ${1.1}       | ${'above'}
		${'[-1,1]'} | ${Infinity}  | ${'above'}
		${'(-1,1]'} | ${-Infinity} | ${'below'}
		${'(-1,1]'} | ${-1.1}      | ${'below'}
		${'(-1,1]'} | ${-1}        | ${'below'}
		${'(-1,1]'} | ${0}         | ${'above'}
		${'(-1,1]'} | ${1}         | ${'above'}
		${'(-1,1]'} | ${1.1}       | ${'above'}
		${'(-1,1]'} | ${Infinity}  | ${'above'}
		${'(*,1]'}  | ${-Infinity} | ${'above'}
		${'(*,1]'}  | ${-1.1}      | ${'above'}
		${'(*,1]'}  | ${-1}        | ${'above'}
		${'(*,1]'}  | ${0}         | ${'above'}
		${'(*,1]'}  | ${1}         | ${'above'}
		${'(*,1]'}  | ${1.1}       | ${'above'}
		${'(*,1]'}  | ${Infinity}  | ${'above'}
		${'[-1,*)'} | ${-Infinity} | ${'below'}
		${'[-1,*)'} | ${-1.1}      | ${'below'}
		${'[-1,*)'} | ${-1}        | ${'equal'}
		${'[-1,*)'} | ${0}         | ${'above'}
		${'[-1,*)'} | ${1}         | ${'above'}
		${'[-1,*)'} | ${1.1}       | ${'above'}
		${'[-1,*)'} | ${Infinity}  | ${'above'}
		${'*'}      | ${-Infinity} | ${'above'}
		${'*'}      | ${-1.1}      | ${'above'}
		${'*'}      | ${-1}        | ${'above'}
		${'*'}      | ${0}         | ${'above'}
		${'*'}      | ${1}         | ${'above'}
		${'*'}      | ${1.1}       | ${'above'}
		${'*'}      | ${Infinity}  | ${'above'}
		${'1'}      | ${-Infinity} | ${'below'}
		${'1'}      | ${-1.1}      | ${'below'}
		${'1'}      | ${-1}        | ${'below'}
		${'1'}      | ${0}         | ${'below'}
		${'1'}      | ${1}         | ${'equal'}
		${'1'}      | ${1.1}       | ${'above'}
		${'1'}      | ${Infinity}  | ${'above'}
		${''}       | ${-Infinity} | ${'empty'}
		${''}       | ${-1.1}      | ${'empty'}
		${''}       | ${-1}        | ${'empty'}
		${''}       | ${0}         | ${'empty'}
		${''}       | ${1}         | ${'empty'}
		${''}       | ${1.1}       | ${'empty'}
		${''}       | ${Infinity}  | ${'empty'}
	`(`$range getMinValuePosition($test)={$position}`, ({ range, test, position }) => {
		expect(new ValueRange(range).getMinValuePosition(test)).toBe(position)
	})

	test.each`
		range       | test         | position
		${'[-1,1]'} | ${-Infinity} | ${'below'}
		${'[-1,1]'} | ${-1.1}      | ${'below'}
		${'[-1,1]'} | ${-1}        | ${'below'}
		${'[-1,1]'} | ${0}         | ${'below'}
		${'[-1,1]'} | ${1}         | ${'equal'}
		${'[-1,1]'} | ${1.1}       | ${'above'}
		${'[-1,1]'} | ${Infinity}  | ${'above'}
		${'(-1,1]'} | ${-Infinity} | ${'below'}
		${'(-1,1]'} | ${-1.1}      | ${'below'}
		${'(-1,1]'} | ${-1}        | ${'below'}
		${'(-1,1]'} | ${0}         | ${'below'}
		${'(-1,1]'} | ${1}         | ${'equal'}
		${'(-1,1]'} | ${1.1}       | ${'above'}
		${'(-1,1]'} | ${Infinity}  | ${'above'}
		${'(*,1]'}  | ${-Infinity} | ${'below'}
		${'(*,1]'}  | ${-1.1}      | ${'below'}
		${'(*,1]'}  | ${-1}        | ${'below'}
		${'(*,1]'}  | ${0}         | ${'below'}
		${'(*,1]'}  | ${1}         | ${'equal'}
		${'(*,1]'}  | ${1.1}       | ${'above'}
		${'(*,1]'}  | ${Infinity}  | ${'above'}
		${'[-1,*)'} | ${-Infinity} | ${'below'}
		${'[-1,*)'} | ${-1.1}      | ${'below'}
		${'[-1,*)'} | ${-1}        | ${'below'}
		${'[-1,*)'} | ${0}         | ${'below'}
		${'[-1,*)'} | ${1}         | ${'below'}
		${'[-1,*)'} | ${1.1}       | ${'below'}
		${'[-1,*)'} | ${Infinity}  | ${'below'}
		${'*'}      | ${-Infinity} | ${'below'}
		${'*'}      | ${-1.1}      | ${'below'}
		${'*'}      | ${-1}        | ${'below'}
		${'*'}      | ${0}         | ${'below'}
		${'*'}      | ${1}         | ${'below'}
		${'*'}      | ${1.1}       | ${'below'}
		${'*'}      | ${Infinity}  | ${'below'}
		${'1'}      | ${-Infinity} | ${'below'}
		${'1'}      | ${-1.1}      | ${'below'}
		${'1'}      | ${-1}        | ${'below'}
		${'1'}      | ${0}         | ${'below'}
		${'1'}      | ${1}         | ${'equal'}
		${'1'}      | ${1.1}       | ${'above'}
		${'1'}      | ${Infinity}  | ${'above'}
		${''}       | ${-Infinity} | ${'empty'}
		${''}       | ${-1.1}      | ${'empty'}
		${''}       | ${-1}        | ${'empty'}
		${''}       | ${0}         | ${'empty'}
		${''}       | ${1}         | ${'empty'}
		${''}       | ${1.1}       | ${'empty'}
		${''}       | ${Infinity}  | ${'empty'}
	`(`$range getMaxValuePosition($test)={$position}`, ({ range, test, position }) => {
		expect(new ValueRange(range).getMaxValuePosition(test)).toBe(position)
	})

	//////

	test.each`
		range       | test         | isWithinMin
		${'[-1,1]'} | ${-Infinity} | ${false}
		${'[-1,1]'} | ${-1.1}      | ${false}
		${'[-1,1]'} | ${-1}        | ${true}
		${'[-1,1]'} | ${0}         | ${true}
		${'[-1,1]'} | ${1}         | ${true}
		${'[-1,1]'} | ${1.1}       | ${true}
		${'[-1,1]'} | ${Infinity}  | ${true}
		${'(-1,1]'} | ${-Infinity} | ${false}
		${'(-1,1]'} | ${-1.1}      | ${false}
		${'(-1,1]'} | ${-1}        | ${false}
		${'(-1,1]'} | ${0}         | ${true}
		${'(-1,1]'} | ${1}         | ${true}
		${'(-1,1]'} | ${1.1}       | ${true}
		${'(-1,1]'} | ${Infinity}  | ${true}
		${'(*,1]'}  | ${-Infinity} | ${true}
		${'(*,1]'}  | ${-1.1}      | ${true}
		${'(*,1]'}  | ${-1}        | ${true}
		${'(*,1]'}  | ${0}         | ${true}
		${'(*,1]'}  | ${1}         | ${true}
		${'(*,1]'}  | ${1.1}       | ${true}
		${'(*,1]'}  | ${Infinity}  | ${true}
		${'[-1,*)'} | ${-Infinity} | ${false}
		${'[-1,*)'} | ${-1.1}      | ${false}
		${'[-1,*)'} | ${-1}        | ${true}
		${'[-1,*)'} | ${0}         | ${true}
		${'[-1,*)'} | ${1}         | ${true}
		${'[-1,*)'} | ${1.1}       | ${true}
		${'[-1,*)'} | ${Infinity}  | ${true}
		${'*'}      | ${-Infinity} | ${true}
		${'*'}      | ${-1.1}      | ${true}
		${'*'}      | ${-1}        | ${true}
		${'*'}      | ${0}         | ${true}
		${'*'}      | ${1}         | ${true}
		${'*'}      | ${1.1}       | ${true}
		${'*'}      | ${Infinity}  | ${true}
		${'1'}      | ${-Infinity} | ${false}
		${'1'}      | ${-1.1}      | ${false}
		${'1'}      | ${-1}        | ${false}
		${'1'}      | ${0}         | ${false}
		${'1'}      | ${1}         | ${true}
		${'1'}      | ${1.1}       | ${true}
		${'1'}      | ${Infinity}  | ${true}
		${''}       | ${-Infinity} | ${false}
		${''}       | ${-1.1}      | ${false}
		${''}       | ${-1}        | ${false}
		${''}       | ${0}         | ${false}
		${''}       | ${1}         | ${false}
		${''}       | ${1.1}       | ${false}
		${''}       | ${Infinity}  | ${false}
	`(`$range isValueWithinMin($test)={$isWithinMin}`, ({ range, test, isWithinMin }) => {
		expect(new ValueRange(range).isValueWithinMin(test)).toBe(isWithinMin)
	})

	test.each`
		range       | test         | isWithinMax
		${'[-1,1]'} | ${-Infinity} | ${true}
		${'[-1,1]'} | ${-1.1}      | ${true}
		${'[-1,1]'} | ${-1}        | ${true}
		${'[-1,1]'} | ${0}         | ${true}
		${'[-1,1]'} | ${1}         | ${true}
		${'[-1,1]'} | ${1.1}       | ${false}
		${'[-1,1]'} | ${Infinity}  | ${false}
		${'(-1,1]'} | ${-Infinity} | ${true}
		${'(-1,1]'} | ${-1.1}      | ${true}
		${'(-1,1]'} | ${-1}        | ${true}
		${'(-1,1]'} | ${0}         | ${true}
		${'(-1,1]'} | ${1}         | ${true}
		${'(-1,1]'} | ${1.1}       | ${false}
		${'(-1,1]'} | ${Infinity}  | ${false}
		${'(*,1]'}  | ${-Infinity} | ${true}
		${'(*,1]'}  | ${-1.1}      | ${true}
		${'(*,1]'}  | ${-1}        | ${true}
		${'(*,1]'}  | ${0}         | ${true}
		${'(*,1]'}  | ${1}         | ${true}
		${'(*,1]'}  | ${1.1}       | ${false}
		${'(*,1]'}  | ${Infinity}  | ${false}
		${'[-1,*)'} | ${-Infinity} | ${true}
		${'[-1,*)'} | ${-1.1}      | ${true}
		${'[-1,*)'} | ${-1}        | ${true}
		${'[-1,*)'} | ${0}         | ${true}
		${'[-1,*)'} | ${1}         | ${true}
		${'[-1,*)'} | ${1.1}       | ${true}
		${'[-1,*)'} | ${Infinity}  | ${true}
		${'*'}      | ${-Infinity} | ${true}
		${'*'}      | ${-1.1}      | ${true}
		${'*'}      | ${-1}        | ${true}
		${'*'}      | ${0}         | ${true}
		${'*'}      | ${1}         | ${true}
		${'*'}      | ${1.1}       | ${true}
		${'*'}      | ${Infinity}  | ${true}
		${'1'}      | ${-Infinity} | ${true}
		${'1'}      | ${-1.1}      | ${true}
		${'1'}      | ${-1}        | ${true}
		${'1'}      | ${0}         | ${true}
		${'1'}      | ${1}         | ${true}
		${'1'}      | ${1.1}       | ${false}
		${'1'}      | ${Infinity}  | ${false}
		${''}       | ${-Infinity} | ${false}
		${''}       | ${-1.1}      | ${false}
		${''}       | ${-1}        | ${false}
		${''}       | ${0}         | ${false}
		${''}       | ${1}         | ${false}
		${''}       | ${1.1}       | ${false}
		${''}       | ${Infinity}  | ${false}
	`(`$range isValueWithinMax($test)={$isWithinMax}`, ({ range, test, isWithinMax }) => {
		expect(new ValueRange(range).isValueWithinMax(test)).toBe(isWithinMax)
	})

	////

	test.each`
		range       | test         | position
		${'[-1,1]'} | ${-Infinity} | ${'belowMin'}
		${'[-1,1]'} | ${-1.1}      | ${'belowMin'}
		${'[-1,1]'} | ${-1}        | ${'inside'}
		${'[-1,1]'} | ${0}         | ${'inside'}
		${'[-1,1]'} | ${1}         | ${'inside'}
		${'[-1,1]'} | ${1.1}       | ${'aboveMax'}
		${'[-1,1]'} | ${Infinity}  | ${'aboveMax'}
		${'(-1,1]'} | ${-Infinity} | ${'belowMin'}
		${'(-1,1]'} | ${-1.1}      | ${'belowMin'}
		${'(-1,1]'} | ${-1}        | ${'belowMin'}
		${'(-1,1]'} | ${0}         | ${'inside'}
		${'(-1,1]'} | ${1}         | ${'inside'}
		${'(-1,1]'} | ${1.1}       | ${'aboveMax'}
		${'(-1,1]'} | ${Infinity}  | ${'aboveMax'}
		${'(*,1]'}  | ${-Infinity} | ${'inside'}
		${'(*,1]'}  | ${-1.1}      | ${'inside'}
		${'(*,1]'}  | ${-1}        | ${'inside'}
		${'(*,1]'}  | ${0}         | ${'inside'}
		${'(*,1]'}  | ${1}         | ${'inside'}
		${'(*,1]'}  | ${1.1}       | ${'aboveMax'}
		${'(*,1]'}  | ${Infinity}  | ${'aboveMax'}
		${'[-1,*)'} | ${-Infinity} | ${'belowMin'}
		${'[-1,*)'} | ${-1.1}      | ${'belowMin'}
		${'[-1,*)'} | ${-1}        | ${'inside'}
		${'[-1,*)'} | ${0}         | ${'inside'}
		${'[-1,*)'} | ${1}         | ${'inside'}
		${'[-1,*)'} | ${1.1}       | ${'inside'}
		${'[-1,*)'} | ${Infinity}  | ${'inside'}
		${'*'}      | ${-Infinity} | ${'inside'}
		${'*'}      | ${-1.1}      | ${'inside'}
		${'*'}      | ${-1}        | ${'inside'}
		${'*'}      | ${0}         | ${'inside'}
		${'*'}      | ${1}         | ${'inside'}
		${'*'}      | ${1.1}       | ${'inside'}
		${'*'}      | ${Infinity}  | ${'inside'}
		${'1'}      | ${-Infinity} | ${'belowMin'}
		${'1'}      | ${-1.1}      | ${'belowMin'}
		${'1'}      | ${-1}        | ${'belowMin'}
		${'1'}      | ${0}         | ${'belowMin'}
		${'1'}      | ${1}         | ${'inside'}
		${'1'}      | ${1.1}       | ${'aboveMax'}
		${'1'}      | ${Infinity}  | ${'aboveMax'}
		${''}       | ${-Infinity} | ${'empty'}
		${''}       | ${-1.1}      | ${'empty'}
		${''}       | ${-1}        | ${'empty'}
		${''}       | ${0}         | ${'empty'}
		${''}       | ${1}         | ${'empty'}
		${''}       | ${1.1}       | ${'empty'}
		${''}       | ${Infinity}  | ${'empty'}
	`(`$range getValuePosition($test)={$position}`, ({ range, test, position }) => {
		expect(new ValueRange(range).getValuePosition(test)).toBe(position)
	})

	test.each`
		range
		${'[-1,1]'}
		${'(-1,1]'}
		${'(*,1]'}
		${'[-1,*)'}
		${'*'}
		${'1'}
		${''}
	`(`toString($range)`, ({ range }) => {
		expect(new ValueRange(range).toString()).toBe(range)
	})

	test('toJSON returns a JSON representation of a range', () => {
		const r = new ValueRange()
		r.isempty = 'a'
		r.min = 'b'
		r.isMinInclusive = 'c'
		r.max = 'd'
		r.isMaxInclusive = 'e'

		expect(r.toJSON()).toEqual({
			isempty: 'a',
			min: 'b',
			isMinInclusive: 'c',
			max: 'd',
			isMaxInclusive: 'e'
		})
	})

	test('clone creates a copy', () => {
		const r = new ValueRange('[1,2)')
		const clone = r.clone()

		expect(r).toEqual(clone)
		expect(r).not.toBe(clone)
	})

	test.each`
		range       | test         | value
		${'[-1,1]'} | ${-Infinity} | ${-1}
		${'[-1,1]'} | ${-1.1}      | ${-1}
		${'[-1,1]'} | ${-1}        | ${0}
		${'[-1,1]'} | ${0}         | ${1}
		${'[-1,1]'} | ${1}         | ${1}
		${'[-1,1]'} | ${1.1}       | ${1}
		${'[-1,1]'} | ${Infinity}  | ${1}
		${'(-1,1]'} | ${-Infinity} | ${-1}
		${'(-1,1]'} | ${-1.1}      | ${-1}
		${'(-1,1]'} | ${-1}        | ${0}
		${'(-1,1]'} | ${0}         | ${1}
		${'(-1,1]'} | ${1}         | ${1}
		${'(-1,1]'} | ${1.1}       | ${1}
		${'(-1,1]'} | ${Infinity}  | ${1}
		${'(*,1]'}  | ${-Infinity} | ${1}
		${'(*,1]'}  | ${-1.1}      | ${1}
		${'(*,1]'}  | ${-1}        | ${1}
		${'(*,1]'}  | ${0}         | ${1}
		${'(*,1]'}  | ${1}         | ${1}
		${'(*,1]'}  | ${1.1}       | ${1}
		${'(*,1]'}  | ${Infinity}  | ${1}
		${'[-1,*)'} | ${-Infinity} | ${-1}
		${'[-1,*)'} | ${-1.1}      | ${-1}
		${'[-1,*)'} | ${-1}        | ${0}
		${'[-1,*)'} | ${0}         | ${1}
		${'[-1,*)'} | ${1}         | ${1}
		${'[-1,*)'} | ${1.1}       | ${1}
		${'[-1,*)'} | ${Infinity}  | ${1}
		${'*'}      | ${-Infinity} | ${1}
		${'*'}      | ${-1.1}      | ${1}
		${'*'}      | ${-1}        | ${1}
		${'*'}      | ${0}         | ${1}
		${'*'}      | ${1}         | ${1}
		${'*'}      | ${1.1}       | ${1}
		${'*'}      | ${Infinity}  | ${1}
		${'1'}      | ${-Infinity} | ${-1}
		${'1'}      | ${-1.1}      | ${-1}
		${'1'}      | ${-1}        | ${-1}
		${'1'}      | ${0}         | ${-1}
		${'1'}      | ${1}         | ${0}
		${'1'}      | ${1.1}       | ${1}
		${'1'}      | ${Infinity}  | ${1}
		${''}       | ${-Infinity} | ${1}
		${''}       | ${-1.1}      | ${1}
		${''}       | ${-1}        | ${1}
		${''}       | ${0}         | ${1}
		${''}       | ${1}         | ${1}
		${''}       | ${1.1}       | ${1}
		${''}       | ${Infinity}  | ${1}
	`(`$range minCompare($test)={$value}`, ({ range, test, value }) => {
		expect(new ValueRange(range).minCompare(test)).toBe(value)
	})

	test('minEq returns true when minCompare is 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'minCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.minEq()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.minEq()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.minEq()).toBe(false)

		spy.mockRestore()
	})

	test('minLt returns true when minCompare is greater than 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'minCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.minLt()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.minLt()).toBe(false)

		spy.mockReturnValue(1)
		expect(r.minLt()).toBe(true)

		spy.mockRestore()
	})

	test('minLte returns true when minCompare is >= 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'minCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.minLte()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.minLte()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.minLte()).toBe(true)

		spy.mockRestore()
	})

	test('minGt returns true when minCompare is less than 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'minCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.minGt()).toBe(true)

		spy.mockReturnValue(0)
		expect(r.minGt()).toBe(false)

		spy.mockReturnValue(1)
		expect(r.minGt()).toBe(false)

		spy.mockRestore()
	})

	test('minGte returns true when minCompare is <= 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'minCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.minGte()).toBe(true)

		spy.mockReturnValue(0)
		expect(r.minGte()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.minGte()).toBe(false)

		spy.mockRestore()
	})

	test.each`
		range       | test         | value
		${'[-1,1]'} | ${-Infinity} | ${-1}
		${'[-1,1]'} | ${-1.1}      | ${-1}
		${'[-1,1]'} | ${-1}        | ${-1}
		${'[-1,1]'} | ${0}         | ${-1}
		${'[-1,1]'} | ${1}         | ${0}
		${'[-1,1]'} | ${1.1}       | ${1}
		${'[-1,1]'} | ${Infinity}  | ${1}
		${'(-1,1]'} | ${-Infinity} | ${-1}
		${'(-1,1]'} | ${-1.1}      | ${-1}
		${'(-1,1]'} | ${-1}        | ${-1}
		${'(-1,1]'} | ${0}         | ${-1}
		${'(-1,1]'} | ${1}         | ${0}
		${'(-1,1]'} | ${1.1}       | ${1}
		${'(-1,1]'} | ${Infinity}  | ${1}
		${'(*,1]'}  | ${-Infinity} | ${-1}
		${'(*,1]'}  | ${-1.1}      | ${-1}
		${'(*,1]'}  | ${-1}        | ${-1}
		${'(*,1]'}  | ${0}         | ${-1}
		${'(*,1]'}  | ${1}         | ${0}
		${'(*,1]'}  | ${1.1}       | ${1}
		${'(*,1]'}  | ${Infinity}  | ${1}
		${'[-1,*)'} | ${-Infinity} | ${-1}
		${'[-1,*)'} | ${-1.1}      | ${-1}
		${'[-1,*)'} | ${-1}        | ${-1}
		${'[-1,*)'} | ${0}         | ${-1}
		${'[-1,*)'} | ${1}         | ${-1}
		${'[-1,*)'} | ${1.1}       | ${-1}
		${'[-1,*)'} | ${Infinity}  | ${-1}
		${'*'}      | ${-Infinity} | ${-1}
		${'*'}      | ${-1.1}      | ${-1}
		${'*'}      | ${-1}        | ${-1}
		${'*'}      | ${0}         | ${-1}
		${'*'}      | ${1}         | ${-1}
		${'*'}      | ${1.1}       | ${-1}
		${'*'}      | ${Infinity}  | ${-1}
		${'1'}      | ${-Infinity} | ${-1}
		${'1'}      | ${-1.1}      | ${-1}
		${'1'}      | ${-1}        | ${-1}
		${'1'}      | ${0}         | ${-1}
		${'1'}      | ${1}         | ${0}
		${'1'}      | ${1.1}       | ${1}
		${'1'}      | ${Infinity}  | ${1}
		${''}       | ${-Infinity} | ${-1}
		${''}       | ${-1.1}      | ${-1}
		${''}       | ${-1}        | ${-1}
		${''}       | ${0}         | ${-1}
		${''}       | ${1}         | ${-1}
		${''}       | ${1.1}       | ${-1}
		${''}       | ${Infinity}  | ${-1}
	`(`$range maxCompare($test)={$value}`, ({ range, test, value }) => {
		expect(new ValueRange(range).maxCompare(test)).toBe(value)
	})

	test('maxEq returns true when maxCompare is 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'maxCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.maxEq()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.maxEq()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.maxEq()).toBe(false)

		spy.mockRestore()
	})

	test('maxLt returns true when maxCompare is greater than 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'maxCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.maxLt()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.maxLt()).toBe(false)

		spy.mockReturnValue(1)
		expect(r.maxLt()).toBe(true)

		spy.mockRestore()
	})

	test('maxLte returns true when maxCompare is >= 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'maxCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.maxLte()).toBe(false)

		spy.mockReturnValue(0)
		expect(r.maxLte()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.maxLte()).toBe(true)

		spy.mockRestore()
	})

	test('maxGt returns true when maxCompare is less than 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'maxCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.maxGt()).toBe(true)

		spy.mockReturnValue(0)
		expect(r.maxGt()).toBe(false)

		spy.mockReturnValue(1)
		expect(r.maxGt()).toBe(false)

		spy.mockRestore()
	})

	test('maxGte returns true when maxCompare is <= 0', () => {
		const spy = jest.spyOn(ValueRange.prototype, 'maxCompare')

		const r = new ValueRange()

		spy.mockReturnValue(-1)
		expect(r.maxGte()).toBe(true)

		spy.mockReturnValue(0)
		expect(r.maxGte()).toBe(true)

		spy.mockReturnValue(1)
		expect(r.maxGte()).toBe(false)

		spy.mockRestore()
	})

	test.each`
		range       | isSingular
		${'[-1,1]'} | ${false}
		${'(-1,1]'} | ${false}
		${'(*,1]'}  | ${false}
		${'[-1,*)'} | ${false}
		${'*'}      | ${false}
		${'1'}      | ${true}
		${''}       | ${false}
	`(`$range isSingular={$isSingular}`, ({ range, isSingular }) => {
		expect(new ValueRange(range).isSingular).toBe(isSingular)
	})

	test.each`
		range       | isFinite
		${'[-1,1]'} | ${true}
		${'(-1,1]'} | ${true}
		${'(*,1]'}  | ${false}
		${'[-1,*)'} | ${false}
		${'*'}      | ${false}
		${'1'}      | ${true}
		${''}       | ${true}
	`(`$range isFinite={$isFinite}`, ({ range, isFinite }) => {
		expect(new ValueRange(range).isFinite).toBe(isFinite)
	})

	test.each`
		range       | isUniversal
		${'[-1,1]'} | ${false}
		${'(-1,1]'} | ${false}
		${'(*,1]'}  | ${false}
		${'[-1,*)'} | ${false}
		${'*'}      | ${true}
		${'1'}      | ${false}
		${''}       | ${false}
	`(`$range isUniversal={$isUniversal}`, ({ range, isUniversal }) => {
		expect(new ValueRange(range).isUniversal).toBe(isUniversal)
	})

	test('parseRangeString returns null if given invalid string', () => {
		expect(ValueRange.parseRangeString()).toBe(null)
		expect(ValueRange.parseRangeString(null)).toBe(null)
	})

	test.each`
		range
		${'[*,0]'}
		${'[0,*]'}
		${'[*,*]'}
	`(`$range parseRangeString throws error`, ({ range }) => {
		expect(() => {
			ValueRange.parseRangeString(range)
		}).toThrow('Bad range string: * must be exclusive')
	})

	test.each`
		range
		${'*,0]'}
		${'*,0)'}
		${'2,3]'}
		${'2,3)'}
		${',3]'}
		${',3)'}
	`(`$range parseRangeString throws error`, ({ range }) => {
		expect(() => {
			ValueRange.parseRangeString(range)
		}).toThrow('Bad range string: Missing [ or (')
	})

	test.each`
		range
		${'[0,*'}
		${'(0,*'}
		${'[2,3'}
		${'(2,3'}
		${'[2,'}
		${'(2,'}
	`(`$range parseRangeString throws error`, ({ range }) => {
		expect(() => {
			ValueRange.parseRangeString(range)
		}).toThrow('Bad range string: Missing ] or )')
	})

	test.each`
		range
		${'(*,]'}
		${'[,*)'}
		${'[9.8,]'}
		${'[,9.8]'}
		${'(9.8,]'}
		${'(,9.8]'}
		${'(,]'}
		${'[,)'}
		${'(,)'}
		${'[,]'}
	`(`$range parseRangeString throws error`, ({ range }) => {
		expect(() => {
			ValueRange.parseRangeString(range)
		}).toThrow('Bad range string: Missing values')
	})
})
