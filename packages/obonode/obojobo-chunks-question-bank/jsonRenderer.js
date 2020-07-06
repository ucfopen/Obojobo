import './jsonRenderer.scss'

import React, { Suspense } from 'react'
import Common from 'Common'
import TextAdaptor from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter.js'
// import HeadingNode from 'obojobo-chunks-heading/viewer-component'
import HeadingAdapter from 'obojobo-chunks-heading/adapter'

const { OboModel } = Common.models

const jsonRenderer = props => {
	const { json } = props
	const item = Common.Registry.getItemForType(json.type)
	const model = OboModel.create(json)
	let Component, adapter

	console.log('type', json.type)
	switch (json.type) {
		case 'ObojoboDraft.Chunks.Text':
			Component = React.lazy(() => import('obojobo-chunks-text/viewer-component'))
			adapter = TextAdaptor
			break
		case 'ObojoboDraft.Chunks.Heading':
			Component = React.lazy(() => import('obojobo-chunks-heading/viewer-component'))
			adapter = HeadingAdapter
			break
		default:
			return null
	}

	adapter.construct(model, model.attributes)

	return (
		<div>
			<Suspense fallback={<div>Loading...</div>}>
				<Component model={model} moduleData={{}} />
			</Suspense>
		</div>
	)
}

export default jsonRenderer
