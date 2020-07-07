import './jsonRenderer.scss'

import React, { Suspense } from 'react'
import ActionButtonAdapter from 'obojobo-chunks-action-button/adapter'
import BreakAdapter from 'obojobo-chunks-break/adapter'
// import CodeAdapter from 'obojobo-chunks-code/adapter'
import FigureAdapter from 'obojobo-chunks-figure/adapter'
import HeadingAdapter from 'obojobo-chunks-heading/adapter'
import HtmlAdapter from 'obojobo-chunks-html/adapter'
// import IframeAdapter from 'obojobo-chunks-iframe/adapter'
import ListAdapter from 'obojobo-chunks-list/adapter'
import MathEquationAdapter from 'obojobo-chunks-math-equation/adapter'
import TableAdapter from 'obojobo-chunks-table/adapter'
import TextAdaptor from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter.js'
import YoutubeAdapter from 'obojobo-chunks-youtube/adapter'

const ModelRenderer = props => {
	const { model } = props

	let Component
	switch (model.get('type')) {
		case 'ObojoboDraft.Chunks.ActionButton':
			Component = React.lazy(() => import('obojobo-chunks-action-button/viewer-component'))
			ActionButtonAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Break':
			Component = React.lazy(() => import('obojobo-chunks-break/viewer-component'))
			BreakAdapter.construct(model, model.attributes)
			break
		// case 'ObojoboDraft.Chunks.Code':
		// 	Component = React.lazy(() => import('obojobo-chunks-code/viewer-component'))
		// 	break
		case 'ObojoboDraft.Chunks.Figure':
			Component = React.lazy(() => import('obojobo-chunks-figure/viewer-component'))
			FigureAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Heading':
			Component = React.lazy(() => import('obojobo-chunks-heading/viewer-component'))
			HeadingAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.HTML':
			Component = React.lazy(() => import('obojobo-chunks-html/viewer-component'))
			HtmlAdapter.construct(model, model.attributes)
			break
		// case 'ObojoboDraft.Chunks.IFrame':
		// 	Component = React.lazy(() => import('obojobo-chunks-iframe/viewer-component'))
		// 	IframeAdapter.construct(model, model.attributes)
		// 	break
		case 'ObojoboDraft.Chunks.List':
			Component = React.lazy(() => import('obojobo-chunks-list/viewer-component'))
			ListAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.MathEquation':
			Component = React.lazy(() => import('obojobo-chunks-math-equation/viewer-component'))
			MathEquationAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Table':
			Component = React.lazy(() => import('obojobo-chunks-table/viewer-component'))
			TableAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Text':
			Component = React.lazy(() => import('obojobo-chunks-text/viewer-component'))
			TextAdaptor.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.YouTube':
			Component = React.lazy(() => import('obojobo-chunks-youtube/viewer-component'))
			YoutubeAdapter.construct(model, model.attributes)
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

export default ModelRenderer
