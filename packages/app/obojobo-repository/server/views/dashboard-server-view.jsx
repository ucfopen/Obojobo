const React = require('react');
const { createStore, applyMiddleware } = require('redux')
const { Provider } = require('react-redux')
import { middleware as reduxPackMiddleware } from 'redux-pack'
const DashboardReducer = require('../../shared/reducers/dashboard-reducer')
const DefaultLayout = require('../../shared/components/layouts/default')
const Dashboard = require('../../shared/components/dashboard-hoc')

const initialProps = {
	dialog: false,
	dialog: null,
	selectedModule:{},
	draftPermissions:{},
	myModules:[],
	searchPeople:{
		hasFetched: false,
		isFetching: false,
		timestamp: 3,
		items:[]
	}
}

const convertPropsToString = props => {
	const newProps = Object.assign({}, initialProps, props);
	delete newProps.settings
	delete newProps.cache
	delete newProps._locals
	return JSON.stringify(newProps)
}

const convertPropsToStore = initialState => {
	return createStore(DashboardReducer, initialState, applyMiddleware(reduxPackMiddleware))
}

const DashboardServerApp = props =>
	<DefaultLayout title="Dashboard" className="repository--dashboard">
		<span id="react-hydrate-root" data-react-props={convertPropsToString(props)} >
			<Provider store={convertPropsToStore(props)}>
				<Dashboard />I
			</Provider>
		</span>
	</DefaultLayout>

module.exports = DashboardServerApp;
