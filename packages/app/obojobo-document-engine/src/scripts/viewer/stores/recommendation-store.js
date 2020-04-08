import Common from 'Common'
import RecommendationUtil from '../../viewer/util/recommendation-util'

const { Dispatcher } = Common.flux
const { Store } = Common.flux

class RecommendationStore extends Store {
	constructor() {
		super('recommendationStore')

		Dispatcher.on(
			{
				'question:scoreSet': payload => {
					RecommendationUtil.onQuestionAnswered(this.state, payload)
					this.updateRecommendations()
					this.triggerChange()
				},

				'question:view': () => {
					RecommendationUtil.onOpenQuestion(this.state)
					this.updateRecommendations()
					this.triggerChange()
				},

				'nav:gotoPath': payload => {
					if (!this.state) return

					this.state.currentPageID = payload.value.path
					RecommendationUtil.onOpenPage(this.state)
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

	init(navState) {
		console.log(navState)
		this.state = {
			confidenceLevels: [],
			overallConfidence: 0,
			currentPageID: null,
			pages: [],
			recommendations: []
		}

		let first = true
		for (const page in navState.itemsByPath) {
			if (!(navState.itemsByPath[page].contentType === 'Page')) continue

			if (first) {
				this.state.currentPageID = page
				first = false
			}

			this.state.confidenceLevels[page] = 36
			this.state.pages[page] = { 
				path: page, 
				title: navState.itemsByPath[page].label, 
				numVisits: 0 
			}

			if (navState.itemsByPath[page].parent.contentType == 'Assessment Section')
				this.state.pages[page].title = navState.itemsByPath[page].parent.label
		}

		RecommendationUtil.onOpenPage(this.state)

		this.updateRecommendations()
	}
}

const recommendationStore = new RecommendationStore()
export default recommendationStore
