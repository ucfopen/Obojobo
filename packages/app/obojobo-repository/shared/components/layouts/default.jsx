require('./default.scss')

const React = require('react')
const Footer = require('./footer')
const Dedication = require('./dedication')
const Notification = require('../notification.jsx').default

const reactVersion = '16.13.1'

const LayoutDefault = props => (
	<html lang="en">
		<head>
			<title>{props.title}</title>
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
			<meta
				id="meta-viewport"
				name="viewport"
				content="width=device-width initial-scale=1 minimum-scale=1 user-scalable=yes"
			/>
			{props.appCSSUrl ? <link rel="stylesheet" media="screen" href={props.appCSSUrl} /> : null}
			<link
				rel="preload"
				as="style"
				href="//fonts.googleapis.com/css?family=Libre+Franklin:400,400i,700,700i,900,900i|Roboto+Mono:400,400i,700,700i|Noto+Serif:400,400i,700,700i&display=swap"
			/>
			<link
				rel="stylesheet"
				href="//fonts.googleapis.com/css?family=Libre+Franklin:400,400i,700,700i,900,900i|Roboto+Mono:400,400i,700,700i|Noto+Serif:400,400i,700,700i&display=swap"
			></link>
			{props.headerJs.map((url, index) => (
				<script key={index} src={url}></script>
			))}
			{props.appScriptUrl ? (
				<React.Fragment>
					<script
						referrerPolicy="no-referrer"
						crossOrigin="anonymous"
						defer
						src={`//unpkg.com/react@${reactVersion}/umd/react.${
							props.isDev ? 'development' : 'production.min'
						}.js`}
					></script>
					<script
						referrerPolicy="no-referrer"
						crossOrigin="anonymous"
						defer
						src={`//unpkg.com/react-dom@${reactVersion}/umd/react-dom.${
							props.isDev ? 'development' : 'production.min'
						}.js`}
					></script>
					<script defer src={props.appScriptUrl}></script>
				</React.Fragment>
			) : null}
		</head>
		<body className={props.className}>
			<div className="layout--wrapper">
				<span id="repository-notifications" data-react-props={'{}'}>
					<Notification></Notification>
				</span>
				<div className="layout--content">{props.children}</div>
				<div className="layout--footer">
					<Footer />
				</div>
			</div>

			<Dedication />
		</body>
	</html>
)

LayoutDefault.defaultProps = {
	isDev: false,
	headerJs: []
}

module.exports = LayoutDefault
