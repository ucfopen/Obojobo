const React = require('react');
const LayoutDefault = require('../layouts/default')
const Dashboard = require('../dashboard-hoc')
const { propsToStore, createCommonReactApp, convertPropsToString} = require('../../react-utils')
const DashboardReducer = require('../../reducers/dashboard-reducer')
const { assetForEnv } = require('obojobo-express/asset_resolver')
const cssUrl = assetForEnv("/static/dashboard$[.min].css")
const jsUrl = assetForEnv("/static/dashboard$[.min].js")

const PageDashboardServer = props =>
	<LayoutDefault
		title="Dashboard"
		className="repository--dashboard"
		headerJs={['//cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js']}
		appScriptUrl="{jsUrl}
		appCSSUrl={cssUrl}
		>
		<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
			{createCommonReactApp(Dashboard, propsToStore(DashboardReducer, props))}
		</span>
	</LayoutDefault>

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
