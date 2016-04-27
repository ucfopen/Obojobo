LoadingModal = React.createClass
	render: ->
		if not @props.show then return null

		`<div className="loading-modal">Loading......</div>`


module.exports = LoadingModal