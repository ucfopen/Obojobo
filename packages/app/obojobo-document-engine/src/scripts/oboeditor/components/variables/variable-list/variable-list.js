import './variable-list.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { mapTypeToString } from '../constants'

const { Button } = Common.components

const VariableList = props => {
	const { variables, currSelect, onClickVarible, setCreatingVariable } = props

	return (
		<div className="variable-list">
			{variables.map((variable, index) => (
				<div
					key={variable.name}
					className={'single-variable' + (index === currSelect ? ' variable-is-selected' : '')}
					onClick={() => onClickVarible(index)}
					tabIndex="1"
				>
					<h4>${variable.name}</h4>
					<small>
						<p>{variable.type}</p>
					</small>
				</div>
			))}
			<Button className="create-variable-button" onClick={setCreatingVariable}>
				+ Create Variable
			</Button>
		</div>
	)
}

export default VariableList
