require('./multi-button.scss')

const React = require('react')
const { useState } = require('react')

const MultiButton = props => {
	let timeOutId
	const [isMenuOpen, setMenuOpen] = useState(false)
	const onCloseMenu = () => setMenuOpen(false)
	const onToggleMenu = (e) => {
		setMenuOpen(!isMenuOpen)
		e.preventDefault() // block the event from bubbling out to the parent href
	}
	// Handle keyboard focus
	const onBlurHandler = () => {
		timeOutId = setTimeout(() => {
			setMenuOpen(false)
		})
	}
	const onFocusHandler = () => {
		clearTimeout(timeOutId);
	}

	return (
		<div
			className={`repository--button repository--multi-button ${props.className || ''} ` + (isMenuOpen ? "is-open" : "is-not-open")}
			onFocus={onFocusHandler}
			onBlur={onBlurHandler}
			onMouseLeave={onCloseMenu}>	
			<button onClick={onToggleMenu}>
				<div className="icon">
					<svg viewBox="0 0 134 150" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<path d="M56.29165124598851 4.999999999999999Q64.9519052838329 0 73.61215932167728 4.999999999999999L121.24355652982142 32.5Q129.9038105676658 37.5 129.9038105676658 47.5L129.9038105676658 102.5Q129.9038105676658 112.5 121.24355652982142 117.5L73.61215932167728 145Q64.9519052838329 150 56.29165124598851 145L8.660254037844387 117.5Q0 112.5 0 102.5L0 47.5Q0 37.5 8.660254037844387 32.5Z"/>
					</svg>
				</div>

				{props.title}
			</button>

			<div className="child-buttons">
				{props.children}
			</div>
		</div>
	)
}


module.exports = MultiButton
