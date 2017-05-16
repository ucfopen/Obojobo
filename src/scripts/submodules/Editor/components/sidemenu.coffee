require './sidemenu.scss'
require 'dragula/dist/dragula.css'

SideMenuList = require './sidemenu/sidemenulist'
SideMenuHandle = require './sidemenu/sidemenuhandle'

dragula = require 'dragula'

Common = window.ObojoboDraft.Common
DOMUtil = Common.page.DOMUtil

MARGIN = 15
WIDTH = 30
HEIGHT = 30

SideMenu = React.createClass
	getInitialState: ->
		chunkRect: @props.selection.chunkRect
		draggedNode: null

	componentWillReceiveProps: (nextProps) ->
		if not nextProps.enabled
			@dragAndDropReady = false

		@setState {
			chunkRect: nextProps.selection.chunkRect
		}

	onBeforeClick: (componentClass) ->
		@props.handlerFn 'before', componentClass

	onAfterClick: (componentClass) ->
		@props.handlerFn 'after', componentClass

	setupDragAndDrop: ->
		if @dragAndDropReady then return

		if @drake then @drake.destroy()

		thisEl = ReactDOM.findDOMNode(@)

		@drake = dragula [@props.controlsEl],
			moves: (el) -> el is thisEl

		@drake.on 'drag', @onDrag
		@drake.on 'dragend', @onDragEnd

		# @dragAndDropReady = true

	onDrag: (el) ->
		@props.onStartDrag()

		draggedContainer = document.createElement 'div'
		draggedContainer.classList.add 'dragged-container'
		draggedContainer.style.width = @state.chunkRect.width + 'px'
		# draggedContainer.style.height = @state.chunkRect.height + 'px'

		for chunk in @props.selection.virtual.all
			chunkEl = chunk.getDomEl()
			chunkEl.classList.add 'editor--components--side-menu--dragged'

			chunkCloneEl = chunkEl.cloneNode true
			chunkCloneEl.setAttribute 'data-id', '0'
			chunkCloneEl.classList.add 'drag-clone'
			draggedContainer.appendChild chunkCloneEl

		document.addEventListener 'mousemove', @boundMouseMoveListener

		@setState {
			draggedNode: draggedContainer
		}

		# setTimeout (->
		# 	debugger;
		# ).bind(@), 1000

		true

	onMouseMove: (event) ->
		console.log @dragNewIndex

		if not @lastClientY then @lastClientY = event.clientY

		if event.clientY > @lastClientY
			@direction = 'down'
		else if event.clientY < @lastClientY
			@direction = 'up'
		@lastClientY = event.clientY

		startChunk = @props.selection.startChunk
		selChunk = startChunk.getDomEl()

		el = document.elementFromPoint(window.innerWidth / 2, event.clientY)

		mouseChunk = @props.selection.page.chunks.get DOMUtil.findParentAttr(el, 'data-id')

		return if not mouseChunk?

		mouseChunkEl = mouseChunk.getDomEl()

		# console.log mouseChunk.get('index'), !mouseChunkEl.classList.contains('editor--components--side-menu--dragged'), @direction, @dragNewIndex > mouseChunk.get('index'), @dragNewIndex > mouseChunk.get('index')

		# if not mouseChunkEl.classList.contains 'editor--components--side-menu--dragged'
		return if (@direction is 'down' and @dragNewIndex > mouseChunk.get('index')) or (@direction is 'up' and @dragNewIndex < mouseChunk.get('index'))

		# console.clear()
		# console.log @dragNewIndex, '-->', mouseChunk.get('index')


		@dragNewIndex = mouseChunk.get('index')
		console.log 'DNI', mouseChunk.get('index')

		switch @direction
			when 'up'
				for chunk in Object.assign([], @props.selection.virtual.all).reverse()
					@props.selection.page.moveChunk chunk, @dragNewIndex

				for chunk in @props.selection.page.chunks.models
					chunkEl = chunk.getDomEl()
					chunkEl.parentElement.appendChild chunkEl
			when 'down'
				for chunk in @props.selection.virtual.all
					@props.selection.page.moveChunk chunk, @dragNewIndex

				for chunk in @props.selection.page.chunks.models
					chunkEl = chunk.getDomEl()
					chunkEl.parentElement.appendChild chunkEl

		@props.renderModuleFn()

		true

	onDragEnd: ->

		# return

		delete @lastClientY
		delete @direction
		delete @dragNewIndex

		document.removeEventListener 'mousemove', @boundMouseMoveListener

		@props.onDrop()

		@setState {
			draggedNode: null
		}

	componentDidMount: ->
		@boundMouseMoveListener = @onMouseMove #.bind(@)

	componentWillUnmount: ->
		@dragAndDropReady = false

	componentDidUpdate: (prevProps, prevState) ->
		if @state.draggedNode?
			for chunk in @props.selection.virtual.all
				chunkEl = chunk.getDomEl()
				chunkEl.classList.add 'editor--components--side-menu--dragged'
		else if not @state.draggedNode? and prevState.draggedNode?
			for chunk in @props.selection.virtual.all
				chunkEl = chunk.getDomEl()
				chunkEl.classList.remove 'editor--components--side-menu--dragged'
	render: ->
		if not @props.enabled then return null

		chunkRect = @state.chunkRect


		if not chunkRect or not @props.controlsEl then return null

		ctrlRect = @props.controlsEl.getBoundingClientRect()

		top = chunkRect.top - ctrlRect.top - MARGIN
		bottom = chunkRect.bottom - ctrlRect.top - MARGIN

		styles =
			top: top

		`<div className={'editor--components--side-menu' + (this.state.draggedNode ? ' dragging' : '')} style={styles} onMouseOver={this.setupDragAndDrop}>
			<div className='side-menu-container'>
				<SideMenuHandle yPos={HEIGHT / 2} height={bottom - top} />
				<SideMenuList insertItems={this.props.insertItems} onMouseDown={this.onBeforeClick} yPos={0} />
				<SideMenuList insertItems={this.props.insertItems} onMouseDown={this.onAfterClick} yPos={bottom - top} />
			</div>
			{
				this.state.draggedNode
				?
				<div className="clone-container" ref="cloneContainer" dangerouslySetInnerHTML={{ __html:this.state.draggedNode.outerHTML }}></div>
				:
				null
			}
		</div>`


module.exports = SideMenu