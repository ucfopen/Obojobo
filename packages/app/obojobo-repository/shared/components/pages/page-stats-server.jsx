const React = require('react')
const LayoutDefault = require('../layouts/default')
const Stats = require('../stats-hoc')
const { propsToStore, createCommonReactApp, convertPropsToString } = require('../../react-utils')
const StatsReducer = require('../../reducers/stats-reducer')

const PageStatsServer = props => {
	return (
		<LayoutDefault
			title="Stats"
			className="repository--stats"
			appScriptUrl={props.appJsUrl}
			appCSSUrl={props.appCSSUrl}
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
				{createCommonReactApp(Stats, propsToStore(StatsReducer, props))}
			</span>
		</LayoutDefault>
	)
}

PageStatsServer.defaultProps = {
	dialog: null,
	selectedModule: {},
	draftPermissions: {},
	myModules: [],
	selectedModules: [],
	multiSelectMode: false,
	moduleSearchString: '',
	shareSearchString: '',
	versionHistory: {
		hasFetched: false,
		isFetching: false,
		items: []
	},
	searchPeople: {
		hasFetched: false,
		isFetching: false,
		timestamp: 3,
		items: []
	}
}

module.exports = PageStatsServer
