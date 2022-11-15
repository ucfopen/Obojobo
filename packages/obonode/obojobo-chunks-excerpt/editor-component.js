import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import React from 'react'
import './editor-component.scss'
import './viewer-component.scss'

class Excerpt extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const content = this.props.element.content

		// console.log('@TODO: Make sure these css class names wont bleed')
		// console.log('@TODO: when excerpt is the last item the menu obscures the (+) button')
		// console.log('@TODO: over time multiple cite lines are created')
		// console.log('@TODO: glow text leaks into the caption')
		// console.log('@TODO: hitting enter too quickly results in a crash') -> unable to reproduce
		return (
			<Node {...this.props}>
				<div
					className={`text-chunk obojobo-draft--chunks--excerpt pad ${
						this.props.selected ? 'is-selected' : 'is-not-selected'
					} is-body-style-type-${content.bodyStyle} is-top-edge-type-${
						content.topEdge
					} is-bottom-edge-type-${content.bottomEdge} is-width-${content.width} is-font-${
						content.font
					} is-line-height-type-${content.lineHeight} is-font-size-${content.fontSize} ${
						content.effect ? 'is-showing-effect' : 'is-not-showing-effect'
					}`}
				>
					<blockquote>{this.props.children}</blockquote>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Excerpt)
