const React = require('react')
const { Provider } = require('react-redux')
const { createStore, applyMiddleware, compose } = require('redux')
const { middleware } = require('redux-pack')

// used in the browser to hydrate a SSR page w/o Redux
function hydrateElWithoutStore(Component, domSelector) {
	const domEl = document.querySelector(domSelector)
	const initialState = JSON.parse(domEl.dataset.reactProps)
	const app = React.createElement(Component, initialState)
	ReactDOM.hydrate(app, domEl) //eslint-disable-line no-undef
}

// used in the browser to 'hydrate' a SSR page w/ Redux
function hydrateEl(Component, reducers, domSelector) {
	// locate the element containing the react app to hydrate
	const domEl = document.querySelector(domSelector)
	// reconstitute state into object (created by convertPropsToString)
	const initialState = JSON.parse(domEl.dataset.reactProps)
	// compose middleware to allow for redux dev tools
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
	const combinedMiddleware = composeEnhancers(applyMiddleware(middleware))
	// create a store w/ initial state and middleware
	const store = propsToStore(reducers, initialState, combinedMiddleware)
	const app = createCommonReactApp(Component, store)
	ReactDOM.hydrate(app, domEl) //eslint-disable-line no-undef
}

// used on the server and client to create a redux store
function propsToStore(reducer, initialState, optionalMiddleware) {
	const preppedMiddleware = optionalMiddleware || applyMiddleware(middleware)
	return createStore(reducer, initialState, preppedMiddleware)
}

function createCommonReactApp(Component, store) {
	const app = React.createElement(Component)
	const provider = React.createElement(Provider, { store }, app)
	return provider
}

// used to render state objects into a SSR page
// so that they can be used to hydrate the application
function convertPropsToString(props) {
	const newProps = Object.assign({}, props)
	delete newProps.settings
	delete newProps.cache
	delete newProps._locals
	return JSON.stringify(newProps)
}

module.exports = {
	hydrateEl,
	hydrateElWithoutStore,
	propsToStore,
	createCommonReactApp,
	convertPropsToString
}
