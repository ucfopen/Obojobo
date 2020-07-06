import './jsonRenderer.scss'

import React, { Suspense } from 'react'
import TextAdaptor from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter.js'
// import HeadingNode from 'obojobo-chunks-heading/viewer-component'
import HeadingAdapter from 'obojobo-chunks-heading/adapter'

const jsonRenderer = props => {
	const { model } = props

	let Component
	switch (model.get('type')) {
		case 'ObojoboDraft.Chunks.Text':
			Component = React.lazy(() => import('obojobo-chunks-text/viewer-component'))
			TextAdaptor.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Heading':
			Component = React.lazy(() => import('obojobo-chunks-heading/viewer-component'))
			HeadingAdapter.construct(model, model.attributes)
			break
		default:
			return null
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Component model={model} moduleData={{}} />
		</Suspense>
	)
}

export default jsonRenderer
