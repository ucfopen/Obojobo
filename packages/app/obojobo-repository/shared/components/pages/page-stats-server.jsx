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
	assessmentStats: {
		hasFetched: false,
		isFetching: false,
		items: []
	}
}

module.exports = PageStatsServer
