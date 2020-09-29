const React = require('react')

const Loading = ({ isLoading = false, loadingText = 'Loading...', children }) => {
	if (isLoading) {
		return <div className="loading--container">{loadingText}</div>
	}

	return children
}

module.exports = Loading
