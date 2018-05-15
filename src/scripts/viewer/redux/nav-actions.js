export const NAV_INIT = 'nav:init'
export const navInitialize = (model, itemId, visitId, serverViewState) => ({
	type: NAV_INIT,
	model,
	itemId,
	visitId,
	serverViewState
})

export const NAV_SET_CONTEXT = 'nav:setContext'
export const setContext = context => ({
	type: NAV_SET_CONTEXT,
	context
})

export const NAV_REBUILD_MENU = 'nav:rebuildMenu'
export const rebuildMenu = model => ({
	type: NAV_REBUILD_MENU,
	model
})

export const NAV_GOTO_PATH = 'nav:gotoPath'
export const gotoPath = path => ({
	type: NAV_GOTO_PATH,
	path
})

export const NAV_PREV = 'nav:prev'
export const gotoPrev = () => ({type: NAV_PREV})

export const NAV_NEXT = 'nav:next'
export const gotoNext = () => ({type: NAV_NEXT})

export const NAV_GOTO = 'nav:goto'
export const goto = itemId => ({
	type: NAV_GOTO,
	itemId
})

export const NAV_SET_FLAG = 'nav:setFlag'
export const setFlag = (itemId, flag, value) => ({
	type: NAV_SET_FLAG,
	itemId,
	flag,
	value
})

export const NAV_LOCK = 'nav:lock'
export const lock = () => ({type: NAV_LOCK})

export const NAV_UNLOCK = 'nav:unlock'
export const unlock = () => ({type: NAV_UNLOCK})

export const NAV_CLOSE = 'nav:close'
export const close = () => ({type: NAV_CLOSE})

export const NAV_OPEN = 'nav:open'
export const open = () => ({type: NAV_OPEN})

export const NAV_TOGGLE = 'nav:toggle'
export const toggle = () => ({type: NAV_TOGGLE})

export const NAV_OPEN_EXTERNAL_LINK = 'nav:openExternalLink'
export const openExternalLink = url => ({
	type: NAV_OPEN_EXTERNAL_LINK,
	url
})

export const NAV_SHOW_CHILDREN = 'nav:showChildren'
export const showChildren = itemId => ({
	type: NAV_SHOW_CHILDREN,
	itemId
})

export const NAV_HIDE_CHILDREN = 'nav:hideChildren'
export const hideChildren = itemId => ({
	type: NAV_HIDE_CHILDREN,
	itemId
})

