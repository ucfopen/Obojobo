import NumericEntryRange from '../../range/numeric-entry-range'
import NumericEntry from '../../entry/numeric-entry'
import BigValueRange from '../../range/big-value-range'

describe('NumericEntryRange', () => {
	test('Constructor with no arguments creates an infinite range', () => {
		expect(new NumericEntryRange().toJSON()).toEqual({
			isEmpty: false,
			min: null,
			isMinInclusive: null,
			max: null,
			isMaxInclusive: null
		})
	})

	test.each`
		input              | isEmpty  | min        | isMinInclusive | max         | isMaxInclusive
		${''}              | ${true}  | ${null}    | ${null}        | ${null}     | ${null}
		${null}            | ${true}  | ${null}    | ${null}        | ${null}     | ${null}
		${false}           | ${true}  | ${null}    | ${null}        | ${null}     | ${null}
		${0}               | ${true}  | ${null}    | ${null}        | ${null}     | ${null}
		${''}              | ${true}  | ${null}    | ${null}        | ${null}     | ${null}
		${1}               | ${false} | ${null}    | ${null}        | ${null}     | ${null}
		${true}            | ${false} | ${null}    | ${null}        | ${null}     | ${null}
		${{}}              | ${false} | ${null}    | ${null}        | ${null}     | ${null}
		${'*'}             | ${false} | ${null}    | ${null}        | ${null}     | ${null}
		${'[-1,1]'}        | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}
		${'(1/4,1/2]'}     | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}
		${'[1.2e3,4.5e6)'} | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}
		${'[0xFA,*)'}      | ${false} | ${'0xFA'}  | ${true}        | ${null}     | ${null}
		${'(*,0b1101]'}    | ${false} | ${null}    | ${null}        | ${'0b1101'} | ${true}
		${'0o644'}         | ${false} | ${'0o644'} | ${true}        | ${'0o644'}  | ${true}
		${'(*,*)'}         | ${false} | ${null}    | ${null}        | ${null}     | ${null}
	`(
		`Constructor($input)={isEmpty:$isEmpty,min:$min,isMinInclusive:$isMinInclusive,max:$max,isMaxInclusive:$isMaxInclusive}`,
		({ input, isEmpty, min, isMinInclusive, max, isMaxInclusive }) => {
			expect(new NumericEntryRange(input).toJSON()).toEqual({
				isEmpty,
				min,
				isMinInclusive,
				max,
				isMaxInclusive
			})
		}
	)

	test('Constructor accepts object', () => {
		expect(new NumericEntryRange({})).toEqual(new NumericEntryRange('*'))

		expect(
			new NumericEntryRange({
				min: '-1',
				isMinInclusive: true
			})
		).toEqual(new NumericEntryRange('[-1,*)'))

		expect(
			new NumericEntryRange({
				max: '7/11',
				isMaxInclusive: false
			})
		).toEqual(new NumericEntryRange('(*,7/11)'))

		expect(
			new NumericEntryRange({
				min: '3.4x10^-9',
				isMinInclusive: true,
				max: '4.9x10^-9',
				isMaxInclusive: false,
				unit: ''
			})
		).toEqual(new NumericEntryRange('[3.4x10^-9,4.9x10^-9)'))

		expect(
			new NumericEntryRange({
				isEmpty: true
			})
		).toEqual(new NumericEntryRange(''))
	})

	test('toJSON returns a JSON representation of the range', () => {
		const r = new NumericEntryRange()

		r.min = null
		r.max = null
		r.isMinInclusive = 'a'
		r.isMaxInclusive = 'b'
		r.isEmpty = 'd'

		expect(r.toJSON()).toEqual({
			min: null,
			max: null,
			isMinInclusive: 'a',
			isMaxInclusive: 'b',
			isEmpty: 'd'
		})

		r.min = { numericInstance: { toString: () => 'x' } }
		r.max = { numericInstance: { toString: () => 'y' } }

		expect(r.toJSON()).toEqual({
			min: 'x',
			max: 'y',
			isMinInclusive: 'a',
			isMaxInclusive: 'b',
			isEmpty: 'd'
		})
	})

	test('compareValues compares two numericInstance values', () => {
		const a = new NumericEntry('-1')
		const b = new NumericEntry('1')

		a.numericInstance.isEqual = () => true
		b.numericInstance.isEqual = () => true

		expect(NumericEntryRange.compareValues(a, b)).toBe(0)

		a.numericInstance.isEqual = () => false
		b.numericInstance.isEqual = () => true

		expect(NumericEntryRange.compareValues(a, b)).toBe(0)

		a.numericInstance.isEqual = () => true
		b.numericInstance.isEqual = () => false

		expect(NumericEntryRange.compareValues(a, b)).toBe(0)

		a.numericInstance.isEqual = () => false
		b.numericInstance.isEqual = () => false

		expect(NumericEntryRange.compareValues(a, b)).toBe(-1)

		a.numericInstance.isEqual = () => true
		b.numericInstance.isEqual = () => true

		expect(NumericEntryRange.compareValues(b, a)).toBe(0)

		a.numericInstance.isEqual = () => false
		b.numericInstance.isEqual = () => true

		expect(NumericEntryRange.compareValues(b, a)).toBe(0)

		a.numericInstance.isEqual = () => true
		b.numericInstance.isEqual = () => false

		expect(NumericEntryRange.compareValues(b, a)).toBe(0)

		a.numericInstance.isEqual = () => false
		b.numericInstance.isEqual = () => false

		expect(NumericEntryRange.compareValues(b, a)).toBe(1)
	})

	test('parseValue returns null or a new NumericEntry', () => {
		expect(NumericEntryRange.parseValue(null, null)).toBe(null)
		expect(NumericEntryRange.parseValue(['decimal'], '12345.67890')).toEqual(
			new NumericEntry('12345.67890', ['decimal'])
		)
	})

	test('toBigValueRange returns a BigValueRange from a NumericEntryRange', () => {
		expect(new NumericEntryRange('[-2,9.8]').toBigValueRange()).toEqual(
			new BigValueRange('[-2,9.8]')
		)
		expect(new NumericEntryRange('(*,5)').toBigValueRange()).toEqual(new BigValueRange('(*,5)'))
		expect(new NumericEntryRange('*').toBigValueRange()).toEqual(new BigValueRange('*'))
		expect(new NumericEntryRange('1/2').toBigValueRange()).toEqual(new BigValueRange('0.5'))
		expect(new NumericEntryRange('6.8e-2').toBigValueRange()).toEqual(new BigValueRange('0.068'))
		expect(new NumericEntryRange('[0xFF,*)').toBigValueRange()).toEqual(
			new BigValueRange('[255,*)')
		)
		expect(new NumericEntryRange({ isEmpty: true }).toBigValueRange()).toEqual(
			new BigValueRange({ isEmpty: true })
		)
		expect(new NumericEntryRange('').toBigValueRange()).toEqual(new BigValueRange(''))
	})

	test('toStringValue returns the string value', () => {
		expect(NumericEntryRange.toStringValue(new NumericEntry('3.14'))).toBe('3.14')
		expect(NumericEntryRange.toStringValue(new NumericEntry('55/66'))).toBe('55/66')
		expect(NumericEntryRange.toStringValue(null)).toBe('*')
	})
})
