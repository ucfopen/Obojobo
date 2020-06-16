const React = require('react')

const VersionHistoryListItem = props => {
	const isSelected = props.isSelected ? 'is-selected' : ''

	return (
		<div
			className={`version-history-list--item ${isSelected}`}
			onClick={() => {
				// Pass the index so the revision history
				// menu knows which item is currently selected
				props.onClickRevision(props.index)
			}}
		>
			<span className="date">{props.createdAtDisplay}</span>
			<span className="username">by {props.username}</span>
			{props.isLatestVersion ? (
				<span className="latest-version">Latest Version</span>
			) : (
				<span className="version">Version {props.versionNumber}</span>
			)}
		</div>
	)
}

module.exports = VersionHistoryListItem
