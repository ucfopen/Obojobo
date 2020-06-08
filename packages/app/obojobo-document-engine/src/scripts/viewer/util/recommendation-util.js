import NavStore from '../stores/nav-store'
import Common from 'Common'
const { Dispatcher } = Common.flux

// pages which haven't been visted should be given less priority
const NOT_VISITED_OFFSET = 10

const RecommendationUtil = {
	updateOverallConfidence(state) {
		if (this.isOnAssessmentPage(state))
			return
		let sum = 0
		let length = 0
		for (const page in state.pages) {
			if (state.pages[page].numVisits > 0) {
				sum += state.confidenceLevels[page]
				length++
			}
		}

		return sum / length
	},

	hasVisited(page, state) {
		return state.pages[page].numVisits > 0
	},

	isOnAssessmentPage(state) {
		const navState = NavStore.getState()
		if (navState.itemsByPath[state.currentPageID].parent.contentType === 'Assessment Section')
			return true
		if (navState.itemsByPath[state.currentPageID].contentType === 'Assessment Section')
			return true
		return false
	},

	createRecommendations(state) {
		if (this.isOnAssessmentPage(state))
			return
		let firstMin = null
		let secondMin = null
		let thirdMin = null

		// determines which three pages have lowest confidence levels
		for (const page in state.pages) {
			if (
				firstMin === null ||
				state.confidenceLevels[page] + (state.pages[page].numVisits == 0 ? NOT_VISITED_OFFSET : 0) < state.confidenceLevels[firstMin]
			) {
				thirdMin = secondMin
				secondMin = firstMin
				firstMin = page
			} else if (
				secondMin === null ||
				state.confidenceLevels[page] + (state.pages[page].numVisits == 0 ? NOT_VISITED_OFFSET : 0) < state.confidenceLevels[secondMin]
			) {
				thirdMin = secondMin
				secondMin = page
			} else if (
				thirdMin === null ||
				state.confidenceLevels[page] + (state.pages[page].numVisits == 0 ? NOT_VISITED_OFFSET : 0) < state.confidenceLevels[thirdMin]
			) {
				thirdMin = page
			}
		}

		return {
			first: { path: firstMin, title: state.pages[firstMin].title, value: state.confidenceLevels[[firstMin]] },
			second: { path: secondMin, title: state.pages[secondMin].title, value: state.confidenceLevels[[secondMin]] },
			third: { path: thirdMin, title: state.pages[thirdMin].title, value: state.confidenceLevels[[thirdMin]] }
		}
	}
}

export default RecommendationUtil
