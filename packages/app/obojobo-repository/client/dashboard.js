import './css/main.scss'
import 'whatwg-fetch'
// import store from './dashboard-store'
import DashboardClient from '../server/views/dashboard-client'
// require('./dashboard-app')

import { createStore } from 'redux'
import { Provider } from 'react-redux'

// ===== REDUCER ======
function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
}

function hydrateDomElement(AppComponent, domId){
	const domEl = document.querySelector(domId)
	const initialState = JSON.parse(domEl.dataset.reactProps)
	// ReactDOM.hydrate(<AppComponent {...props} />, domEl)
	console.log('creating store!')
	const store = createStore(counter, initialState)

	ReactDOM.hydrate(
		<Provider store={store}>
			<AppComponent />
		</Provider>,
		domEl
	)
}

hydrateDomElement(DashboardClient, "#react-hydrate-root")
