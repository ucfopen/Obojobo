import NumericEntryRange from '../../range/numeric-entry-range'
import NumericEntry from '../../entry/numeric-entry'
import BigValueRange from '../../range/big-value-range'

describe('NumericEntryRange', () => {
	test('Constructor with no arguments creates an infinite range', () => {
		expect(new NumericEntryRange().toJSON()).toEqual({
			isClosed: false,
			min: null,
			isMinInclusive: null,
			max: null,
			isMaxInclusive: null,
			unit: ''
		})
	})

	test.each`
		input                        | isClosed | min        | isMinInclusive | max         | isMaxInclusive | unit
		${''}                        | ${true}  | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${null}                      | ${true}  | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${false}                     | ${true}  | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${0}                         | ${true}  | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${''}                        | ${true}  | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${1}                         | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${true}                      | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${{}}                        | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${'*'}                       | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${'[-1,1]'}                  | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}        | ${''}
		${'[-1,1]g'}                 | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}        | ${'g'}
		${'[-1g,1g]'}                | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}        | ${'g'}
		${'[-1,1g]'}                 | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}        | ${'g'}
		${'[-1g,1]'}                 | ${false} | ${'-1'}    | ${true}        | ${'1'}      | ${true}        | ${'g'}
		${'(1/4,1/2]'}               | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}        | ${''}
		${'(1/4 grams,1/2 grams]'}   | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}        | ${'grams'}
		${'(1/4 grams,1/2]'}         | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}        | ${'grams'}
		${'(1/4,1/2 grams]'}         | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}        | ${'grams'}
		${'(1/4,1/2]grams'}          | ${false} | ${'1/4'}   | ${false}       | ${'1/2'}    | ${true}        | ${'grams'}
		${'[1.2e3,4.5e6)'}           | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}       | ${''}
		${'[1.2e3 rats,4.5e6 rats)'} | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}       | ${'rats'}
		${'[1.2e3 rats,4.5e6)'}      | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}       | ${'rats'}
		${'[1.2e3,4.5e6 rats)'}      | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}       | ${'rats'}
		${'[1.2e3,4.5e6)rats'}       | ${false} | ${'1.2e3'} | ${true}        | ${'4.5e6'}  | ${false}       | ${'rats'}
		${'[0xFA,*)'}                | ${false} | ${'0xFA'}  | ${true}        | ${null}     | ${null}        | ${''}
		${'[0xFA,*)bytes'}           | ${false} | ${'0xFA'}  | ${true}        | ${null}     | ${null}        | ${'bytes'}
		${'[0xFA bytes,*)'}          | ${false} | ${'0xFA'}  | ${true}        | ${null}     | ${null}        | ${'bytes'}
		${'(*,0b1101]'}              | ${false} | ${null}    | ${null}        | ${'0b1101'} | ${true}        | ${''}
		${'(*,0b1101]bits'}          | ${false} | ${null}    | ${null}        | ${'0b1101'} | ${true}        | ${'bits'}
		${'(*,0b1101 bits]'}         | ${false} | ${null}    | ${null}        | ${'0b1101'} | ${true}        | ${'bits'}
		${'0o644'}                   | ${false} | ${'0o644'} | ${true}        | ${'0o644'}  | ${true}        | ${''}
		${'0o644 permissions'}       | ${false} | ${'0o644'} | ${true}        | ${'0o644'}  | ${true}        | ${'permissions'}
		${'(*,*)'}                   | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${''}
		${'(*,*)g'}                  | ${false} | ${null}    | ${null}        | ${null}     | ${null}        | ${'g'}
	`(
		`Constructor($input)={isClosed:$isClosed,min:$min,isMinInclusive:$isMinInclusive,max:$max,isMaxInclusive:$isMaxInclusive}`,
		({ input, isClosed, min, isMinInclusive, max, isMaxInclusive, unit }) => {
			expect(new NumericEntryRange(input).toJSON()).toEqual({
				isClosed,
				min,
				isMinInclusive,
				max,
				isMaxInclusive,
				unit
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
				isMaxInclusive: false,
				unit: 'kg'
			})
		).toEqual(new NumericEntryRange('(*,7/11)kg'))

		expect(
			new NumericEntryRange({
				min: '3.4x10^-9 G',
				isMinInclusive: true,
				max: '4.9x10^-9 G',
				isMaxInclusive: false,
				unit: ''
			})
		).toEqual(new NumericEntryRange('[3.4x10^-9 G,4.9x10^-9 G)'))

		expect(
			new NumericEntryRange({
				isClosed: true
			})
		).toEqual(new NumericEntryRange(''))
	})

	test('Constructor strips units from individual NumericInstances', () => {
		const n = new NumericEntry('4.2%')
		const r = new NumericEntryRange('[4.2%,4.3%]')

		expect(n.numericInstance.unit).toBe('%')
		expect(r.min.numericInstance.unit).toBe('')
		expect(r.max.numericInstance.unit).toBe('')
		expect(r.unit).toBe('%')
	})

	test('toJSON returns a JSON representation of the range', () => {
		const r = new NumericEntryRange()

		r.min = null
		r.max = null
		r.isMinInclusive = 'a'
		r.isMaxInclusive = 'b'
		r.unit = 'c'
		r.isClosed = 'd'

		expect(r.toJSON()).toEqual({
			min: null,
			max: null,
			isMinInclusive: 'a',
			isMaxInclusive: 'b',
			unit: 'c',
			isClosed: 'd'
		})

		r.min = { numericInstance: { getString: () => 'x' } }
		r.max = { numericInstance: { getString: () => 'y' } }

		expect(r.toJSON()).toEqual({
			min: 'x',
			max: 'y',
			isMinInclusive: 'a',
			isMaxInclusive: 'b',
			unit: 'c',
			isClosed: 'd'
		})
	})

	test.each`
		input          | rangeString    | unit
		${'*'}         | ${'*'}         | ${''}
		${'9g'}        | ${'9g'}        | ${''}
		${'[2g,3.2g]'} | ${'[2g,3.2g]'} | ${''}
		${'[2g,3.2]'}  | ${'[2g,3.2]'}  | ${''}
		${'[2,3.2g]'}  | ${'[2,3.2g]'}  | ${''}
		${'[2,3.2]g'}  | ${'[2,3.2]'}   | ${'g'}
		${'(2g,3.2g)'} | ${'(2g,3.2g)'} | ${''}
		${'(2g,3.2)'}  | ${'(2g,3.2)'}  | ${''}
		${'(2,3.2g)'}  | ${'(2,3.2g)'}  | ${''}
		${'(2,3.2)g'}  | ${'(2,3.2)'}   | ${'g'}
		${'(*,*)g'}    | ${'(*,*)'}     | ${'g'}
	`(
		`getRangeAndUnitFromString($input)={rangeString:$rangeString,unit:$unit}`,
		({ input, rangeString, unit }) => {
			expect(NumericEntryRange.getRangeAndUnitFromString(input)).toEqual({
				rangeString,
				unit
			})
		}
	)

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

	test.each`
		combined | min    | max    | unit
		${''}    | ${''}  | ${''}  | ${''}
		${'a'}   | ${''}  | ${''}  | ${'a'}
		${''}    | ${'b'} | ${'b'} | ${'b'}
		${''}    | ${'b'} | ${''}  | ${'b'}
		${''}    | ${''}  | ${'b'} | ${'b'}
	`(`getUnit($combined,$min,$max)=$unit`, ({ combined, min, max, unit }) => {
		expect(NumericEntryRange.getUnit(combined, min, max)).toEqual(unit)
	})

	test.each`
		combined | min    | max    | error
		${'a'}   | ${'a'} | ${'a'} | ${'Unable to define both types of units'}
		${'a'}   | ${'a'} | ${''}  | ${'Unable to define both types of units'}
		${'a'}   | ${''}  | ${'a'} | ${'Unable to define both types of units'}
		${''}    | ${'a'} | ${'b'} | ${'Unable to have different units'}
	`(`getUnit($combined,$min,$max) throws $error`, ({ combined, min, max, error }) => {
		expect(() => {
			NumericEntryRange.getUnit(combined, min, max)
		}).toThrow(error)
	})

	test('toBigValueRange returns a BigValueRange from a NumericEntryRange', () => {
		expect(new NumericEntryRange('[-2g,9.8g]').toBigValueRange()).toEqual(
			new BigValueRange('[-2,9.8]')
		)
		expect(new NumericEntryRange('(*,5)').toBigValueRange()).toEqual(new BigValueRange('(*,5)'))
		expect(new NumericEntryRange('*').toBigValueRange()).toEqual(new BigValueRange('*'))
		expect(new NumericEntryRange('1/2').toBigValueRange()).toEqual(new BigValueRange('0.5'))
		expect(new NumericEntryRange('6.8e-2').toBigValueRange()).toEqual(new BigValueRange('0.068'))
		expect(new NumericEntryRange('[0xFF,*)bytes').toBigValueRange()).toEqual(
			new BigValueRange('[255,*)')
		)
		expect(new NumericEntryRange({ isClosed: true }).toBigValueRange()).toEqual(
			new BigValueRange({ isClosed: true })
		)
		expect(new NumericEntryRange('').toBigValueRange()).toEqual(new BigValueRange(''))
	})
})
