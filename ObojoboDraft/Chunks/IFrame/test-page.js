const systemFont =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

const getBoxStyle = size => {
	return {
		outline: '1px solid #00bcd4',
		position: 'absolute',
		left: 0,
		right: 0,
		display: 'block',
		width: size,
		height: size
	}
}

const getSpanStyle = size => {
	return {
		fontFamily: systemFont,
		position: 'absolute',
		right: 0,
		bottom: 0,
		color: 'white',
		background: '#00bcd4'
	}
}

export default class TestPage extends React.Component {
	render() {
		return (
			<body
				style={{
					padding: 0,
					margin: 0,
					width: 1600,
					height: 1600,
					backgroundSize: '10px 10px',
					backgroundColor: '#f4f4f4',
					backgroundImage:
						'linear-gradient(to right, #e6e6e6 1px, transparent 1px), linear-gradient(to bottom, #e6e6e6 1px, transparent 1px)'
				}}
			>
				<div style={getBoxStyle(50)}>
					<span style={getSpanStyle(50)}>50</span>
				</div>
				<div style={getBoxStyle(100)}>
					<span style={getSpanStyle(100)}>100</span>
				</div>
				<div style={getBoxStyle(200)}>
					<span style={getSpanStyle(200)}>200</span>
				</div>
				<div style={getBoxStyle(400)}>
					<span style={getSpanStyle(400)}>400</span>
				</div>
				<div style={getBoxStyle(800)}>
					<span style={getSpanStyle(800)}>800</span>
				</div>
				<div style={getBoxStyle(1600)}>
					<span style={getSpanStyle(1600)}>1600</span>
				</div>
				<div
					style={{
						position: 'fixed',
						left: '50%',
						top: '50%',
						margin: '0',
						background: 'rgba(0, 0, 0, 0.5)',
						color: 'white',
						padding: '0.5em 1.5em',
						borderRadius: '4em',
						transform: 'translate(-50%, -50%)',
						fontWeight: 'bold',
						textShadow: '0 1px rgba(0, 0, 0, 0.5)',
						fontFamily: systemFont,
						textAlign: 'center',
						pointerEvents: 'none'
					}}
				>
					Iframe Test Page
				</div>
				<div
					style={{
						position: 'fixed',
						bottom: 0,
						fontSize: 14,
						left: '50%',
						margin: 0,
						background: 'rgb(223, 246, 249)',
						padding: '0.5em 1.5em',
						transform: 'translate(-50%, 0)',
						fontFamily: systemFont,
						color: '#007a8a',
						width: '60%',
						textAlign: 'center',
						pointerEvents: 'none',
						borderRadius: '0.25em',
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0
					}}
				>
					You're seeing this test page because no <code style={{ fontWeight: 'bold' }}>src</code>{' '}
					attribute was set. You can use this test page to see how this iframe displays. Set the{' '}
					<code style={{ fontWeight: 'bold' }}>src</code> attribute to a URL to show that page
					instead.
				</div>
			</body>
		)
	}
}
