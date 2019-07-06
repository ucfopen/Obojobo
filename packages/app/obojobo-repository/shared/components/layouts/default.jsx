const React = require('react');

const DefaultLayout = props =>
	<html lang="en">
		<head>
			<title>{ props.title }</title>
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
			<meta id="meta-viewport" name="viewport" content="width=device-width initial-scale=1 minimum-scale=1 user-scalable=yes" />
			{ props.appCSSUrl ?
				<link rel="stylesheet" media="screen" href={props.appCSSUrl} />
				: <link rel="stylesheet" media="screen" href="/static/dashboard.css" />
			}
			<link rel="stylesheet" media="screen" href="//fonts.googleapis.com/css?family=Libre+Franklin:400,400i,700,700i,900,900i|Roboto+Mono:400,400i,700,700i|Noto+Serif:400,400i,700,700i" />
		</head>
		<body className={props.className}>
			{props.children}
			<footer></footer>
			{ props.appScriptUrl ?
				<React.Fragment>
					<script crossOrigin="true" src="https://unpkg.com/react@16/umd/react.development.js"></script>
					<script crossOrigin="true" src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
					<script src={props.appScriptUrl}></script>
				</React.Fragment>
				: null
			}
		</body>
	</html>

module.exports = DefaultLayout;
