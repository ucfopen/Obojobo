import cloneProps from './clone-props'

describe('clone-props', () => {
	test('correctly clones props', () => {
		const target = {}
		const source = {
			thing: 'someThing',
			otherThing: 'someOtherThing'
		}
		const props = ['thing']

		cloneProps(target, source, props)

		expect(target).toMatchObject({ thing: 'someThing' })
	})
})
