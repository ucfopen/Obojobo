const React = require('react')
const Avatar = require('./avatar')

const getSVG = (svg) => ({
	"__html": require(svg)
})

const RepositoryNav = (props) =>
	<div class="repository--section-wrapper repository--stick-to-top">
		<nav class="repository--nav">
			<a href="/"><div class="repository--nav--logo">Obojobo</div></a>
			<div class="repository--nav--links--link"><a href="/library">Library</a></div>
			<div class="repository--nav--links--link"><a href="/editor">New Module</a></div>
			<div class="repository--nav--links--search">
				<div class="repository--nav--links--search--icon" dangerouslySetInnerHTML={getSVG('./magnify.svg')} ></div>
				<input type="search" name="search" placeholder="Find a module..." />
			</div>

			<div class="repository--nav--current-user">
				<div class="repository--nav--current-user--name">Ian Turgeon</div>
				<div class="repository--nav--current-user--link"><a href="/dashboard">Your Dashboard</a></div>
				<Avatar id="women/89" notice="5" className="repository--nav--current-user--avatar" />
				<div class="repository--nav--current-user--menu">
					Notices?
					Links?
				</div>
			</div>
		</nav>
	</div>

module.exports = RepositoryNav
