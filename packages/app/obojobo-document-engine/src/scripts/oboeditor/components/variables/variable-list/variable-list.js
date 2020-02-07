import './variable-list.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const VariableList = ({ variables, currSelect, onClickVarible, setCreatingVariable }) => {
	return (
		<div className="variable-list">
			{variables.map((variable, index) => (
				<div
					key={variable.name}
					className={'single-variable' + (index === currSelect ? ' variable-is-selected' : '')}
					onClick={() => onClickVarible(index)}
				>
					<h4>${variable.name}</h4>
					<p>{variable.type}</p>
				</div>
			))}
			<Button className="create-variable-button" onClick={setCreatingVariable}>
				+ Create Variable
			</Button>
		</div>
	)
}

export default VariableList
