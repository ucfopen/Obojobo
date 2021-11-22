const path = require('path')
global.oboRequire = name => require(path.resolve(__dirname, '..', name))

const db = require('obojobo-express/server/db')
const sig = require('oauth-signature')
const config = require('./config')
const oauthKey = Object.keys(config.lti.keys)[0]
const oauthSecret = config.lti.keys[oauthKey]
const { isTrueParam } = require('obojobo-express/server/util/is_true_param')

const User = require('obojobo-express/server/models/user')
const DraftSummary = require('obojobo-repository/server/models/draft_summary')

const POSSIBLE_PERMS = [
	'canViewEditor',
	'canCreateDrafts',
	'canDeleteDrafts',
	'canPreviewDrafts',
	'canViewSystemStats'
]

// Normally the query running in User.saveOrCreate would auto-fill the new user's id,
// but since we're using the user's ID as part of their name and e-mail, we need to know what
// it is going to be ahead of time
const getNewUserId = () => {
	return db
		.oneOrNone('SELECT MAX(id) AS max_id FROM users')
		.then(result => parseInt(result.max_id, 10) + 1)
}

const createNewUser = (id, type) => {
	// If the database is freshly reset, there won't be any users - assume the first id is 1
	if (!id) id = 1
	const capType = type.charAt(0).toUpperCase() + type.slice(1)

	const newUser = new User({
		username: `sis:tst${type}${id}`,
		email: `test_${type}_${id}@obojobo.com`,
		firstName: 'Test',
		lastName: `${capType} ${id}`,
		roles: [capType]
	})

	return newUser.saveOrCreate()
}

const spoofLTIUser = user => ({
	lis_person_contact_email_primary: user.email,
	lis_person_name_family: user.lastName,
	lis_person_name_full: `${user.firstName} ${user.lastName}`,
	lis_person_name_given: user.firstName,
	lis_person_sourcedid: user.username,
	roles: user.roles[0],
	user_id: parseInt(user.id, 10) + 10000,
	user_image: 'https://s.gravatar.com/avatar/17f34572459fa620071cae55d7f1eacb?s=80'
})

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
			<form id="form"
				method="${method}"
				action="${endpoint}">
				${htmlInput}
			</form>
			<script>
				document.getElementById('form').submit()
			</script>
		</body>
	</html>`)
}

// util to get a baseUrl for inernal requests
const baseUrl = req => `${req.protocol}://${req.get('host')}`

