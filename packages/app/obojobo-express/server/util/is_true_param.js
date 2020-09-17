// check if a param is true, 'true', 'TRUE', 'True, 1, or '1'
exports.isTrueParam = param =>
	Boolean(
		// param isn't falsy / undefined / null
		param &&
			// cheaper comparisons first
			(param === 1 ||
				param === '1' ||
				param === true ||
				// check for 'true', 'TRUE', etc
				('' + param).toLowerCase() === 'true')
	)
