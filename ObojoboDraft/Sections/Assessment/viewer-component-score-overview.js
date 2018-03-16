const testThing = [
	{
		type: 'value',
		text: 'Attempt 2 score',
		value: '50'
	},
	{
		type: 'penalty',
		text: 'Passed on attempt 2',
		value: '1'
	},
	{
		type: 'penalty',
		text: 'Passed on attempts 1 to 2',
		value: '3'
	},
	{
		type: 'total',
		text: 'Total',
		value: '34'
	}
]

const getLIStyle = type => {
	switch (type) {
		case 'penalty':
			return { color: 'red', display: 'inline-block' }
		case 'extra-credit':
			return { color: 'green', display: 'inline-block' }
		default:
			return { display: 'inline-block' }
	}
}

const ulStyle = {
	padding: 0,
	listStyleType: 'none',
	borderTop: '1px solid LightGray'
}

const getModsTextList = givenObj => {
	const modsList = givenObj.map((obj, index) => {
		let { type } = obj
		let style = getLIStyle(type)

		if (index === 0) {
			return (
				<li>
					<div style={style}>
						{obj.text}
					</div>
				</li>
			)
		}

		return (
			<li>
				<div style={style}>{type.charAt(0).toUpperCase() + type.substr(1)}</div> - {obj.text}:
			</li>
		)
	})

	return (
		<ul style={ulStyle}>
			{modsList}
		</ul>
	)
}

const getModsScoreList = givenObj => {
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

	const modsList = givenObj.map(obj => {
		return (
			<li>
				<strong>
					{getSpecialChar(obj.type)}
					{obj.value}%
				</strong>
			</li>
		)
	})

	return (
		<ul style={ulStyle}>
			{modsList}
		</ul>
	)
}

const scoreOverview = props => {
	let modBreakDown = (
		<div className="mod-breakdown">
			{getModsTextList(testThing)}
			{getModsScoreList(testThing)}
		</div>
	)

	return props.showRetainedScore
		? <div className="retained-score">
				<div style={{ paddingTop: '10px' }}>Retained Score</div>
				<h1>100%</h1>
				{modBreakDown}
			</div>
		: modBreakDown
}

export default scoreOverview
