const { equals, convertHyphenBasedStringToCamelCase } = require('./misc-stats-util')

describe('miscStatsUtil', () => {
	test('equals returns expected values', () => {
		let arr1 = [
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			},
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		let arr2 = [
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				userFirstName: 'Test',
				userLastName: 'Instructor1',
				resourceLinkId: 'preview'
			},
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		expect(equals(arr1, arr2)).toBe(false)

		arr1 = [
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		arr2 = [
			{
				assessmentId: 'my-assessment-two',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		expect(equals(arr1, arr2)).toBe(false)

		arr1 = [
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		arr2 = [
			{
				assessmentId: 'my-assessment',
				courseTitle: null,
				draftContentId: '32e82b43-b6d0-4221-ae86-f2d95dd5561e',
				draftId: 'bc94db0f-845b-4f77-9286-fe13d41f72d1',
				isPreview: true,
				moduleTitle: 'My Obojobo Module Title',
				resourceLinkId: 'preview',
				userFirstName: 'Test',
				userLastName: 'Instructor1'
			}
		]

		expect(equals(arr1, arr2)).toBe(true)
	})

	test('convertHyphenBasedStringToCamelCase converts strings as expected', () => {
		let str = convertHyphenBasedStringToCamelCase('mock-student-name')
		expect(str).toBe('mockStudentName')

		str = convertHyphenBasedStringToCamelCase('o-b-o')
		expect(str).toBe('oBO')

		str = convertHyphenBasedStringToCamelCase('123')
		expect(str).toBe('123')

		str = convertHyphenBasedStringToCamelCase('1-2-3')
		expect(str).toBe('123')
	})
})
