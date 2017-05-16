require './sidemenuhandle.scss'

img = require 'svg-url?noquotes!./assets/handle.svg'

getBackgroundImage = require('ObojoboDraft').util.getBackgroundImage

SideMenuHandle = React.createClass
	getDefaultProps: ->
		yPos: 0
		height: 0

	render: ->
		styles =
			position: 'absolute'
			left: 0
			top: @props.yPos
			height: @props.height
			backgroundImage: getBackgroundImage(img)

		`<div
			className='editor--components--side-menu--side-menu-handle'
			style={styles}
		/>`


module.exports = SideMenuHandle