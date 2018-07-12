import ListStyles from '../../../../ObojoboDraft/Chunks/List/list-styles'

describe('List Styles', () => {
	test('List Styles creates an instance with expected values', () => {
		let ls = new ListStyles('type')

		expect(ls.type).toBe('type')
		expect(ls.styles).toEqual({})
	})

	test('init builds expected style', () => {
		let ls = new ListStyles('type')
		ls.init()

		expect(ls.type).toBe('unordered')
		expect(ls.styles).toEqual({})
	})

	test('set places a style into the order', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'type',
			start: 10,
			bulletStyle: 'style'
		})

		expect(ls.toDescriptor()).toEqual({
			type: 'unordered',
			indents: {
				'5': {
					type: 'type',
					start: 10,
					bulletStyle: 'style'
				}
			}
		})
	})

	test('get retrives default values', () => {
		let ls = new ListStyles()
		ls.init()

		expect(ls.get(0).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'disc'
		})
	})

	test('get retrieves set values', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'ordered',
			start: 10,
			bulletStyle: 'upper-roman'
		})

		ls.set(6, {
			type: 'ordered'
		})

		expect(ls.get(5).toDescriptor()).toEqual({
			type: 'ordered',
			start: 10,
			bulletStyle: 'upper-roman'
		})

		expect(ls.get(6).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'upper-alpha'
		})
	})

	test('getSetStyles retrives no defaults', () => {
		let ls = new ListStyles()
		ls.init()

		expect(ls.getSetStyles(0).toDescriptor()).toEqual({
			type: null,
			start: null,
			bulletStyle: null
		})
	})

	test('getSetStyles retrives set values', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'ordered',
			start: 10,
			bulletStyle: 'upper-roman'
		})

		ls.set(6, {
			type: 'ordered'
		})

		expect(ls.getSetStyles(5).toDescriptor()).toEqual({
			type: 'ordered',
			start: 10,
			bulletStyle: 'upper-roman'
		})

		expect(ls.getSetStyles(6).toDescriptor()).toEqual({
			type: 'ordered',
			start: null,
			bulletStyle: null
		})
	})

	test('toDescriptor returns unordered styles', () => {
		let ls = new ListStyles('unordered')

		expect(ls.get(0).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'disc'
		})

		expect(ls.get(1).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'circle'
		})

		expect(ls.get(2).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'square'
		})

		expect(ls.get(3).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'disc'
		})

		expect(ls.get(4).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'circle'
		})

		expect(ls.get(5).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'square'
		})

		expect(ls.get(6).toDescriptor()).toEqual({
			type: 'unordered',
			start: 1,
			bulletStyle: 'disc'
		})
	})

	test('toDescriptor returns ordered styles', () => {
		let ls = new ListStyles('ordered')

		expect(ls.get(0).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'decimal'
		})

		expect(ls.get(1).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'upper-alpha'
		})

		expect(ls.get(2).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'upper-roman'
		})

		expect(ls.get(3).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'lower-alpha'
		})

		expect(ls.get(4).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'lower-roman'
		})

		expect(ls.get(5).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'decimal'
		})

		expect(ls.get(6).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'upper-alpha'
		})

		expect(ls.get(7).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'upper-roman'
		})

		expect(ls.get(8).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'lower-alpha'
		})

		expect(ls.get(9).toDescriptor()).toEqual({
			type: 'ordered',
			start: 1,
			bulletStyle: 'lower-roman'
		})
	})

	test('clone creates a shallow copy', () => {
		let orig = new ListStyles()
		orig.init()

		orig.set(5, {
			type: 'type',
			start: 10,
			bulletStyle: 'style'
		})

		let clone = orig.clone()

		expect(orig).not.toBe(clone)
		expect(orig.toDescriptor()).toEqual(clone.toDescriptor())
	})

	test('clone creates a deep copy', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'type',
			start: 10,
			bulletStyle: 'style'
		})

		let orig = ls.get(5)
		let clone = orig.clone()

		expect(orig).not.toBe(clone)
		expect(orig.toDescriptor()).toEqual(clone.toDescriptor())
	})

	test('map will map over all set indent styles', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'type',
			start: 10,
			bulletStyle: 'style'
		})

		let result = ls.map((style, indent) => {
			style.start *= 2
			return style.toDescriptor()
		})

		expect(result).toEqual([
			{
				type: 'type',
				start: 20,
				bulletStyle: 'style'
			}
		])
	})

	test('fromDescriptor will create an object from a descriptor', () => {
		let ls = new ListStyles()
		ls.init()

		ls.set(5, {
			type: 'type',
			start: 10,
			bulletStyle: 'style'
		})

		let descr = ls.toDescriptor()
		let other = ListStyles.fromDescriptor(descr)

		expect(other).toBeInstanceOf(ListStyles)
		expect(ls).not.toBe(other)
		expect(ls.toDescriptor()).toEqual(other.toDescriptor())
	})
})
