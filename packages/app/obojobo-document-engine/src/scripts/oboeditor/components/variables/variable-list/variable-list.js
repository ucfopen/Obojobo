import './variable-list.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const VariableList = props => {
	const {
		firstRef,
		variables,
		currSelect,
		onClickVarible,
		creatingVariable,
		setCreatingVariable
	} = props

	return (
		<div className="variable-list">
			{variables.map((variable, index) => (
				<div
					key={variable.name}
					className={
						'single-variable' +
						(index === currSelect && !creatingVariable ? ' variable-is-selected' : '')
					}
					onClick={() => onClickVarible(index)}
					tabIndex="0"
					ref={index === 0 ? firstRef : null}
				>
					<h4>${variable.name}</h4>
					<small>
						<p>{variable.type}</p>
					</small>
				</div>
			))}
			{!creatingVariable ? (
				<Button className="create-variable-button" onClick={setCreatingVariable}>
					+ Create Variable
				</Button>
			) : (
				<div className="variable-holder">
					<p>New Variable...</p>
				</div>
			)}
		</div>
	)
}

export default VariableList
