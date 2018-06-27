import TextGroupUtil from '../../../src/scripts/common/text-group/text-group-util'

describe('TextGroupUtil', () => {
	test('createData directly copies data', () => {
		let item = {
			type: 'mockType',
			children: []
		}

		let clone = TextGroupUtil.createData(item, item)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('createData matches empty template', () => {
		let item = {
			type: 'mockType',
			children: []
		}

		let clone = TextGroupUtil.createData(item, {})

		expect(clone).not.toBe(item)
		expect(clone).toEqual({})
	})

	test('createData matches template', () => {
		let item = {
			type: 'mockType',
			children: []
		}
		let template = {
			other: 'mockOther',
			someObject: {
				type: 'internalObject'
			}
		}

		let clone = TextGroupUtil.createData(item, template)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(template)
	})

	test('defaultCloneFn directly clones object', () => {
		let item = {
			type: 'mockType',
			children: []
		}

		let clone = TextGroupUtil.defaultCloneFn(item)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('defaultMergeFn simply returns object', () => {
		let item = {
			type: 'mockType',
			children: []
		}
		let notItem = {
			type: 'mockOtherType',
			children: []
		}

		let clone = TextGroupUtil.defaultMergeFn(item)

		expect(clone).toBe(item)
	})
})
