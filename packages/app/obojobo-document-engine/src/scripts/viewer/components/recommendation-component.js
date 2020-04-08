import './recommendation-component.scss'
import React from 'react'
import NavUtil from '../util/nav-util'
import RecommendationUtil from '../util/recommendation-util'
import GaugeChart from 'react-gauge-chart'

const determineColor = (percent, settings) => {
	for (const setting in settings) {
		if (percent <= settings[setting].cutoff)
			return settings[setting].color
	}
}

const Summary = props => {
	const thisPagePercent = 
		props.moduleData.recommendationState.confidenceLevels[props.moduleData.recommendationState.currentPageID] / 100
	const overallPercent = props.moduleData.recommendationState.overallConfidence / 100
	const nwArcLength = 0.40
	const goodArcLength = (1 - nwArcLength) / 3

	// react-gauge-chart has a bug that overwrites heights from stylesheets
	const gaugeHeight = {
		height: "75%"
	}

	// presets for the Gauge components
	const gaugeColors = ["#ad271a", "#64bc49", "#4c9b33", "#316f1e"]
	const gaugeData = {
	    'Needs Work':	{
			color: gaugeColors[0],
			arcLength: nwArcLength,
			cutoff: nwArcLength
		},
		'Good': {
			color: gaugeColors[1],
			arcLength: goodArcLength,
			cutoff: goodArcLength + nwArcLength
		},
		'Great': {
			color: gaugeColors[2],
			arcLength: goodArcLength,
			cutoff: goodArcLength + goodArcLength + nwArcLength
		},
		'Exceptional': {
			color: gaugeColors[3],
			arcLength: goodArcLength,
			cutoff: 1
		}
	}

	const pageGauge = {
		percent: thisPagePercent,
		color: determineColor(thisPagePercent, gaugeData)
	}

	const overallGauge = {
		percent: overallPercent,
		color: determineColor(overallPercent, gaugeData)
	}

	const gaugeSettings = {
		nrOfLevels: 4,
		arcLengths: [
			gaugeData['Needs Work'].arcLength,
			gaugeData['Good'].arcLength,
			gaugeData['Great'].arcLength,
			gaugeData['Exceptional'].arcLength
		],
		arcWidth: 0.1,
		colors: gaugeColors,
		hideText: true
	}

	return (
		<div className="summary-box">
			<div className="summary this-page">
				<div>This Page</div>
				<GaugeChart id="gauge-this-page"
					className="summary gauge"
					style={gaugeHeight}
					nrOfLevels={gaugeSettings.nrOfLevels}
					arcsLength={gaugeSettings.arcLengths}
					arcWidth={gaugeSettings.arcWidth}
					colors={gaugeSettings.colors}
					percent={pageGauge.percent}
					needleColor={pageGauge.color}
					needleBaseColor={pageGauge.color}
					hideText={gaugeSettings.hideText}
				/>
			</div>
			<div className="summary overall">
				<div>Overall</div>
				<GaugeChart id="gauge-overall"
					className="summary gauge"
					style={gaugeHeight}
					nrOfLevels={gaugeSettings.nrOfLevels}
					arcsLength={gaugeSettings.arcLengths}
					arcWidth={gaugeSettings.arcWidth}
					colors={gaugeSettings.colors}
					percent={overallGauge.percent}
					needleColor={overallGauge.color}
					needleBaseColor={overallGauge.color}
					hideText={gaugeSettings.hideText}
				/>
			</div>
		</div>
	)
}

const Recommendation = props => {
	const hasVisited = RecommendationUtil.hasVisited(props.rec.path, props.moduleData.recommendationState);
	const nwArcLength = 0.40
	const goodArcLength = (1 - nwArcLength) / 3
	const colors = [
		{color: " red", cutoff: nwArcLength}, 
		{color: " light-green", cutoff: nwArcLength + goodArcLength}, 
		{color: " green", cutoff: nwArcLength + goodArcLength + goodArcLength},
		{color: " dark-green", cutoff: 1}
	]

	const color = determineColor(props.moduleData.recommendationState.confidenceLevels[props.rec.path] / 100, colors)
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

class Recommendations extends React.Component {
	render() {
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
}

export default Recommendations
