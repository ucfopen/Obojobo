const getModsList = textItemsArray => {
	const modsList = textItemsArray.map((obj, index) => {
		const { type } = obj

		const getSpecialChar = type => {
			switch (type) {
				case 'extra-credit':
					return '+'
				case 'penalty':
					return '-'
				case 'value':
					return ''
				case 'total':
					return '='
			}
		}

		const getSpanTextClass = type => {
			switch (type) {
				case 'penalty':
					return 'is-type-score-report-penalty'
				case 'extra-credit':
					return 'is-type-score-report-extra-credit'
				default:
					return ''
			}
		}

		const getTextDiv = () => {
			if (type === 'value')
				return (
					<div className="score-report-text score-report-text-value">
						{'Passing Reward:'}
					</div>
				)

			if (type === 'total')
				return (
					<div className="score-report-text score-report-text-total">
						{obj.text}
					</div>
				)

			return (
				<div className="score-report-text">
					<span className={getSpanTextClass(type)}>
						{type.charAt(0).toUpperCase() + type.substr(1)}
					</span>
					{' - ' + obj.text + ':'}
				</div>
			)
		}

		const getScoreDiv = () =>
			<div className="score-report-score">
				<strong>
					{getSpecialChar(obj.type)}
					{obj.value ? ' ' + obj.value + ' %' : null}
				</strong>
			</div>

		return (
			<li>
				{getTextDiv()}
				{getScoreDiv()}
			</li>
		)
	})

	return (
		<ul>
			{modsList}
		</ul>
	)
}

const scoreReportView = ({ items, retainedScore }) => {
	if (typeof retainedScore === 'number') {
		if (retainedScore === 0) retainedScore = '--'
		else retainedScore = retainedScore + ' %'
	}

	let modBreakDown = (
		<div className="mod-breakdown">
			{getModsList(items)}
		</div>
	)

	return retainedScore
		? <div className="score-report is-showing-retained-score">
				<div className="retained-score">
					<div>Retained Score</div>
					<h1>
						{retainedScore}
					</h1>
					{modBreakDown}
				</div>
			</div>
		: <div className="score-report">
				{modBreakDown}
			</div>
}

export default scoreReportView
