const React = require('react')
const { Provider } = require('react-redux')
const { createStore, applyMiddleware } = require('redux')
const { middleware } = require('redux-pack')

function hydrateEl(Component, reducers, domSelector) {
	const domEl = document.querySelector(domSelector)
	const initialState = JSON.parse(domEl.dataset.reactProps)
	const store = propsToStore(reducers, initialState)
	const app = createCommonReactApp(Component, store)
	ReactDOM.hydrate(app, domEl) //eslint-disable-line no-undef
}

function propsToStore(reducer, initialState) {
	const combinedMiddleware = applyMiddleware(middleware)
	return createStore(reducer, initialState, combinedMiddleware)
}

function createCommonReactApp(Component, store) {
	const app = React.createElement(Component)
	const provider = React.createElement(Provider, { store }, app)
	return provider
}

function convertPropsToString(props) {
	const newProps = Object.assign({}, props)
	delete newProps.settings
	delete newProps.cache
	delete newProps._locals
	return JSON.stringify(newProps)
}

module.exports = {
	hydrateEl,
	propsToStore,
	createCommonReactApp,
	convertPropsToString
}
