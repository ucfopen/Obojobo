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

import ActionButton from 'obojobo-chunks-action-button/viewer-component'
import Break from 'obojobo-chunks-break/viewer-component'
import Figure from 'obojobo-chunks-figure/viewer-component'
import Heading from 'obojobo-chunks-heading/viewer-component'
import HTML from 'obojobo-chunks-html/viewer-component'
import List from 'obojobo-chunks-list/viewer-component'
import MathEquation from 'obojobo-chunks-math-equation/viewer-component'
import Table from 'obojobo-chunks-table/viewer-component'
import Text from 'obojobo-chunks-text/viewer-component'
import Youtube from 'obojobo-chunks-youtube/viewer-component'

const ModelRenderer = props => {
	const { model } = props

	let Component
	switch (model.get('type')) {
		case 'ObojoboDraft.Chunks.ActionButton':
			Component = ActionButton
			ActionButtonAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Break':
			Component = Break
			BreakAdapter.construct(model, model.attributes)
			break
		// case 'ObojoboDraft.Chunks.Code':
		// 	Component = React.lazy(() => import('obojobo-chunks-code/viewer-component'))
		// 	break
		case 'ObojoboDraft.Chunks.Figure':
			Component = Figure
			FigureAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Heading':
			Component = Heading
			HeadingAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.HTML':
			Component = HTML
			HtmlAdapter.construct(model, model.attributes)
			break
		// case 'ObojoboDraft.Chunks.IFrame':
		// 	Component = React.lazy(() => import('obojobo-chunks-iframe/viewer-component'))
		// 	IframeAdapter.construct(model, model.attributes)
		// 	break
		case 'ObojoboDraft.Chunks.List':
			Component = List
			ListAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.MathEquation':
			Component = MathEquation
			MathEquationAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Table':
			Component = Table
			TableAdapter.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.Text':
			Component = Text
			TextAdaptor.construct(model, model.attributes)
			break
		case 'ObojoboDraft.Chunks.YouTube':
			Component = Youtube
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
