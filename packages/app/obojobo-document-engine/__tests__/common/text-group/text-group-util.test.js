import TextGroupUtil from '../../../src/scripts/common/text-group/text-group-util'

describe('TextGroupUtil', () => {
	test('createData directly copies data', () => {
		const item = {
			type: 'mockType',
			children: []
		}

		const clone = TextGroupUtil.createData(item, item)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('createData matches empty template', () => {
		const item = {
			type: 'mockType',
			children: []
		}

		const clone = TextGroupUtil.createData(item, {})

		expect(clone).not.toBe(item)
		expect(clone).toEqual({})
	})

	test('createData matches template', () => {
		const item = {
			type: 'mockType',
			children: []
		}
		const template = {
			other: 'mockOther',
			someObject: {
				type: 'internalObject'
			}
		}

		const clone = TextGroupUtil.createData(item, template)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(template)
	})

	test('defaultCloneFn directly clones object', () => {
		const item = {
			type: 'mockType',
			children: []
		}

		const clone = TextGroupUtil.defaultCloneFn(item)

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('defaultMergeFn simply returns object', () => {
		const item = {
			type: 'mockType',
			children: []
		}

		const clone = TextGroupUtil.defaultMergeFn(item)

		expect(clone).toBe(item)
	})
})
