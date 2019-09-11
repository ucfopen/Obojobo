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
					<div className="ucf-open-desc">Obojobo is a UCF Open Source project.</div>
					<div className="ucf-open-links">
						<a href="https://ucfopen.github.io">About UCFOpen</a>
						<a href="https://github.com/ucfopen">UCFOpen on Github</a>
						<a href="https://github.com/ucfopen/Obojobo">Obojobo&trade; on Github</a>
					</div>
				</div>

				<div className="copyright">
					<span className="copy">&copy; <span id="copyright-date">{ currentYear }</span> University of Central Florida</span>
				</div>
			</footer>

module.exports = Footer
