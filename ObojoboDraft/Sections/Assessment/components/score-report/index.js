require('./index.scss')

const scoreReportView = props => {
	return (
		<div className="obojobo-draft--sections--assessment--components--score-report">
			{props.items.map(getItemEl)}
		</div>
	)
}

const getAmountEl = value => {
	if (value === 'No Score Recorded') {
		return <span className="amount is-null">No Score Recorded</span>
	}

	return <span className="amount is-number">{value}%</span>
}

const getItemEl = item => {
	switch (item.type) {
		case 'text':
			return <div className="text">{item.text}</div>

		case 'divider':
			return <hr className="divider" />

		case 'extra-credit':
			return (
				<div className="extra-credit">
					<span className="label">
						<span>Extra-credit</span> - {item.text}
					</span>
					{getAmountEl('+' + item.value)}
				</div>
			)

		case 'penalty':
			return (
				<div className="penalty">
					<span className="label">
						<span>Penalty</span> - {item.text}
					</span>
					{getAmountEl('-' + item.value)}
				</div>
			)

		case 'value':
		case 'total':
			return (
				<div className={item.type}>
					<span className="label">{item.text}</span>
					{getAmountEl(item.value)}
				</div>
			)
	}
}

export default scoreReportView
