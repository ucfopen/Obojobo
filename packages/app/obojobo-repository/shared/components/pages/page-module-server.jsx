const React = require('react')
const DefaultLayout = require('../layouts/default')
const { convertPropsToString } = require('../../react-utils')

const PageModuleServer = props => {
	return (
		<DefaultLayout
			title={`${props.module.title} - an Obojobo Module`}
			className="repository--module"
			appScriptUrl={props.appJsUrl}
			appCSSUrl={props.appCSSUrl}
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)} />
		</DefaultLayout>
	)
}

module.exports = PageModuleServer
