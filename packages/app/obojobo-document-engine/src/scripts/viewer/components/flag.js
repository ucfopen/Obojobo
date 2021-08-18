import './flag.scss'

import React from 'react'

const getFlagText = type => {
	switch (type) {
		case Flag.CHOSEN_CORRECTLY:
			return 'Your Answer (Correct)'

		case Flag.CHOSEN_SURVEY:
			return 'Your Response'

		case Flag.SHOULD_NOT_HAVE_CHOSEN:
			return 'Your Answer (Incorrect)'

		case Flag.COULD_HAVE_CHOSEN:
			return 'Also Correct Answer'

		case Flag.SHOULD_HAVE_CHOSEN:
			return 'Correct Answer'
	}

	return ''
}

const Flag = ({ type }) => {
	if (type === Flag.UNCHOSEN_CORRECTLY) return null

	return (
		<div className={`obojobo-draft--components--flag is-type-${type}`}>
			<p>{getFlagText(type)}</p>
		</div>
	)
}

Flag.getType = (isUserCorrect, isACorrectChoice, isSelected, isASurveyQuestion) => {
	if (isASurveyQuestion) {
		return isSelected ? Flag.CHOSEN_SURVEY : Flag.UNCHOSEN_CORRECTLY
	}

	if (isSelected) {
		return isACorrectChoice ? Flag.CHOSEN_CORRECTLY : Flag.SHOULD_NOT_HAVE_CHOSEN
	}

	if (isACorrectChoice) {
		return isUserCorrect ? Flag.COULD_HAVE_CHOSEN : Flag.SHOULD_HAVE_CHOSEN
	}

	return Flag.UNCHOSEN_CORRECTLY
}

Flag.CHOSEN_CORRECTLY = 'chosen-correctly'
Flag.CHOSEN_SURVEY = 'chosen-survey'
Flag.SHOULD_NOT_HAVE_CHOSEN = 'should-not-have-chosen'
Flag.COULD_HAVE_CHOSEN = 'could-have-chosen'
Flag.SHOULD_HAVE_CHOSEN = 'should-have-chosen'
Flag.UNCHOSEN_CORRECTLY = 'unchosen-correctly'

export default Flag
