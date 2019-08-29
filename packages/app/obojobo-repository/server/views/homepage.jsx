require('./homepage.scss')

const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'

const title = 'Obojobo&trade;Next - Next Generation Course Content for your LMS'
const currentYear = new Date().getFullYear()

const Homepage = props =>
	<DefaultLayout title={title} appCSSUrl="/static/homepage.css" className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
			/>

		<section className="hero">
			<div className="computers">
				<div className="ipad"></div>
			</div>
			<h1>Next Generation Course Content</h1>
		</section>

		<div id="content" className="content">

			<section id="step-1" className="step step-1">
				<div className="step-items-container">
					<h1>Flexible & Adaptable.</h1>
					<h2>Build the course you want.</h2>
					<p>
						You'll be able to do things like embed practice in content, use your assessment question bank as a pretest, and control access to pages based on conditions in your module.
					</p>
				</div>
			</section>

			<section id="step-2" className="step step-2">
				<div className="step-items-container">
					<h1>Built for the Future.</h1>
					<h2>Stay on the leading edge.</h2>
					<p>
						Every paragraph in Obojobo&trade;Next is delivered by a modular plugin-like library. Things like images, math equations, practice questions, widgets, videos, etc are availible now. This means Obojobo&trade;Next is a future-proof architecture that will deliver the next big things when they arrive.
					</p>
				</div>
			</section>

			<section id="step-3" className="step step-3">
				<div className="step-items-container">
					<h1>Datalicious.</h1>
					<h2>Gain insights, perform research</h2>
					<p>
						We started from day one enabling our users to build research studies that were previously not possible.
					</p>

					<p>
						With the power to create new types of learning modules combined with robust standardized events, you've got access to all the data you can handle.
					</p>
				</div>
			</section>

			<section id="step-4" className="step step-4">
				<div className="step-items-container">
					<h1>Integrated by Default.</h1>
					<h2>ObojoboNext is designed for your LMS.</h2>
					<p>
						We integrate with Instructure's Canvas so you can use all the power of ObojoboNext right in the LMS you and your students are comfortable with.
					</p>
				</div>
			</section>

			<section id="step-6" className="step step-6">
				<div className="step-items-container">
					<h1>Open Source First.</h1>
					<h2>Afterall, we're all in this together.</h2>
					<p>
						Teaching and learning are the critical path to a better tomorrow.  A tomorrow we can all contribute to. Check out <a href="https://github.com/ucfopen/Obojobo">Obojobo&trade; on Github</a>!
					</p>
				</div>
			</section>

		</div>

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

	</DefaultLayout>

module.exports = Homepage
