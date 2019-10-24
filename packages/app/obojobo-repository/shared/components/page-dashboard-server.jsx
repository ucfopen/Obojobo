const React = require('react');
const DefaultLayout = require('./layouts/default')
const Dashboard = require('./dashboard-hoc')
const { propsToStore, createCommonReactApp, convertPropsToString} = require('../react-utils')
const DashboardReducer = require('../reducers/dashboard-reducer')

const PageDashboardServer = props =>
	<DefaultLayout
		title="Dashboard"
		className="repository--dashboard"
		headerJs={['//cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js']}
		appScriptUrl="/static/dashboard.js"
		appCSSUrl="/static/dashboard.css"
		>
		<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
			{createCommonReactApp(Dashboard, propsToStore(DashboardReducer, props))}
		</span>
	</DefaultLayout>

PageDashboardServer.defaultProps = {
	dialog: false,
	dialog: null,
	selectedModule:{},
	draftPermissions:{},
	myModules:[],
	moduleSearchString: '',
	shareSearchString: '',
	searchPeople:{
		hasFetched: false,
		isFetching: false,
		timestamp: 3,
		items:[]
	}
}

module.exports = PageDashboardServer
