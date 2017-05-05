module.exports = jest.fn().mockImplementation((env) => {
	return {
		express: [],
		assets: [],
		draftNodes: new Map()
	}
})
