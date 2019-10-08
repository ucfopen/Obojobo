import { isUrlUUID } from './utils'

describe('Image utils', () => {

	test('isUrlUUID behaves as expected', () => {
		expect(isUrlUUID('C56A4180-65AA-42EC-A945-5FD21DEC0538')).toBe(true)
		expect(isUrlUUID('notUUID')).toBe(false)
	})
})
