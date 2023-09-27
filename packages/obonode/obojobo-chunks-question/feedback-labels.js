const DEFAULT_CORRECT_PRACTICE_LABELS = ['Correct!', 'You got it!', 'Great job!', "That's right!"]
const DEFAULT_CORRECT_REVIEW_LABELS = ['Correct']
const DEFAULT_PARTIAL_LABELS = ['Partial Credit']
const DEFAULT_PARTIAL_REVIEW_LABELS = ['Partial Credit']
const DEFAULT_INCORRECT_LABELS = ['Incorrect']
const DEFAULT_INCORRECT_REVIEW_LABELS = ['Incorrect']
const DEFAULT_SURVEY_LABELS = ['Response recorded']
const DEFAULT_SURVEY_REVIEW_LABELS = ['Response recorded']
const DEFAULT_SURVEY_UNANSWERED_LABELS = ['No response given']

const getRandomItem = arrayOfOptions => {
	return arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)]
}

const getCorrectLabels = (correctLabels, isReview, isSurvey, hasResponse) => {
	if (isReview && isSurvey && hasResponse) {
		return DEFAULT_SURVEY_REVIEW_LABELS
	}

	if (isReview && isSurvey && !hasResponse) {
		return DEFAULT_SURVEY_UNANSWERED_LABELS
	}

	if (isReview && !isSurvey) {
		return DEFAULT_CORRECT_REVIEW_LABELS
	}

	if (correctLabels) {
		return correctLabels
	}

	if (isSurvey) {
		return DEFAULT_SURVEY_LABELS
	}

	return DEFAULT_CORRECT_PRACTICE_LABELS
}

const getIncorrectLabels = (incorrectLabels, isReview) => {
	if (isReview) {
		return DEFAULT_INCORRECT_REVIEW_LABELS
	}

	if (incorrectLabels) {
		return incorrectLabels
	}

	return DEFAULT_INCORRECT_LABELS
}

const getPartialLabels = (partialLabels, isReview) => {
	if (isReview) {
		return DEFAULT_PARTIAL_REVIEW_LABELS
	}

	if (partialLabels) {
		return partialLabels
	}

	return DEFAULT_PARTIAL_LABELS
}

const getLabel = (
	correctLabels,
	partialLabels,
	incorrectLabels,
	score,
	isReview,
	isSurvey,
	hasResponse
) => {
	let labelOptions
	switch (true) {
		case score >= 100:
		case score === 'no-score':
			labelOptions = getCorrectLabels(correctLabels, isReview, isSurvey, hasResponse)
			break
		case score > 0 && score < 100:
			labelOptions = getPartialLabels(partialLabels, isReview)
			break
		case score === 0:
		default:
			labelOptions = getIncorrectLabels(incorrectLabels, isReview)
			break
	}
	return getRandomItem(labelOptions)
}

export { getLabel, getCorrectLabels, getIncorrectLabels }
