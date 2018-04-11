export function getScoreChangeDescription(oldHighestScore, newHighestScore) {
	if (newHighestScore === null && oldHighestScore === null) {
		return 'This did not change your recorded score'
	}

	if (oldHighestScore === null) {
		return `✔ Your recorded score was updated to ${Math.round(newHighestScore)}%`
	}

	if (newHighestScore > oldHighestScore) {
		return `✔ Your recorded score was updated from ${Math.round(oldHighestScore)}% to ${Math.round(
			newHighestScore
		)}%`
	}

	// Else newHighestScore === null || newHighestScore <= oldHighestScore
	return `This did not change your recorded score of ${Math.round(oldHighestScore)}%`
}
