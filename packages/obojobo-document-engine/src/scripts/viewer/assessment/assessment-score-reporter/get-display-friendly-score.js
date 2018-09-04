let getDisplayFriendlyScore = n => {
	if (n === null) return '--'
	return Math.round(n).toString()
}

export default getDisplayFriendlyScore
