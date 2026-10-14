import withoutUndefined from './without-undefined'

describe('withoutUndefined', () => {
	test('withoutUndefined strips out all undefined values and returns a new object (but does not modify nested properties)', () => {
		const o = {
			a: 1,
			b: undefined, //eslint-disable-line no-undefined
			c: null,
			d: false,
			e: 0,
			f: true,
			g: '',
			h: 'true',
			i: 'false',
			j: 'undefined',
			k: undefined, //eslint-disable-line no-undefined
			l: [],
			m: {
				x: undefined, //eslint-disable-line no-undefined,
				y: true,
				z: false
			}
		}

		const oWithoutUndefinedValues = withoutUndefined(o)

		expect(oWithoutUndefinedValues).not.toBe(o)
		expect(oWithoutUndefinedValues).toEqual({
			a: 1,
			c: null,
			d: false,
			e: 0,
			f: true,
			g: '',
			h: 'true',
			i: 'false',
			j: 'undefined',
			l: [],
			m: {
				x: undefined, //eslint-disable-line no-undefined,
				y: true,
				z: false
			}
		})
	})
})
