import Common from 'Common'
import RecommendationUtil from '../../viewer/util/recommendation-util'

const { Dispatcher } = Common.flux
const { Store } = Common.flux

const OPEN_QUESTION = 2
const OPEN_PAGE = 2
const CORRECT_ANSWER = 15
const WRONG_ANSWER = -12.5
const DEFAULT_CONFIDENCE = 35

class RecommendationStore extends Store {
	constructor() {
		super('recommendationStore')

		Dispatcher.on(
			{
				// triggers update when the user answers a question
				'question:scoreSet': payload => {
					this.onQuestionAnswered(payload)
					this.updateRecommendations()
					this.triggerChange()
				},
				// triggers update when the user opens a question
				'question:view': () => {
					this.onOpenQuestion()
					this.updateRecommendations()
					this.triggerChange()
				},
				// triggers update when the user navigates to a new page
				'nav:gotoPath': payload => {
					if (!this.state) return

					this.state.currentPageID = payload.value.path
					this.onOpenPage()
					this.updateRecommendations()
					this.triggerChange()
				}
			},
			this
		)
	}

	updateRecommendations() {
		this.state.recommendations = RecommendationUtil.createRecommendations(this.state)
		this.state.overallConfidence = RecommendationUtil.updateOverallConfidence(this.state)
		return this.state.recommendations
	}

	boundConfidence(pageId) {
		if (this.state.confidenceLevels[pageId] > 100)
			this.state.confidenceLevels[pageId] = 100
		if (this.state.confidenceLevels[pageId] < 0)
			this.state.confidenceLevels[pageId] = 0
	}

	onQuestionAnswered(payload) {
		if (RecommendationUtil.isOnAssessmentPage(this.state))
			return

		const questionTags = payload.value.itemId.split("#")

		// if question isn't tagged, default to the current page
		if (questionTags.length === 1) {
			this.state.confidenceLevels[this.state.currentPageID] += payload.value.score === 100 ? CORRECT_ANSWER : WRONG_ANSWER
			this.boundConfidence(this.state.currentPageID)
		}
		// if question is tagged, update confidence levels for all associated tags
		else {
			for (const idx in questionTags) {
				if (idx == 0) continue
				this.state.confidenceLevels[questionTags[idx]] += payload.value.score === 100 ? CORRECT_ANSWER : WRONG_ANSWER
				this.boundConfidence(questionTags[idx])
			}
		}
	}

	onOpenQuestion() {
		if (RecommendationUtil.isOnAssessmentPage(this.state))
			return

		const questionTags = payload.value.itemId.split("#")
		if (questionTags.length === 1) {
			this.state.confidenceLevels[this.state.currentPageID] += OPEN_QUESTION
			this.boundConfidence(this.state.currentPageID)
		}
		else {
			for (const idx in questionTags) {
				if (idx == 0) continue
				this.state.confidenceLevels[questionTags[idx]] += OPEN_QUESTION
				this.boundConfidence(questionTags[idx])
			}
		}
	}

	onOpenPage() {
		if (RecommendationUtil.isOnAssessmentPage(this.state))
			return

		this.state.confidenceLevels[this.state.currentPageID] += OPEN_PAGE
		this.state.pages[this.state.currentPageID].numVisits++;
		this.boundConfidence()
	}

	init(navState) {
		this.state = {
			confidenceLevels: [],
			overallConfidence: 0,
			currentPageID: null,
			pages: [],
			recommendations: []
		}

		// compiles list of pages which should be tracked and defaults values
		let first = true
		for (const page in navState.itemsByPath) {
			if (navState.itemsByPath[page].contentType !== 'Page') continue

			if (first) {
				this.state.currentPageID = page
				first = false
			}

			this.state.confidenceLevels[page] = DEFAULT_CONFIDENCE
			this.state.pages[page] = { 
				path: page, 
				title: navState.itemsByPath[page].label, 
				numVisits: 0 
			}

			if (navState.itemsByPath[page].parent.contentType == 'Assessment Section')
				this.state.pages[page].title = navState.itemsByPath[page].parent.label
		}

		// store isn't initialized in time to "see" the first page being opened, 
		// so trigger an open page event for the first page
		this.onOpenPage()
		this.updateRecommendations()
	}
}

const recommendationStore = new RecommendationStore()
export default recommendationStore
