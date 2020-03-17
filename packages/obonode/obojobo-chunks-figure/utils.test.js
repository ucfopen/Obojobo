import { isUUID } from './utils'

describe('Image utils', () => {
	test('isUUID behaves as expected', () => {
		expect(isUUID('C56A4180-65AA-42EC-A945-5FD21DEC0538')).toBe(true)
		expect(isUUID('notUUID')).toBe(false)
	})
})
