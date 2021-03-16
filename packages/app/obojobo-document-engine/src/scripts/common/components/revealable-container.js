import './revealable-container.scss'

import React from 'react'

import Button from 'obojobo-document-engine/src/scripts/common/components/button'
import isOrNot from '../util/isornot'

const RevealableContainer = ({
	className,
	children,
	maxWidth,
	maxHeight,
	onClick,
	onDeleteButtonClick,
	onDeleteButtonKeyDown,
	isSelected
}) => (
	<div
		className={`obojobo-draft--components--revealable-container-wrapper ${isOrNot(
			isSelected,
			'selected'
		)}`}
		style={{
			maxWidth: `${maxWidth}px`,
			maxHeight: `${maxHeight}px`
		}}
		contentEditable={false}
	>
		<Button
			className="delete-button"
			onClick={onDeleteButtonClick}
			onKeyDown={onDeleteButtonKeyDown}
			tabIndex={isSelected ? 0 : -1}
		>
			×
		</Button>
		<div
			className={`obojobo-draft--components--revealable-container${
				className ? ' ' + className : ''
			}`}
			onClick={onClick}
		>
			{children}
		</div>
	</div>
)

export default RevealableContainer
