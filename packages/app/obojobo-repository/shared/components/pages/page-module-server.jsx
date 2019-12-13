const React = require('react')
const DefaultLayout = require('../layouts/default')
const PageModule = require('../module-hoc')
const DashboardReducer = require('../../reducers/dashboard-reducer')
const { propsToStore, createCommonReactApp, convertPropsToString} = require('../../react-utils')

const PageModuleServer = props => {
	return (
        <DefaultLayout
            title={`${props.module.title} - an Obojobo Module`}
            className="repository--module"
            headerJs={['//cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js']}
            appScriptUrl="/static/page-module.js"
            appCSSUrl="/static/page-module.css"
            >
            <span id="react-hydrate-root" data-react-props={convertPropsToString(props)}>
			{createCommonReactApp(PageModule, propsToStore(DashboardReducer, props))}
            </span>
        </DefaultLayout>
    )
}

PageModuleServer.defaultProps = {
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

module.exports = PageModuleServer
