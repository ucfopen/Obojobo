// Simple utility function to remove undefined values from an object.
// Returns a new object and does not recursively dig into the object!

export default o => {
	const filteredObject = {}

	Object.keys(o).forEach(key => {
		if (typeof o[key] !== 'undefined') {
			filteredObject[key] = o[key]
		}
	})

	return filteredObject
}
