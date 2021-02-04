const validateId = id => {
	const validation = /[^a-z|A-Z|0-9|\-|_|:|.]/
	return validation.test(id)
}

export default validateId
