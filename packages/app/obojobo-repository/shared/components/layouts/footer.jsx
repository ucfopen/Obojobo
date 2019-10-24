require('./footer.scss')

const React = require('react');
const currentYear = new Date().getFullYear()

const Footer = () =>
	<footer>
		<div className="ucf-open-footer">
			<div className="ucf-open-image">
				<a href="https://ucfopen.github.io">
					<div className="ucf-open-logo">UCF Open</div>
				</a>
			</div>
			<div className="ucf-open-desc">Obojobo is a UCF open source project.</div>
			<div className="ucf-open-links">
				<a href="https://ucfopen.github.io/Obojobo-Docs/">Documentation</a>
				<a href="https://github.com/ucfopen/Obojobo">Obojobo on Github</a>
				<a href="https://ucfopen.github.io">About UCF Open</a>
			</div>
		</div>

		<div className="copyright">
			<span className="copy">&copy; <span id="copyright-date">{ currentYear }</span> <a href="https://ucf.edu">University of Central Florida</a></span>
		</div>
	</footer>

module.exports = React.memo(Footer)
