import React from 'react'
import GaugeChart from 'react-gauge-chart'
import Recommendations from './recommendation-component'

const NEEDS_WORK_ARC_LENGTH = 0.40
const GOOD_ARC_LENGTH = (1 - NEEDS_WORK_ARC_LENGTH) / 3

// presets for the Gauge components
const GAUGE_COLORS = ["#ad271a", "#64bc49", "#4c9b33", "#316f1e"]
const GAUGE_DATA = {
    'Needs Work':	{
        color: GAUGE_COLORS[0],
        arcLength: NEEDS_WORK_ARC_LENGTH,
        cutoff: NEEDS_WORK_ARC_LENGTH
    },
    'Good': {
        color: GAUGE_COLORS[1],
        arcLength: GOOD_ARC_LENGTH,
        cutoff: GOOD_ARC_LENGTH + NEEDS_WORK_ARC_LENGTH
    },
    'Great': {
        color: GAUGE_COLORS[2],
        arcLength: GOOD_ARC_LENGTH,
        cutoff: GOOD_ARC_LENGTH + GOOD_ARC_LENGTH + NEEDS_WORK_ARC_LENGTH
    },
    'Exceptional': {
        color: GAUGE_COLORS[3],
        arcLength: GOOD_ARC_LENGTH,
        cutoff: 1
    }
}

const GAUGE_SETTINGS = {
    nrOfLevels: 4,
    // react-gauge-chart has a bug that overwrites heights from stylesheets
    height: {height: "75%"},
    arcLengths: [
        GAUGE_DATA['Needs Work'].arcLength,
        GAUGE_DATA['Good'].arcLength,
        GAUGE_DATA['Great'].arcLength,
        GAUGE_DATA['Exceptional'].arcLength
    ],
    arcWidth: 0.1,
    colors: GAUGE_COLORS,
    hideText: true
}

const Summary = props => {
	const thisPagePercent = 
		props.moduleData.recommendationState.confidenceLevels[props.moduleData.recommendationState.currentPageID] / 100
	const overallPercent = props.moduleData.recommendationState.overallConfidence / 100

	const pageGauge = {
		percent: thisPagePercent,
		color: Recommendations.determineColor(thisPagePercent, GAUGE_DATA)
	}
	const overallGauge = {
		percent: overallPercent,
		color: Recommendations.determineColor(overallPercent, GAUGE_DATA)
	}

	return (
		<div className="summary-box">
			<div className="summary this-page">
				<div>This Page</div>
				<GaugeChart id="gauge-this-page"
					className="summary gauge"
					style={GAUGE_SETTINGS.height}
					nrOfLevels={GAUGE_SETTINGS.nrOfLevels}
					arcsLength={GAUGE_SETTINGS.arcLengths}
					arcWidth={GAUGE_SETTINGS.arcWidth}
					colors={GAUGE_SETTINGS.colors}
					percent={pageGauge.percent}
					needleColor={pageGauge.color}
					needleBaseColor={pageGauge.color}
					hideText={GAUGE_SETTINGS.hideText}
				/>
			</div>
			<div className="summary overall">
				<div>Overall</div>
				<GaugeChart id="gauge-overall"
					className="summary gauge"
					style={GAUGE_SETTINGS.height}
					nrOfLevels={GAUGE_SETTINGS.nrOfLevels}
					arcsLength={GAUGE_SETTINGS.arcLengths}
					arcWidth={GAUGE_SETTINGS.arcWidth}
					colors={GAUGE_SETTINGS.colors}
					percent={overallGauge.percent}
					needleColor={overallGauge.color}
					needleBaseColor={overallGauge.color}
					hideText={GAUGE_SETTINGS.hideText}
				/>
			</div>
		</div>
	)
}

export default Summary