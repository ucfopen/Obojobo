export function getScoreChangeDescription(oldHighestScore, newHighestScore) {
	if (newHighestScore === null && oldHighestScore === null) {
		return 'This did not change your recorded score'
	}

	if (oldHighestScore === null) {
		return `✔ Your recorded score was updated to ${newHighestScore}%`
	}

	if (newHighestScore > oldHighestScore) {
		return `✔ Your recorded score was updated from ${oldHighestScore}% to ${newHighestScore}%`
	}

	// Else newHighestScore === null || newHighestScore <= oldHighestScore
	return `This did not change your recorded score of ${oldHighestScore}%`
}
