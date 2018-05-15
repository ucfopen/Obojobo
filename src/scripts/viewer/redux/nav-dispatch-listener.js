import Common from 'Common'
import ViewerStore from './viewer-store'
import * as NavActions from './nav-actions'
let { Dispatcher } = Common.flux

// make a bride between the old dispatcher and the Redux Nav Actions
// @TODO - there should probably be a more direct connection
// perhaps instead of firing thes events, just call the actions
// directly
let d = ViewerStore.dispatch
Dispatcher.on({
	'nav:init': () => {d(NavActions.navInitialize())},
	'nav:setContext': e => {d(NavActions.setContext(e.value.context))},
	'nav:rebuildMenu': e => {d(NavActions.rebuildMenu(e.value.model))},
	'nav:gotoPath': e => {d(NavActions.gotoPath(e.value.path))},
	'nav:setFlag': e => {d(NavActions.setFlag(e.value.id, e.value.flagName, e.value.flagValue))},
	'nav:prev': () => {d(NavActions.gotoPrev())},
	'nav:next': () => {d(NavActions.gotoNext())},
	'nav:goto': e => {d(NavActions.goto(e.value.id))},
	'nav:lock': () => {d(NavActions.lock())},
	'nav:unlock': () => {d(NavActions.unlock())},
	'nav:close': () => {d(NavActions.close())},
	'nav:open': () => {d(NavActions.open())},
	'nav:toggle': () => {d(NavActions.toggle())},
	'nav:openExternalLink': e => {d(NavActions.openExternalLink(e.value.url))},
	'nav:showChildren': e => {d(NavActions.showChildren(e.value.id))},
	'nav:hideChildren': e => {d(NavActions.hideChildren(e.value.id))},
	'question:scoreSet': e => {d(NavActions.setFlag(e.value.id, 'correct', e.value.score === 100))}
})
