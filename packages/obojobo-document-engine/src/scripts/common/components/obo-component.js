import React from 'react'

import FocusUtil from '../../common/util/focus-util'

class OboComponent extends React.Component {
	static get defaultProps() {
		return { tag: 'div' }
	}

	componentDidMount() {
		return this.props.model.processTrigger('onMount')
	}

	componentWillUnmount() {
		return this.props.model.processTrigger('onUnmount')
	}

	render() {
		const Tag = this.props.tag

		let className = 'component'
		if (this.props.className) {
			className += ` ${this.props.className}`
		}

		const isFocussed =
			FocusUtil.getFocussedComponent(this.props.moduleData.focusState) === this.props.model

		const otherProps = {}
		for (const propKey in this.props) {
			switch (propKey) {
				case 'model':
				case 'moduleData':
				case 'tag':
				case 'className':
				case 'children':
					// do nothing
					break

				default:
					otherProps[propKey] = this.props[propKey]
					break
			}
		}

		return (
			<Tag
				{...otherProps}
				className={className}
				id={this.props.model.getDomId()}
				data-obo-component
				data-id={this.props.model.get('id')}
				data-type={this.props.model.get('type')}
				data-focussed={isFocussed}
				tabIndex={this.props.tabIndex || this.props.tabIndex === 0 ? this.props.tabIndex : -1}
				ref="el"
			>
				{this.props.children}
			</Tag>
		)
	}
}

export default OboComponent
