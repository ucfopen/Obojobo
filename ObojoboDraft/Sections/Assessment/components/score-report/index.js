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
	return ''
}

const getSpanTextClass = type => {
	switch (type) {
		case 'penalty':
			return 'is-type-score-report-penalty'
		case 'extra-credit':
			return 'is-type-score-report-extra-credit'
	}
	return ''
}

const getTextDiv = (type, text) => {
	switch (type) {
		case 'value':
		case 'line':
		case 'total':
			return (
				<div className={`score-report-text score-report-text-${type}`}>
					<div className="score-report-text-content">{type === 'line' ? text : text + ':'}</div>
				</div>
			)
	}
	return (
		<div className="score-report-text">
			<div className="score-report-text-content">
				<span className={getSpanTextClass(type)}>
					{type.charAt(0).toUpperCase() + type.substr(1)}
				</span>
				{' - ' + text + ':'}
			</div>
		</div>
	)
}

const getScoreDiv = (type, value) => (
	<div className="score-report-score">
		<div className="score-report-score-content">
			<strong>
				{getSpecialChar(type)}
				{value ? ' ' + value + ' %' : null}
			</strong>
		</div>
	</div>
)

const getModsBreakdownItem = ({ type, text, value }) => (
	<div className="mod-breakdown-item">
		{getTextDiv(type, text)}
		{type === 'line' ? null : getScoreDiv(type, value)}
	</div>
)

const getModsBreakdown = items => (
	<div className="mod-breakdown">
		<div className="mod-breakdown-items">
			{items.map((item, index) => getModsBreakdownItem(item))}
		</div>
	</div>
)

const scoreReportView = ({ items, highestScore = null }) => {
	if (highestScore) highestScore = highestScore + '%'
	return highestScore ? (
		<div className="score-report is-showing-highest-score">
			<div className="highest-score">
				<h2>Highest Score</h2>
				<span className="value">{highestScore}</span>
				{getModsBreakdown(items)}
			</div>
		</div>
	) : (
		<div className="score-report">{getModsBreakdown(items)}</div>
	)
}

export default scoreReportView
