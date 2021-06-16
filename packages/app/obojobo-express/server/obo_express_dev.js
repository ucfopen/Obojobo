const sig = require('oauth-signature')
const config = require('./config')
const oauthKey = Object.keys(config.lti.keys)[0]
const oauthSecret = config.lti.keys[oauthKey]
const { isTrueParam } = require('obojobo-express/server/util/is_true_param')

const ltiInstructor = {
	lis_person_contact_email_primary: 'zach@obojobo.com',
	lis_person_name_family: 'Instructor1',
	lis_person_name_full: 'Test Instructor1',
	lis_person_name_given: 'Test',
	lis_person_sourcedid: 'sis:tstinstructor1',
	roles: 'Instructor',
	user_id: '29129',
	user_image: 'https://s.gravatar.com/avatar/17f34572459fa620071cae55d7f1eacb?s=80'
}

const ltiInstructor2 = {
	lis_person_contact_email_primary: 'frankie@obojobo.com',
	lis_person_name_family: 'Instructor2',
	lis_person_name_full: 'Test Instructor2',
	lis_person_name_given: 'Test',
	lis_person_sourcedid: 'sis:tstinstructor2',
	roles: 'Instructor',
	user_id: '234111',
	user_image: 'https://s.gravatar.com/avatar/17f34572459fa620071cae55d7f1eacb?s=80'
}

const ltiLearner = {
	lis_person_contact_email_primary: 'ian@obojobo.com',
	lis_person_name_family: 'Learner1',
	lis_person_name_full: 'Test Learner1',
	lis_person_name_given: 'Test',
	lis_person_sourcedid: 'sis:tstlearner1',
	roles: 'Learner',
	user_id: '29111',
	user_image: 'https://s.gravatar.com/avatar/17f34572459fa620071cae55d7f1eacb?s=80'
}

const ltiToolConsumer = {
	tool_consumer_info_product_family_code: 'obojobo-next',
	tool_consumer_instance_guid: 'obojobo.ucf.edu',
	tool_consumer_instance_name: 'University of Central Florida',
	tool_consumer_instance_url: 'https://obojobo.ucf.edu/'
}

const ltiContext = {
	context_id: 'S3294476',
	context_label: 'OBO4321',
	context_title: 'Obojobo Local Dev 101',
	context_type: 'CourseSection'
}

const defaultResourceLinkId = 'obojobo-dev-resource-id'

// constructs a signed lti request and sends it.
const renderLtiLaunch = (paramsIn, method, endpoint, res) => {
	// add the required oauth params to the given prams
	const oauthParams = {
		oauth_nonce: Math.round(new Date().getTime()),
		oauth_timestamp: Math.round(new Date().getTime() / 1000.0),
		oauth_callback: 'about:blank',
		oauth_consumer_key: oauthKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0'
	}
	const params = { ...paramsIn, ...oauthParams }
	const hmac_sha1 = sig.generate(method, endpoint, params, oauthSecret, '', {
		encodeSignature: false
	})
	params['oauth_signature'] = hmac_sha1
	const keys = Object.keys(params)
	const htmlInput = keys
		.map(key => `<input type="hidden" name="${key}" value="${params[key]}"/><br/>`)
		.join('')

	res.set('Content-Type', 'text/html')
	res.send(`<html>
		<body>
		<form id="form" method="${method}" action="${endpoint}" >${htmlInput}</form>
		<script>document.getElementById('form').submit()</script>
		</body></html>`)
}

// util to get a baseUrl for inernal requests
const baseUrl = req => `${req.protocol}://${req.get('host')}`

