require('./module-sync-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')

const dayjs = require('dayjs')

const ModuleSyncDialog = props => {
	const syncUpdates = () => {
		props.syncModuleUpdates(props.draftId)
	}

	// default props.newest value will be 'false', indicating still searching
	// explicit check for 'null' later, which will be the result if there are no updates
	let syncableStatusRender = (
		<p className="sync-info-text-only">Checking for updates to this module's original...</p>
	)

	if (props.newest) {
		const dateString = dayjs(props.newest.updatedAt).format('YYYY-MM-DD h:mm A')

		syncableStatusRender = (
			<div className="sync-info">
				<ModuleImage id={props.newest.draftId} />
				<div className="module-title">
					{props.newest.title}
					<br />
					<span className="last-update-time">Last updated: {dateString}</span>
				</div>
				<Button className="sync-button" onClick={syncUpdates}>
					Synchronize
				</Button>
			</div>
		)
	} else if (props.newest === null) {
		syncableStatusRender = (
			<p className="sync-info-text-only">No changes found, copy is up-to-date.</p>
		)
	}

	return (
		<div className="module-sync-dialog">
			<div className="top-bar">
				<ModuleImage id={props.draftId} />
				<div className="module-title" title={props.title}>
					{props.title}
				</div>
				<Button className="close-button" onClick={props.onClose}>
					×
				</Button>
			</div>
			<div className="wrapper">
				<h1 className="title">Synchronize Updates</h1>
				<div className="sub-title">
					This dialog will indicate if any changes have been made to the module this copy was
					created from.
					<br />
					If there have been any changes, you will be given the option to automatically update this
					copy to match.
					<br />
					Please note that synchronizing changes may also change this copy's title.
				</div>
				<div className="sync-info-wrapper">{syncableStatusRender}</div>
			</div>
		</div>
	)
}

module.exports = ModuleSyncDialog
