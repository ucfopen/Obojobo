import React from 'react'

import ActionButton from 'obojobo-chunks-action-button/viewer-component'
import ActionButtonAdapter from 'obojobo-chunks-action-button/adapter'
import Break from 'obojobo-chunks-break/viewer-component'
import BreakAdapter from 'obojobo-chunks-break/adapter'
import Code from 'obojobo-chunks-code/viewer-component'
import Figure from 'obojobo-chunks-figure/viewer-component'
import FigureAdapter from 'obojobo-chunks-figure/adapter'
import Heading from 'obojobo-chunks-heading/viewer-component'
import HeadingAdapter from 'obojobo-chunks-heading/adapter'
import HTML from 'obojobo-chunks-html/viewer-component'
import Iframe from 'obojobo-chunks-iframe/viewer-component'
import IframeAdapter from 'obojobo-chunks-iframe/adapter'
import HtmlAdapter from 'obojobo-chunks-html/adapter'
import List from 'obojobo-chunks-list/viewer-component'
import ListAdapter from 'obojobo-chunks-list/adapter'
import MathEquation from 'obojobo-chunks-math-equation/viewer-component'
import MathEquationAdapter from 'obojobo-chunks-math-equation/adapter'
import Table from 'obojobo-chunks-table/viewer-component'
import TableAdapter from 'obojobo-chunks-table/adapter'
import Text from 'obojobo-chunks-text/viewer-component'
import TextAdaptor from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter'
import Youtube from 'obojobo-chunks-youtube/viewer-component'
import YoutubeAdapter from 'obojobo-chunks-youtube/adapter'

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
		case 'ObojoboDraft.Chunks.Code':
			Component = Code
			TextAdaptor.construct(model, model.attributes)
			break
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
		case 'ObojoboDraft.Chunks.IFrame':
			Component = Iframe
			IframeAdapter.construct(model, model.attributes)
			break
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

	return <Component model={model} moduleData={{ isFocussed: false }} readOnly />
}

export default ModelRenderer
