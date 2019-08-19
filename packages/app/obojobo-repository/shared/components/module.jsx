require('./module.scss')

const React = require('react')
const { useState } = require('react')
const ModuleImage = require('./module-image')
const ModuleMenu = require('./module-menu-hoc')

const Module = (props) => {
	const [isMenuOpen, setMenuOpen] = useState(false)
	const onCloseMenu = () => setMenuOpen(false)
	const onToggleMenu = (e) => {
		setMenuOpen(!isMenuOpen)
		e.preventDefault() // block the event from bubbling out to the parent href
	}

	return (
		<div onMouseLeave={onCloseMenu} className={"repository--module-icon " + (isMenuOpen ? "is-open" : "is-not-open") }>
			<a href={`/library/${props.draftId}`} >
				<ModuleImage id={props.draftId} />
				{ props.hasMenu ?
					<div onClick={onToggleMenu} className="repository--module-icon--menu-control-button">
						<svg height="32px" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg">
							<path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/>
						</svg>
					</div>
					: null
				}
				<div className="repository--module-icon--title">{props.title}</div>
			</a>
			{ isMenuOpen ?
				<ModuleMenu draftId={props.draftId} editor={props.editor} title={props.title} />
				: null
			}
			{props.children}
		</div>
	)
}

module.exports = Module
