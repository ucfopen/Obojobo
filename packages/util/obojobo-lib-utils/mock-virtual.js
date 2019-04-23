// mockVirtual is used when you don't want jest to
// acknowledge any existing mock in the system
// and force whatever you're mocking to just return jest.fn()
// it can also be used to mock a file that doesn't exist
global.mockVirtual = mock => {
	const mockFunction = jest.fn()
	jest.mock(
		mock,
		() => {
			return mockFunction
		},
		{ virtual: true }
	)
	return mockFunction
}
