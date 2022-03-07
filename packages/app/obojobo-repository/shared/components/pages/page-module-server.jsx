const React = require('react')
const DefaultLayout = require('../layouts/default')
const { propsToStore, createCommonReactApp, convertPropsToString } = require('../../react-utils')
const PageModule = require('./page-module-hoc')
const AboutModuleReducer = require('../../reducers/about-module-reducer')

const PageModuleServer = props => {
	return (
		<DefaultLayout
			title={`${props.module.title} - an Obojobo Module`}
			className="repository--module"
			appScriptUrl={props.appJsUrl}
			appCSSUrl={props.appCSSUrl}
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
				{createCommonReactApp(PageModule, propsToStore(AboutModuleReducer, props))}
			</span>
		</DefaultLayout>
	)
}

module.exports = PageModuleServer
