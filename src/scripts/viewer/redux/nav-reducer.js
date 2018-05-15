import Common from 'Common'
const { OboModel } = Common.models
const { FocusUtil } = Common.util
import APIUtil from '../util/api-util'
import NavUtil from '../util/nav-util'
import {
	NAV_INIT,
	NAV_SET_CONTEXT,
	NAV_REBUILD_MENU,
	NAV_GOTO_PATH,
	NAV_PREV,
	NAV_NEXT,
	NAV_GOTO,
	NAV_SET_FLAG,
	NAV_LOCK,
	NAV_UNLOCK,
	NAV_CLOSE,
	NAV_OPEN,
	NAV_TOGGLE,
	NAV_OPEN_EXTERNAL_LINK,
	NAV_SHOW_CHILDREN,
	NAV_HIDE_CHILDREN
} from './nav-actions'
import { QUESTION_SCORE_SET } from './question-actions'

const PostMessageVersion = '1.0.0'

const initialState = {
	visitId: 0,
	locked: false,
	open: true,
	navTargetId: null,
	context: 'practice',
	items: {}, // Todo - convert to MAP
	itemsById: {}, // TODO - convert to MAP
	itemsByPath: {}, // TODO - convert to MAP
	itemsByFullPath: {}, // TODO - convert to MAP
	navTargetHistory: [],
}

export default function(state = initialState, action) {
	switch(action.type){
		case NAV_INIT:
			let newState = Object.assign({}, state)
			newState.locked = action.serverViewState.isLocked != null ? action.serverViewState.isLocked : false
			newState.open = action.serverViewState.isOpen != null ? action.serverViewState.isOpen : true
			newState.visitId = action.visitId
			newState.items = generateNav(action.model, action.visitId, newState.itemsByPath, newState.itemsByFullPath, newState.itemsById)

			let target
			if(action.itemId != null){
				target = state.itemsById[action.itemId]
			}
			else{
				target = NavUtil.getFirst(newState.items)
			}

			newState = gotoItemWithState(target, action.type, newState)
			return newState

		case NAV_SET_CONTEXT:
			return combineState(state, {context: action.context})

		case NAV_REBUILD_MENU:
			let reset = {
				itemsById: {},
				itemsByPath: {},
				itemsByFullPath: {}
			}
			reset.items = generateNav(action.model, state.visitId, reset.itemsByPath, reset.itemsByFullPath, reset.itemsById)
			return combineState(state, reset)

		case NAV_GOTO_PATH:
			return gotoItemWithState(state.itemsByPath[action.path], action.type, state)

		case NAV_PREV:
			return gotoItemWithState(NavUtil.getPrev(state.items, state.itemsById[state.navTargetId]), action.type, state)

		case NAV_NEXT:
			return gotoItemWithState(NavUtil.getNext(state.items, state.itemsById[state.navTargetId]), action.type, state)

		case NAV_GOTO:
			return gotoItemWithState(state.itemsById[action.itemId], action.type, state)

		case NAV_SET_FLAG:
			setFlag(state.itemsById[action.itemId], action.flag, action.value)
			return state

		case NAV_LOCK:
			if(state.locked !== true) APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion)
			return combineState(state, {locked: true})

		case NAV_UNLOCK :
			if(state.locked !== false) APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion)
			return combineState(state, {locked: false})

		case NAV_CLOSE :
			if(state.open !== false) APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion)
			return combineState(state, {open: false})

		case NAV_OPEN :
			if(state.open !== true) APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion)
			return combineState(state, {open: true})

		case NAV_TOGGLE :
			let alteredState = {open: !state.open}
			APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion, alteredState)
			return combineState(state, alteredState)

		case NAV_OPEN_EXTERNAL_LINK:
			// @TODO: this is a new postEvent!
			APIUtil.postEvent(OboModel.getRoot(), action.type, PostMessageVersion, {url: action.url})
			window.open(action.url)
			return state

		case NAV_SHOW_CHILDREN:
			state.itemsById[action.itemId].showChildren = true
			return state

		case NAV_HIDE_CHILDREN:
			state.itemsById[action.itemId].showChildren = false
			return state

		case QUESTION_SCORE_SET:
			setFlag(state.itemsById[action.itemId], action.flag, action.value)
			return state

		default:
			return state
	}
}

