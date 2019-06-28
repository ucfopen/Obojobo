const React = require('react')

const Search = props =>
	<div className="repository--nav--links--search">
		<div className="repository--nav--links--search--icon" >
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250.313 250.313">
				<path d="m244.19 214.6l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 10.7-16.231 16.945-35.66 16.945-56.554 0-56.837-46.075-102.91-102.91-102.91s-102.91 46.075-102.91 102.91c0 56.835 46.074 102.91 102.91 102.91 20.895 0 40.323-6.245 56.554-16.945 0.269 0.301 0.47 0.64 0.759 0.929l54.38 54.38c8.169 8.168 21.413 8.168 29.583 0 8.168-8.169 8.168-21.413 0-29.582zm-141.28-44.458c-37.134 0-67.236-30.102-67.236-67.235 0-37.134 30.103-67.236 67.236-67.236 37.132 0 67.235 30.103 67.235 67.236s-30.103 67.235-67.235 67.235z" clipRule="evenodd" fillRule="evenodd"/>
			</svg>
		</div>
		<input type="search" name="search" placeholder="Find a module..." />
	</div>

module.exports = Search
