const DEFAULT_CORRECT_PRACTICE_LABELS = ['Correct!', 'You got it!', 'Great job!', "That's right!"]
const DEFAULT_CORRECT_REVIEW_LABELS = ['Correct']
const DEFAULT_INCORRECT_LABELS = ['Incorrect']
const DEFAULT_INCORRECT_REVIEW_LABELS = ['Incorrect']
const DEFAULT_SURVEY_LABELS = ['Response recorded']
const DEFAULT_SURVEY_REVIEW_LABELS = ['Response recorded']
const DEFAULT_SURVEY_UNANSWERED_LABELS = ['No response given']

const getRandomItem = arrayOfOptions => {
	return arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)]
}

const getCorrectLabels = (correctLabels, isReview, isSurvey, isAnswered) => {
	if (isReview && isSurvey && isAnswered) {
		return DEFAULT_SURVEY_REVIEW_LABELS
	}

	if (isReview && isSurvey && !isAnswered) {
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

const getLabel = (correctLabels, incorrectLabels, score, isReview, isSurvey, isAnswered) => {
	return getRandomItem(
		score === 100 || score === 'no-score'
			? getCorrectLabels(correctLabels, isReview, isSurvey, isAnswered)
			: getIncorrectLabels(incorrectLabels, isReview)
	)
}

export { getLabel, getCorrectLabels, getIncorrectLabels }
