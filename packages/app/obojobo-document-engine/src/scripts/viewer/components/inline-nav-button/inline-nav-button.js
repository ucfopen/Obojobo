import './inline-nav-button.scss'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const inlineNavButton = props => {
	// Get states from Redux Store
	const { oboNodeList, navList, currNavIndex: currNavIndex } = useSelector(state => state)

	// Get actions from Redux Store
	const dispatch = useDispatch()

	let navIndex, content, disabled
	switch (props.type) {
		case 'prev':
			navIndex = currNavIndex - 1
			content = 'Prev: '
			disabled = navIndex < 0
			content = disabled
				? 'Start of Obojobo Example Document'
				: `Prev: ${oboNodeList[navList[navIndex]].attributes.content.title}`
			break
		case 'next':
			navIndex = currNavIndex + 1
			content = 'Next: '
			disabled = navIndex >= navList.length
			content = disabled
				? 'End of Obojobo Example Document'
				: `Next: ${oboNodeList[navList[navIndex]].attributes.content.title}`
			break
	}
	return (
		<button
			className={`viewer--components--inline-nav-button is-${props.type}${
				disabled ? ' is-not-enabled' : ' is-enabled'
			}`}
			onClick={() => dispatch({ type: 'ON_SET_NAV', payload: { value: navIndex } })}
			aria-label={content}
			aria-disabled={disabled}
		>
			{content}
		</button>
	)
}

export default inlineNavButton
