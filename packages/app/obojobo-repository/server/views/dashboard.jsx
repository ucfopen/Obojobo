const React = require('react');
const DefaultLayout = require('./layouts/default')
const DashboardClient = require('./dashboard-client')

const title = 'Dashboard'

const propsToHydrate = props => {
	const newProps = Object.assign({}, props);
	delete newProps.settings
	delete newProps.cache
	delete newProps._locals
	return JSON.stringify(newProps)
}

const propsToStore = props => {
	return createStore(counter, props)
}

import { createStore } from 'redux'
import { Provider } from 'react-redux'

// ===== REDUCER ======
function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
}


const Dashboard = (props) =>
	<DefaultLayout title={title} className="repository--dashboard">
		<span id="react-hydrate-root" data-react-props={propsToHydrate(props)} >
			<Provider store={propsToStore(props)}>
				<DashboardClient/>
			</Provider>
		</span>
	</DefaultLayout>

module.exports = Dashboard;
