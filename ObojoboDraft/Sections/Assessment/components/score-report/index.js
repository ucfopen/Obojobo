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
					{type === 'extra-credit' ? 'Extra Credit' : 'Penalty'}
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

const scoreReportView = ({ items, score }) => {
	let scoreEl = null
	if (typeof score !== 'undefined') {
		scoreEl =
			score === null ? (
				<span className="value is-null">--</span>
			) : (
				<span className="value is-not-null">{score}</span>
			)
	}
	return (
		<div
			className={`score-report ${
				typeof score === 'undefined' ? 'is-not-showing-score' : 'is-showing-score'
			}`}
		>
			{scoreEl}
			{getModsBreakdown(items)}
		</div>
	)
	//) : (
	//<div className="score-report">{getModsBreakdown(items)}</div>
	//)
}

export default scoreReportView
