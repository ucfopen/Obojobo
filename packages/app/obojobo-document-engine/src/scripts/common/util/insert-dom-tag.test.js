import insertDomTag from '../../../src/scripts/common/util/insert-dom-tag'

describe('InsertDomTag', () => {
	test('shuffle returns original array reference', () => {
		const parentInsertBefore = jest.fn()
		jest.spyOn(document, 'getElementsByTagName')
		jest.spyOn(document, 'createElement')
		const theTag = {}
		const firstTag = {
			parentNode: {
				insertBefore: parentInsertBefore
			}
		}
		document.createElement.mockReturnValue(theTag)
		document.getElementsByTagName.mockReturnValue([firstTag])
		const attributes = { src: 'mock-src', other: 'yep' }
		const tagType = 'whatever'
		insertDomTag(attributes, tagType)

		// make sure the attributes are copied onto the tag
		expect(theTag).toHaveProperty('src', 'mock-src')
		expect(theTag).toHaveProperty('other', 'yep')

		// make sure createElement used tagType
		expect(document.createElement).toHaveBeenCalledWith('whatever')

		// make sure the first tag's insertBefore was called
		expect(parentInsertBefore).toHaveBeenCalledWith(theTag, {
			parentNode: { insertBefore: parentInsertBefore }
		})
	})
})
