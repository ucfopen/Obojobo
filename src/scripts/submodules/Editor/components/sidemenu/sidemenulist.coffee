require './sidemenulist.scss'

Common = window.ObojoboDraft.Common

WIDTH = 30
HEIGHT = 30
MENU_OPEN_DURATION_MS = 100

SideMenuList = React.createClass
	getInitialState: ->
		open: false
		hoveredLabel: null

	getDefaultProps: ->
		enabled: true

	open: ->
		clearTimeout @timeoutId
		@setState { open:true }

	close: ->
		@timeoutId = setTimeout (->
			@setState {
				open: false
				hoveredLabel: null
			}
		).bind(@), MENU_OPEN_DURATION_MS

	onMouseDown: (componentClass) ->
		@close()
		@props.onMouseDown componentClass

	setHoveredLabel: (label) ->
		@setState { hoveredLabel:label }

	render: ->
		# console.log 'insertItems', @props.insertItems
		if not @props.enabled then return null

		onMouseDown = @onMouseDown
		children = []
		self = @
		setHoveredLabel = @setHoveredLabel

		isOpen = @props.alwaysOpen || @state.open

		@props.insertItems.forEach (insert, chunkType) ->
			componentClass = OBO.componentClassMap.getClassForType chunkType
			mouseDown = (event) ->
				event.preventDefault()
				self.onMouseDown.bind(self, componentClass)()
			styles =
				backgroundImage: Common.util.getBackgroundImage(insert.icon)
			children.push `<div className="side-menu-button"
								ref={"_" + insert.label}
								key={chunkType}
							>
								<span className="label-container"><span className="label">{insert.label}</span></span>
								<button
									onMouseOver={setHoveredLabel.bind(null, insert.label)}
									onMouseOut={setHoveredLabel.bind(null, null)}
									onMouseDown={mouseDown}
									style={styles}
								>
									{insert.label}
								</button>
							</div>`

		`<div
			className={'editor--components--side-menu--side-menu-list' + (isOpen ? ' open' : '')}
			onMouseOver={this.open}
			onMouseOut={this.close}
			style={{top: this.props.yPos + 'px'}}
		>
			{
				this.props.alwaysOpen
				?
				null
				:
				<div className="insert-button"></div>
			}
			<div ref="insertList" className="insert-list" style={{display: (isOpen ? 'inline-block' : 'none')}}>{children}</div>
		</div>`


module.exports = SideMenuList