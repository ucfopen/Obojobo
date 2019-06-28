const React = require('react');
const DefaultLayout = require('./layouts/default')
const DashboardClient = require('./dashboard-client')

const title = 'Dashboard'

const propsToHydrate = props => {
	const newProps = Object.assign({}, props);
	delete newProps.settings
	delete newProps.cache
	delete newProps._locals
	return JSON.stringify(newProps)
}

const Dashboard = (props) =>
	<DefaultLayout title={title} className="repository--dashboard">
		<span id="react-hydrate-root" data-react-props={propsToHydrate(props)} >
			<DashboardClient title={title} {...props}/>
		</span>
	</DefaultLayout>

module.exports = Dashboard;
