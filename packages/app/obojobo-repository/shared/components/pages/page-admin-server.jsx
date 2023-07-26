const React = require('react')
const LayoutDefault = require('../layouts/default')
const Admin = require('../admin-hoc')
const { propsToStore, createCommonReactApp, convertPropsToString } = require('../../react-utils')
const AdminReducer = require('../../reducers/admin-reducer')

const PageAdminServer = props => {
	return (
		<LayoutDefault
			title="Admin"
			className="repository--admin"
			appScriptUrl={props.appJsUrl}
			appCSSUrl={props.appCSSUrl}
		>
			<span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
				{createCommonReactApp(Admin, propsToStore(AdminReducer, props))}
			</span>
		</LayoutDefault>
	)
}

PageAdminServer.defaultProps = {}

module.exports = PageAdminServer
