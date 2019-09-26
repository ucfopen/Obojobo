import Content from './editor-registration'

describe('Sections/Content editor', () => {
	test('registers model with expected values', () => {
		expect(Content).toMatchInlineSnapshot(`
		Object {
		  "getNavItem": [Function],
		  "helpers": Object {
		    "oboToSlate": [Function],
		    "slateToObo": [Function],
		  },
		  "ignore": true,
		  "isInsertable": false,
		  "name": "ObojoboDraft.Sections.Content",
		  "plugins": null,
		}
	`)
	})

	test('helpers return nothing', () => {
		expect(Content.helpers.slateToObo()).toBeUndefined()
		expect(Content.helpers.oboToSlate()).toBeUndefined()
	})

	test('getNavItem returns expected object', () => {
		expect(Content.getNavItem()).toEqual({
			showChildren: true,
			type: 'hidden'
		})
	})
})