module.exports = app => {
	const bodyParser = require('body-parser')
	app.use(bodyParser.json(config.general.bodyParser.jsonOptions))
	app.use(bodyParser.urlencoded(config.general.bodyParser.urlencodedOptions))

	// index page with links to all the launch types
	app.get('/dev', (req, res) => {
		res.set('Content-Type', 'text/html')
		res.send(`<html>
			<head>
			<title>Obojobo Next Express Dev Utils</title>
			<script>
				const launchInIframe = url => {
					const iframeEl = document.getElementById('the-iframe')
					iframeEl.src = url
					iframeEl.scrollIntoView()
				}
			</script>
			<style>
				iframe{
					width: 620px;
					height: 475px;
					resize: both;
					overflow: auto;
				}
			</style>
			</head><body>
			<h1>Obojobo Next Express Dev Utils</h1>
			<h2>LTI Tools</h2>
			<ul>
				<li><a href="/lti">LTI Instructions</a></li>
				<li><b>LTI Course Nav:</b> (simulate LTI launch from clicking on LMS nav menu link)
					<ul>
						<li><a href="/lti/dev/launch/course_navigation?resource_link_id=course_1">Instructor</a></li>
						<li><a href="/lti/dev/launch/course_navigation?resource_link_id=course_1&instructor=2">Instructor2</a></li>
						<li><a href="/lti/dev/launch/course_navigation?resource_link_id=course_1&student=1">Student</a></li>
					</ul>
				</li>
				<li><b>LTI Resource Selection:</b> (simulate LTI launch for resource/assignment selection)
					<ul>
						<li><a href="#" onClick="launchInIframe('/lti/dev/launch/resource_selection')">Instructor</a></li>
						<li><a href="#" onClick="launchInIframe('/lti/dev/launch/resource_selection?instructor=2')">Instructor2</a></li>
						<li><a href="#" onClick="launchInIframe('/lti/dev/launch/resource_selection?student=1')">Student</a></li>
					</ul>
				</li>
				<li><b>LTI Assignment:</b> (simulate LTI launch for an assignment)
					<ul>
						<li><a href="/lti/dev/launch/view?resource_link_id=course_1">Instructor for course_1</a></li>
						<li><a href="/lti/dev/launch/view?resource_link_id=course_1&student=1">Student for course_1</a></li>
						<li><a href="/lti/dev/launch/view?resource_link_id=course_2&student=1">Student for course_2</a></li>
						<li><a href="/lti/dev/launch/view?resource_link_id=course_2&student=1&score_import=1">Student for course_2 w/ import enabled</a></li>
					</ul>
				</li>
			</ul>
			<h2>Build Tools</h2>
			<ul>
				<li><a href="/routes">Express Routes</a></li>
				<li><a href="/webpack-dev-server">Webpack Dev Server Assets</a></li>
			</ul>
			<h2>Iframe for simulating assignment selection overlay</h2>
			<iframe id="the-iframe"></iframe>
			</body></html>`)
	})

	// json list of every express.js route
	app.get('/routes', (req, res) => {
		const listEndpoints = require('express-list-endpoints')
		const foundPaths = new Set()
		const simplifiedEndpoints = listEndpoints(app)
			// remove express's * path
			.filter(i => i.path !== '*')
			// filter any duplicat paths
			.filter(i => {
				if (foundPaths.has(i.path)) return false
				foundPaths.add(i.path)
				return true
			})
			// sort the remaining paths
			.sort((a, b) => a.path.localeCompare(b.path))

		res.json(simplifiedEndpoints)
	})

	// builds a valid course navigation lti launch and submits it
	app.get('/lti/dev/launch/course_navigation', (req, res) => {
		const resource_link_id = req.query.resource_link_id || defaultResourceLinkId
		const instructorOneOrTwo = req.query.instructor === '2' ? ltiInstructor2 : ltiInstructor
		const person = req.query.student ? ltiLearner : instructorOneOrTwo
		const method = 'POST'
		const endpoint = `${baseUrl(req)}/lti/canvas/course_navigation`
		const params = {
			launch_presentation_css_url: 'https://example.fake/nope.css',
			launch_presentation_document_target: 'frame',
			launch_presentation_locale: 'en-US',
			launch_presentation_return_url: 'https://example.fake/fake-return.html',
			lis_course_offering_sourcedid: 'DD-ST101',
			lis_course_section_sourcedid: 'DD-ST101:C1',
			lis_outcome_service_url: 'https://example.fake/outcomes/fake',
			lis_result_sourcedid: 'UzMyOTQ0NzY6Ojo0Mjk3ODUyMjY6OjoyOTEyMw==',
			lti_message_type: 'basic-lti-launch-request',
			lti_version: 'LTI-1p0',
			resource_link_id,
			resource_link_title: 'Phone home'
		}
		renderLtiLaunch(
			{ ...ltiContext, ...person, ...ltiToolConsumer, ...params },
			method,
			endpoint,
			res
		)
	})

	// builds a valid document view lti launch and submits it
	app.get('/lti/dev/launch/view', (req, res) => {
		const resource_link_id = req.query.resource_link_id || defaultResourceLinkId
		const draftId = req.query.draft_id || '00000000-0000-0000-0000-000000000000'
		const person = req.query.student ? ltiLearner : ltiInstructor
		const method = 'POST'
		const endpoint = `${baseUrl(req)}/view/${draftId}`
		const params = {
			lis_outcome_service_url: 'https://example.fake/outcomes/fake',
			lti_message_type: 'basic-lti-launch-request',
			lti_version: 'LTI-1p0',
			resource_link_id,
			score_import: isTrueParam(req.query.score_import) ? 'true' : 'false'
		}
		renderLtiLaunch({ ...ltiContext, ...person, ...params }, method, endpoint, res)
	})

	// builds a valid resourse selection lti launch and submits it
	app.get('/lti/dev/launch/resource_selection', (req, res) => {
		const method = 'POST'
		const person = req.query.student ? ltiLearner : ltiInstructor
		const endpoint = `${baseUrl(req)}/lti/canvas/resource_selection`
		const params = {
			accept_copy_advice: 'false',
			accept_media_types: '*/*',
			accept_multiple: 'false',
			accept_presentation_document_targets: 'embed,frame,iframe,window,popup,overlay,none',
			accept_unsigned: 'false',
			auto_create: 'true',
			can_confirm: 'false',
			content_item_return_url: `${baseUrl(
				req
			)}/lti/dev/return/resource_selection?test=this%20is%20a%20test`,
			launch_presentation_css_url: 'https://example.fake/nope.css',
			launch_presentation_locale: 'en-US',
			lti_message_type: 'ContentItemSelectionRequest',
			lti_version: 'LTI-1p0',
			data: "this opaque 'data' should be sent back to the LMS!"
		}
		renderLtiLaunch(
			{ ...ltiContext, ...person, ...ltiToolConsumer, ...params },
			method,
			endpoint,
			res
		)
	})

	// route that resource selections will return to
	app.post('/lti/dev/return/resource_selection', (req, res) => {
		const data = JSON.parse(req.body.content_items)
		res.set('Content-Type', 'text/html')
		res.send(`<html><body><h1>Resource selected!</h1>
			<ul>
			<li>URL: ${req.originalUrl}</li>
			<li>lti_message_type: ${req.body.lti_message_type}</li>
			<li>Type: ${data['@graph'][0]['@type']}</li>
			<li>URL: ${data['@graph'][0].url}</li>
			<li>Title: ${data['@graph'][0].title}</li>
			<li>Data: ${req.body.data}</li>
			</ul>
			<code>${req.body.content_items}</code>
			</body></html>`)
	})
}
