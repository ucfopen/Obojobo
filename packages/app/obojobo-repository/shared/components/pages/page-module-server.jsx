const React = require('react')
const DefaultLayout = require('../layouts/default')
const PageModule = require('./page-module')
const { convertPropsToString } = require('../../react-utils')

const PageModuleServer = props => {
	return (
		<DefaultLayout
			title={`${props.module.title} - an Obojobo Module`}
			className="repository--module"
			appScriptUrl="/static/page-module.js"
			appCSSUrl="/static/page-module.css"
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
				<PageModule {...props} />
			</span>
		</DefaultLayout>
	)
}

module.exports = PageModuleServer
