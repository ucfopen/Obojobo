import React from 'react'
import Recommendations from './recommendation-component'
import RecommendationUtil from '../util/recommendation-util'
import NavUtil from '../util/nav-util'

const NEEDS_WORK_ARC_LENGTH = 0.40
const GOOD_ARC_LENGTH = (1 - NEEDS_WORK_ARC_LENGTH) / 3
const COLORS = [
	{color: " red", cutoff: NEEDS_WORK_ARC_LENGTH}, 
	{color: " light-green", cutoff: NEEDS_WORK_ARC_LENGTH + GOOD_ARC_LENGTH}, 
	{color: " green", cutoff: NEEDS_WORK_ARC_LENGTH + GOOD_ARC_LENGTH + GOOD_ARC_LENGTH},
	{color: " dark-green", cutoff: 1}
]

const Recommendation = props => {
	const hasVisited = RecommendationUtil.hasVisited(props.rec.path, props.moduleData.recommendationState)
	const color = Recommendations.determineColor(props.moduleData.recommendationState.confidenceLevels[props.rec.path] / 100, COLORS)

	return (
		<div onClick={() => NavUtil.gotoPath(props.rec.path)} 
			className= {"recommendation" + 
						((hasVisited) ? color : " neutral")}
		>
			<div className="number">{props.recNumber}.</div>
			<div className="rec">
				{props.isTopRecommendation ? (
					<div className="rec top-recommendation">TOP RECOMMENDATION &#10071;-  </div>
				) : null}
				{hasVisited ? (
					<>
						<div className="rec name has-visited">Improve on <span className="rec link">{props.rec.title}</span></div>
						<div className="rec message">
							You should consider improving your understanding of this content before moving on.
						</div>
					</>
					) : (
					<>
						<div className="rec name has-not-visited">Move on to <span className="rec link">{props.rec.title}</span></div> 
						<div className="rec message">
							You should be ready to move on to this page, but consider improving your 
							understanding of the content on the current page before you do.
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Recommendation