// condense state updates with current state onto a new object
const combineState = (baseState, stateToAdd) => Object.assign({}, baseState, stateToAdd)

// call gotoItem and return a new state
const gotoItemWithState = (target, actionType, state) => {
	let alteredState = gotoItem(target, actionType, state)
	return combineState(state, alteredState)
}

// set a flag on a nav item
const setFlag = (navItem, flag, value) => {
	if(navItem){
		navItem.flags[flag] = value
	}
}

// go to a new item
// signal exit on old item
// signal enter on new item
// update browser url
// send postMessage
const gotoItem = (nextItem, actionType, state) => {
	if (!nextItem) {
		return {}
	}

	let currentItemId = null
	let newHistory = state.navTargetHistory.slice()
	// if current target isnt empty
	if (state.navTargetId != null) {
		currentItemId = state.navTargetId
		// if new == old, just exit
		if (currentItemId === nextItem.id) {
			return {}
		}

		// tell the current target we're exiting
		let navTargetModel = NavUtil.getNavTargetModel(state.itemsById, currentItemId)
		if (navTargetModel && navTargetModel.processTrigger) {
			navTargetModel.processTrigger('onNavExit')
		}

		// push current onto history
		newHistory.push(state.navTargetId)
		// tell current to hide children
		state.itemsById[state.navTargetId].showChildren = false // @TODO: this alters state in place
	}

	// tell next item to display children
	if (nextItem.showChildrenOnNavigation) {
		nextItem.showChildren = true // @TODO: this alters state in place
	}

	// remove foucs from whatever has focus
	FocusUtil.unfocus()
	// change url
	window.history.pushState({}, document.title, nextItem.fullFlatPath)
	// tell new target we're entering
	NavUtil.getNavTargetModel(state.itemsById, nextItem.id).processTrigger('onNavEnter')

	// send event to server
	APIUtil.postEvent(OboModel.getRoot(), actionType, PostMessageVersion, {
		from: currentItemId,
		to: nextItem.id
	})

	// return state changes
	return { navTargetHistory:newHistory, navTargetId: nextItem.id }
}

// build the entire nav tree items
const generateNav = (model, visitId, itemsByPath, itemsByFullPath, itemsById, indent) => {
	if (!model) return {}

	if (indent == null) {
		indent = ''
	}

	// get registered model (chunk/viewer.js)
	let item = Common.Store.getItemForType(model.get('type'))

	// use the model's custom getNavItem method to build nav
	let navItem = null
	if (item.getNavItem != null) {
		navItem = item.getNavItem(model)
	}

	if (navItem == null) {
		navItem = {}
	}

	const defaultNavItem = {
		type: 'hidden',
		label: '',
		path: '',
		showChildren: true,
		showChildrenOnNavigation: true
	}

	// combine defaults with custom items
	navItem = Object.assign(defaultNavItem, navItem)

	navItem.children = []
	navItem.id = model.get('id')
	navItem.fullPath = [].concat(navItem.path).filter(item => item !== '')
	navItem.flags = {
		visited: false,
		complete: false,
		correct: false
	}

	// recurse down the children
	for (let child of Array.from(model.children.models)) {
		let childNavItem = generateNav(child, visitId, itemsByPath, itemsByFullPath, itemsById, indent + '_')
		navItem.children.push(childNavItem)
		childNavItem.fullPath = navItem.fullPath
			.concat(childNavItem.fullPath)
			.filter(item => item !== '')

		let flatPath = childNavItem.fullPath.join('/')
		childNavItem.flatPath = flatPath
		childNavItem.fullFlatPath = [
			'/view',
			model.getRoot().get('draftId'),
			'visit',
			visitId,
			flatPath
		].join('/')

		// update our maps
		// doing this inside the child loop avoids doing this on the top node
		itemsByPath[flatPath] = childNavItem
		itemsByFullPath[childNavItem.fullFlatPath] = childNavItem
	}

	itemsById[model.get('id')] = navItem

	return navItem
}

