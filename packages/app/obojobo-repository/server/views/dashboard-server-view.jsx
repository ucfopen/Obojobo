const React = require('react');
const { createStore, applyMiddleware } = require('redux')
const { Provider } = require('react-redux')
const DashboardReducer = require('../../shared/reducers/dashboard-reducer')
const DefaultLayout = require('../../shared/components/layouts/default')
const Dashboard = require('../../shared/components/dashboard-hoc')
const { propsToStore, createCommonReactApp, convertPropsToString} = require('../../shared/react-utils')

const DashboardServerApp = props =>
	<DefaultLayout
		title="Dashboard"
		className="repository--dashboard"
		headerJs={['//cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js']}
		appScriptUrl="/static/dashboard.js">
		<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
			{createCommonReactApp(Dashboard, propsToStore(DashboardReducer, props))}
		</span>
	</DefaultLayout>

DashboardServerApp.defaultProps = {
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

module.exports = DashboardServerApp;
