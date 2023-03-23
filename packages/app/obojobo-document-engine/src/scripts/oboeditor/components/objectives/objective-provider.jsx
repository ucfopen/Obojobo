import React from 'react'
import objectivesContext from './objective-context.js'

class ObjectiveProvider extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<objectivesContext.Provider value={this.props.state}>
				{this.props.children}
			</objectivesContext.Provider>
		)
	}
}

export default ObjectiveProvider