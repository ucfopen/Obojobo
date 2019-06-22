const React = require('react')
const Avatar = require('./avatar')

const getSVG = (svg) => ({
	"__html": require(svg)
})

const RepositoryNav = (props) =>
	<div className="repository--section-wrapper repository--stick-to-top">
		<nav className="repository--nav">
			<a href="/"><div className="repository--nav--logo">Obojobo</div></a>
			<div className="repository--nav--links--link"><a href="/library">Library</a></div>
			<div className="repository--nav--links--link"><a href="/editor">New Module</a></div>
			<div className="repository--nav--links--search">
				<div className="repository--nav--links--search--icon" dangerouslySetInnerHTML={getSVG('./magnify.svg')} ></div>
				<input type="search" name="search" placeholder="Find a module..." />
			</div>

			<div className="repository--nav--current-user">
				<div className="repository--nav--current-user--name">Ian Turgeon</div>
				<div className="repository--nav--current-user--link"><a href="/dashboard">Your Dashboard</a></div>
				<Avatar id="women/89" notice="5" className="repository--nav--current-user--avatar" />
				<div className="repository--nav--current-user--menu">
					Notices?
					Links?
				</div>
			</div>
		</nav>
	</div>

module.exports = RepositoryNav
