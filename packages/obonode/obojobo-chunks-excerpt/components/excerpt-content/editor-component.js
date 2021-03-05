// import '../../viewer-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const EdgeControls = ({ position, edges, selectedEdge, onChangeEdge, y, w }) => {
	if (edges.length === 0) {
		return null
	}

	const onMouseDown = (edgeType, event) => {
		event.preventDefault()

		onChangeEdge(edgeType)
	}

	const onChange = event => {
		event.preventDefault()

		onChangeEdge(event.target.value)
	}

	return (
		<div
			className={`obojobo-draft--chunks--excerpt--edge-controls is-position-${position}`}
			contentEditable={false}
			role="radiogroup"
			aria-label={`Select the edge display for the ${position} edge`}
			style={{ top: `${y}px`, width: `${w}px` }}
		>
			<div className="edges">
				{edges.map(e => (
					<label
						key={e}
						className={(selectedEdge === e ? 'is-selected' : 'is-not-selected') + ' is-edge-' + e}
						onMouseDown={onMouseDown.bind(null, e)}
					>
						<input
							type="radio"
							name={position}
							value={e}
							checked={selectedEdge === e}
							onChange={onChange}
						/>
						<span>{e}</span>
					</label>
				))}
			</div>
		</div>
	)
}

const ExcerptContent = props => {
	const [parent, parentPath] = Editor.parent(
		props.editor,
		ReactEditor.findPath(props.editor, props.element)
	)
	const parentContent = parent.content

	return (
		<div className="excerpt-content">
			{/* <button
				onClick={() => {
					Transforms.setNodes(
						props.editor,
						{ content: { ...parent.content, fontSize: 'larger' } },
						{ at: parentPath }
					)
				}}
			>
				do it bigger!
			</button>
			<EdgeControls
				position="top"
				y={0}
				w={100}
				edges={['normal', 'fade', 'jagged']}
				selectedEdge={parentContent.topEdge}
				onChangeEdge={() => {}}
			/> */}
			<div className="wrapper">{props.children}</div>
			<div className="overlay" />
		</div>
	)
}

export default withSlateWrapper(ExcerptContent)
