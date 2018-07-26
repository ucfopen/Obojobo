import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import React from 'react'

import PageEditor from './page-editor'

import './viewer-component.scss'

/**
 * The plain text example.
 *
 * @type {Component}
 */

class EditorApp extends React.Component {
	/**
	 * Deserialize the initial editor value.
	 *
	 * @type {Object}
	 */
	constructor(props) {
		super(props)
		this.state = {
			value: Plain.deserialize(
				'This is editable plain text, just like a <textarea>!'
			),
		}
	}

	/**
	 * Render the editor.
	 *
	 * @return {Component} component
	 */

	render() {
		return (
			<div className={'viewer--viewer-app is-loaded is-previewing is-unlocked-nav is-open-nav is-enabled-nav is-focus-state-inactive'}>
				<div className={'viewer--components--nav'}>
					<p>{'Page-1'}</p>
					<p>{'Page-2'}</p>
					<p>{'Assessment'}</p>
					<p>{'Add Page'}</p>
				</div>
				<div className={'component obojobo-draft--modules--module'}>
					<div className={'toolbar'}>
						{'The Toolbar'}
					</div>
					<PageEditor />
				</div>
			</div>
		)
	}

	/**
	 * On change.
	 *
	 * @param {Change} change
	 */

	onChange({ value }) {
		this.setState({ value })
	}
}

/**
 * Export.
 */

export default EditorApp
