const React = require('react')

const VersionHistoryListItem = ({
	isSelected,
	onClick,
	index,
	createdAtDisplay,
	username,
	isLatestVersion,
	versionNumber,
	isRestored = false
}) => {
	const onClickHandler = React.useCallback(() => {
		onClick(index)
	}, [index])

	const className = 'version-history-list--item' + (isSelected ? ' is-selected' : '')

	return (
		<div className={className} onClick={onClickHandler}>
			<span className="date">{createdAtDisplay}</span>
			<span className="username">by {username}</span>
			{isLatestVersion ? (
				<span className="version latest">Latest Version</span>
			) : (
				<span className="version">Version {versionNumber}</span>
			)}
			{isRestored ? <span className="version restored">Restored</span> : null}
		</div>
	)
}

module.exports = VersionHistoryListItem
