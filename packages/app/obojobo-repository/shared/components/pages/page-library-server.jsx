const React = require('react')
const DefaultLayout = require('../layouts/default')
const { convertPropsToString } = require('../../react-utils')

const PageLibraryServer = props => {
	return (
		<DefaultLayout
			title={`Obojobo Module Library`}
			appScriptUrl={props.appJsUrl}
			appCSSUrl={props.appCSSUrl}
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)} />
		</DefaultLayout>
	)
}

module.exports = PageLibraryServer
