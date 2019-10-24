require('./repository-nav.scss')

const React = require('react')
const Avatar = require('./avatar')
const Search = require('./search')

const RepositoryNav = (props) =>
	<div className="repository--section-wrapper repository--stick-to-top">
		<nav className="repository--nav">
			<a href="/"><div className="repository--nav--logo">Obojobo</div></a>
			<div className="repository--nav--links--link"><a href="/library">Module Library</a></div>
			<div className="repository--nav--links--link"><a href="/dashboard">Dashboard</a></div>
			{ /* <Search /> */ }
			{ props.userId !== 0 ?
				<div className="repository--nav--current-user">
					<div className="repository--nav--current-user--name">{props.displayName}</div>
					<Avatar id={props.userId} avatarUrl={props.avatarUrl} notice={props.noticeCount} className="repository--nav--current-user--avatar" />
					<div className="repository--nav--current-user--menu">
						<div className="repository--nav--current-user--link"><a href="/profile/logout">Log Out</a></div>
					</div>
				</div>
				: <div className="repository--nav--links--link"><a href="/login">Log in</a></div>
			}
		</nav>
	</div>

module.exports = RepositoryNav
