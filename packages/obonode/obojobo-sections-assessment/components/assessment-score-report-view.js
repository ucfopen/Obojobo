require('./assessment-score-report-view.scss')

import React from 'react'

const GREAT_JOB_YOU_ROCK_EMOJIS = ['😎', '💪', '🔥', '✨', '⭐']

const getRandomGreatJobEmoji = () => {
	return GREAT_JOB_YOU_ROCK_EMOJIS[Math.floor(Math.random() * GREAT_JOB_YOU_ROCK_EMOJIS.length)]
}

const scoreReportView = props => (
	<div className="obojobo-draft--sections--assessment--components--score-report">
		<div className="text-items">{props.report.textItems.map(getItemEl)}</div>
		{props.report.scoreChangeDescription === null ? null : (
			<span className="score-change-description">{props.report.scoreChangeDescription}</span>
		)}
	</div>
)

const getAmountEl = (updated, isTotal100 = false) => {
	if (updated === 'Did Not Pass') {
		return <span className="amount is-null">Did Not Pass</span>
	}

	if (isTotal100) {
		return (
			<div className="amount is-number">
				{updated}%<span className="great-job-you-rock">{getRandomGreatJobEmoji()}</span>
			</div>
		)
	}

	return <span className="amount is-number">{updated}%</span>
}

const getItemEl = (item, index) => {
	switch (item.type) {
		case 'text':
			return (
				<div key={index} className="text">
					{item.text}
				</div>
			)

		case 'divider':
			return <hr key={index} className="divider" />

		case 'extra-credit':
			return (
				<div key={index} className="extra-credit">
					<span className="label">
						<span>Extra-credit</span> - {item.text}
					</span>
					{getAmountEl('+' + item.updated)}
				</div>
			)

		case 'penalty':
			return (
				<div key={index} className="penalty">
					<span className="label">
						<span>Penalty</span> - {item.text}
					</span>
					{getAmountEl('-' + item.updated)}
				</div>
			)

		case 'updated':
		case 'total':
			return (
				<div key={index} className={item.type}>
					<div className="label">{item.text}</div>
					{getAmountEl(item.updated, item.type === 'total' && item.updated === '100')}
				</div>
			)
	}
}

export default scoreReportView
