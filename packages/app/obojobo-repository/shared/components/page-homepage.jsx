require('./page-homepage.scss')

const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './repository-nav'

const title = 'Obojobo™ Next - Next Generation Course Content for your LMS'
const currentYear = new Date().getFullYear()

const PageHomepage = props =>
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
			<h1>The Future of Course Content</h1>
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
					<p>
						Every paragraph in ObojoboNext is delivered by individual modular plugins. Examples include images, math equations, questions, widgets, and videos. This modularity means ObojoboNext is poised to deliver the next big thing.
					</p>
				</div>
			</section>

			<section id="step-3" className="step step-3">
				<div className="step-items-container">
					<h1>Datalicious.</h1>
					<h2>Gain insights, perform research</h2>
					<p>
						We started on day one enabling our users to build research studies that were previously impossible.
					</p>

					<p>
						The power to create new types of learning modules combined with standardized <a href="http://www.imsglobal.org/activity/caliper">Caliper</a> events gives you access to all the data you can handle.
					</p>
				</div>
			</section>

			<section id="step-4" className="step step-4">
				<div className="step-items-container">
					<h1>LMS Integrated.</h1>
					<p>
						ObojoboNext integrates with Instructure's Canvas so you can use all the power of ObojoboNext right in the LMS you and your students already know.
					</p>
				</div>
			</section>

			<section id="step-6" className="step step-6">
				<div className="step-items-container">
					<h1>Open Source First.</h1>
					<p>
						Install it, cusomize it, update it. Let's build the future of learning together.
					</p>
					<p><a href="https://github.com/ucfopen/Obojobo">Join us on Github</a>!</p>
				</div>
			</section>

		</div>
	</DefaultLayout>

module.exports = PageHomepage