module.exports = app => {
	const bodyParser = require('body-parser')
	app.use(bodyParser.json(config.general.bodyParser.jsonOptions))
	app.use(bodyParser.urlencoded(config.general.bodyParser.urlencodedOptions))

	// index page with links to all the launch types
	app.get('/dev/', (req, res) => {
		const usersPromise = db.manyOrNone(
			'SELECT id, first_name, last_name FROM users ORDER BY id ASC'
		)
		const draftsPromise = DraftSummary.fetchAll()

		Promise.all([usersPromise, draftsPromise]).then(results => {
			const users = results[0]
			const drafts = results[1]
			const userOptions = users
				.map(user => `<option value=${user.id}>${user.first_name} ${user.last_name}</option>`)
				.join('')
			const draftOptions = drafts
				.map(draft => `<option value="${draft.draftId}">${draft.title}</option>`)
				.join('')

			let userSelectRender =
				'<p>No users found. Create a student or instructor with the buttons above.</p>'
			if (userOptions && userOptions.length) {
				userSelectRender = `
				<label for='user_id'>Select user:</label>
				<select name='user_id'>
					${userOptions}
				</select>`
			}

			const permOptions = POSSIBLE_PERMS.map(perm => `<option value="${perm}">${perm}</option>`)

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
						const scrollToIframe = () => {
							const iframeEl = document.getElementById('the-iframe')
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
				</head>
				<body>
					<h1>Obojobo Next Express Dev Utils</h1>
					<h2>User Management Tools</h2>
					<ul>
						<li><b>Create new test users:</b>
							<p>Add some inputs here for optional first/last/email etc. with reasonable defaults?</p>
							<ul>
								<li><a href="/dev/util/new_user?type=instructor">Create a new test instructor</a></li>
								<li><a href="/dev/util/new_user?type=learner">Create a new test learner</a></li>
							</ul>
						</li>
						<p>
						Note: The <b>canViewEditor</b>, <b>canCreateDrafts</b>, <b>canDeleteDrafts</b>, and <b>canPreviewDrafts</b> permissions are implicit for instructors.
						</p>
						<li><b>Add permission to user:</b>
							<form id='resource-select-form'
								method='post'
								action='/dev/util/permission'>
								${userSelectRender}
								${
									userOptions.length
										? `<br/>
										<label for='permission'>Select module:</label>
										<select name='permission'>
											${permOptions}
										</select>
										<br/>
										<input type='hidden' name='add_remove' value='add'/>
										<button type='submit' value='submit'>Go</button>`
										: ''
								}
							</form>
						</li>
						<li><b>Add permission to user:</b>
							<form id='resource-select-form'
								method='post'
								action='/dev/util/permission'>
								${userSelectRender}
								${
									userOptions.length
										? `<br/>
										<label for='permission'>Select module:</label>
										<select name='permission'>
											${permOptions}
										</select>
										<br/>
										<input type='hidden' name='add_remove' value='remove'/>
										<button type='submit' value='submit'>Go</button>`
										: ''
								}
							</form>
						</li>
					</ul>
					<h2>LTI Tools</h2>
					<ul>
						<li><a href="/lti">LTI Instructions</a></li>
						<li><b>LTI Course Nav:</b> (simulate LTI launch from clicking on LMS nav menu link)
							<form id='course-nav-form'
								method='post'
								target='_blank'
								action='/lti/dev/launch/course_navigation'>
								<input type='hidden' name='resource_link_id' value='course_1' />
								${userSelectRender}
								${userOptions.length ? "<button type='submit' value='submit'>Go</button>" : ''}
							</form>
						</li>
						<li><b>LTI Resource Selection:</b> (simulate LTI launch for resource/assignment selection)
							<form id='resource-select-form'
								method='get'
								action='/lti/dev/launch/resource_selection'
								target='the-iframe'>
								${userSelectRender}
								${
									userOptions.length
										? `<button onClick="scrollToIframe()" type='submit' value='submit'>Go</button>`
										: ''
								}
							</form>
						</li>
						<li><b>LTI Assignment:</b> (simulate LTI launch for an assignment)
							<form id='resource-select-form'
								method='get'
								action='/lti/dev/launch/view'
								target='_blank'>
								${userSelectRender}
								${
									userOptions.length
										? `<br/>
										<label for='draft_id'>Select module:</label>
										<select name='draft_id'>
											${draftOptions}
										</select>
										<br/>
										<label for='import_enabled'>Score import enabled:</label>
										<input type='checkbox' name='import_enabled' />
										<br/>
										<label for='resource_link_id'>LMS course ID:</label>
										<input type='text' name='resource_link_id' placeholder="course_1"/>
										<br/>
										<button type='submit' value='submit'>Go</button>`
										: ''
								}
							</form>
						</li>
					</ul>
					<h2>Build Tools</h2>
					<ul>
						<li><a href="/routes">Express Routes</a></li>
						<li><a href="/webpack-dev-server">Webpack Dev Server Assets</a></li>
					</ul>
					<h2>Iframe for simulating assignment selection overlay</h2>
					<iframe id="the-iframe" name="the-iframe"></iframe>
				</body>
			</html>`)
		})
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

	app.post('/lti/dev/launch/course_navigation', (req, res) => {
		// const resource_link_id = req.query.resource_link_id || defaultResourceLinkId
		// const instructorOneOrTwo = req.query.instructor === '2' ? ltiInstructor2 : ltiInstructor
		User.fetchById(req.body.user_id).then(user => {
			const resource_link_id = req.body.resource_link_id || defaultResourceLinkId
			const person = spoofLTIUser(user)
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
				'POST',
				`${baseUrl(req)}/lti/canvas/course_navigation`,
				res
			)
		})
	})

	// builds a valid document view lti launch and submits it
	app.get('/lti/dev/launch/view', (req, res) => {
		User.fetchById(req.query.user_id).then(user => {
			const resource_link_id = req.query.resource_link_id || defaultResourceLinkId
			const draftId = req.query.draft_id || '00000000-0000-0000-0000-000000000000'
			const params = {
				lis_outcome_service_url: 'https://example.fake/outcomes/fake',
				lti_message_type: 'basic-lti-launch-request',
				lti_version: 'LTI-1p0',
				resource_link_id,
				score_import: isTrueParam(req.query.score_import) ? 'true' : 'false'
			}
			renderLtiLaunch(
				{ ...ltiContext, ...user, ...params },
				'POST',
				`${baseUrl(req)}/view/${draftId}`,
				res
			)
		})
	})

	// builds a valid resourse selection lti launch and submits it
	app.get('/lti/dev/launch/resource_selection', (req, res) => {
		User.fetchById(req.query.user_id).then(user => {
			const person = spoofLTIUser(user)
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
				'POST',
				`${baseUrl(req)}/lti/canvas/resource_selection`,
				res
			)
		})
	})

	// route that resource selections will return to
	app.post('/lti/dev/return/resource_selection', (req, res) => {
		const data = JSON.parse(req.body.content_items)
		res.set('Content-Type', 'text/html')
		res.send(`<html>
			<body>
				<h1>Resource selected!</h1>
				<ul>
					<li>URL: ${req.originalUrl}</li>
					<li>lti_message_type: ${req.body.lti_message_type}</li>
					<li>Type: ${data['@graph'][0]['@type']}</li>
					<li>URL: ${data['@graph'][0].url}</li>
					<li>Title: ${data['@graph'][0].title}</li>
					<li>Data: ${req.body.data}</li>
				</ul>
				<code>${req.body.content_items}</code>
			</body>
		</html>`)
	})

	app.get('/dev/util/new_user', (req, res) => {
		getNewUserId().then(newId => {
			createNewUser(newId, req.query.type).then(() => {
				res.redirect('/dev')
			})
		})
	})

	app.post('/dev/util/permission', (req, res) => {
		const userId = req.body.user_id
		const op = req.body.add_remove

		db.oneOrNone('SELECT perms FROM user_perms WHERE user_id = $[userId]', { userId })
			.then(existing => {
				// selected user has no explicitly set permissions
				if (!existing) {
					existing = { perms: [] }
				}

				const perms = [...existing.perms]
				const existingPermIndex = perms.indexOf(req.body.permission)

				// either trying to add a permissions the user has already, or remove one it doesn't have yet
				if (
					(op === 'add' && existingPermIndex >= 0) ||
					(op === 'remove' && existingPermIndex < 0)
				) {
					// do nothing
					return false
				}

				switch (req.body.add_remove) {
					case 'add':
						perms.push(req.body.permission)
						break
					case 'remove':
					default:
						perms.splice(existingPermIndex, 1)
						break
				}

				return perms
			})
			.then(perms => {
				if (!perms) return

				return db.none(
					`
				INSERT INTO user_perms
				VALUES ($[userId], $[perms])
				ON CONFLICT (user_id)
				DO UPDATE
					SET perms = $[perms]
					WHERE user_perms.user_id = $[userId]
				`,
					{ userId, perms }
				)
			})
			.then(() => {
				res.redirect('/dev')
			})
	})
}
