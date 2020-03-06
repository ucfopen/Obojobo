require('./collection.scss')

const React = require('react')
const { useState } = require('react')
const CollectionImage = require('./collection-image')
const CollectionMenu = require('./collection-menu-hoc')

const Collection = props => {
	let timeOutId
	const [isMenuOpen, setMenuOpen] = useState(false)
	const onCloseMenu = () => setMenuOpen(false)
	const onToggleMenu = e => {
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
		clearTimeout(timeOutId)
	}

	let mainRender = (
		<a href={`/library/${props.id}`}>
			<CollectionImage id={props.id} />
			<div className="repository--collection-icon--title">{props.title}</div>
		</a>
	)
	if (props.hasMenu) {
		mainRender = (
			<button onClick={onToggleMenu}>
				<CollectionImage id={props.draftId} />
				<div className="repository--collection-icon--menu-control-button">
					<svg height="32px" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg">
						<path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
					</svg>
				</div>
				<div className="repository--collection-icon--title">{props.title}</div>
			</button>
		)
	}

	let menuRender = null
	if (isMenuOpen) {
		menuRender = null
		menuRender = <CollectionMenu collection={props} />
	}

	return (
		<div
			onMouseLeave={onCloseMenu}
			className={'repository--collection-icon ' + (isMenuOpen ? 'is-open' : 'is-not-open')}
			onBlur={onBlurHandler}
			onFocus={onFocusHandler}
		>
			{mainRender}
			{menuRender}
			{props.children}
		</div>
	)
}

module.exports = Collection
