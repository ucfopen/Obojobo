import './css/main.scss'
import 'whatwg-fetch'
import Dashboard from '../shared/components/dashboard-hoc'
import DashboardReducer from '../shared/reducers/dashboard-reducer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { middleware as reduxPackMiddleware } from 'redux-pack'

const convertPropsToStore = initialState => {
	return createStore(DashboardReducer, initialState, applyMiddleware(reduxPackMiddleware))
}

function hydrateDomElement(AppComponent, domId){
	const domEl = document.querySelector(domId)
	const initialState = JSON.parse(domEl.dataset.reactProps)
	const store = convertPropsToStore(initialState)

	ReactDOM.hydrate(
		<Provider store={store}>
			<AppComponent />
		</Provider>,
		domEl
	)
}

hydrateDomElement(Dashboard, "#react-hydrate-root")
