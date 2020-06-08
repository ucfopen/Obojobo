import './recommendation-component.scss'
import React from 'react'
import RecommendationUtil from '../util/recommendation-util'
import Summary from './recommendation-summary-component'
import Recommendation from './individual-recommendation-component'

class Recommendations extends React.Component {
	render() {
		// don't display in Assessment pages
		if (RecommendationUtil.isOnAssessmentPage(this.props.moduleData.recommendationState))
			return <div></div>

		const recommendations = this.props.moduleData.recommendationState.recommendations
		return (
			<div className="component recommendation-parent">
				<Summary moduleData={this.props.moduleData} />
				<div className="recommendation-box">
					<div className="title">Recommended Next Steps</div>
					<Recommendation 
						moduleData={this.props.moduleData} 
						rec={recommendations.first} 
						recNumber={1} 
						isTopRecommendation={true} 
					/>
					<Recommendation 
						moduleData={this.props.moduleData} 
						rec={recommendations.second} 
						recNumber={2} 
						isTopRecommendation={false} 
					/>
					<Recommendation 
						moduleData={this.props.moduleData} 
						rec={recommendations.third} 
						recNumber={3} 
						isTopRecommendation={false} 
					/>
				</div>
			</div>
		)
	}

	static determineColor(percent, settings) {
		for (const setting in settings) {
			if (percent <= settings[setting].cutoff)
				return settings[setting].color
		}
	}
}

export default Recommendations
