import './variable-list-modal.scss'

import React, { useState } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperties from './variable-properties/variable-properties'
import VariableList from './variable-list/variable-list'
import NewVariable from './new-variable/new-variable'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const VariableListModal = props => {
	const [currSelect, setCurrSelect] = useState(0)
	const [creatingVariable, setCreatingVariable] = useState(false)

	let variables = []
	if (props.content.variables && props.content.variables.variable) {
		variables = props.content.variables.variable
	}

	const onClickVarible = index => {
		setCreatingVariable(false)
		setCurrSelect(index)
	}

	return (
		<SimpleDialog ok title="Variables" onConfirm={() => ModalUtil.hide()}>
			<div className="variable-list-modal">
				<VariableList
					variables={variables}
					currSelect={currSelect}
					onClickVarible={onClickVarible}
					setCreatingVariable={() => setCreatingVariable(true)}
				/>
				{creatingVariable ? (
					<NewVariable />
				) : (
					<VariableProperties variable={variables[currSelect]} />
				)}
			</div>
		</SimpleDialog>
	)
}

export default VariableListModal
