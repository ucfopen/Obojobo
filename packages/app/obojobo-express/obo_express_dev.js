const express = require('express')
const sig = require("oauth-signature")
const ltiConfig = require('./config/lti.json')
const oauthKey = Object.keys(ltiConfig.development.keys)[0]
const oauthSecret = ltiConfig.development.keys[oauthKey]

const buildLaunchHTML = (paramsIn, method, endpoint, res) =>{
	const oauthParams = {
		oauth_nonce: Math.round((new Date()).getTime() / 1000.0),
		oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
		oauth_callback: "about:blank",
		oauth_consumer_key: oauthKey,
		oauth_signature_method: "HMAC-SHA1",
		oauth_version: "1.0",
	}
	const params = {...paramsIn, ...oauthParams}
	const hmac_sha1 = sig.generate(method, endpoint, params, oauthSecret, '', { encodeSignature: false})
	params['oauth_signature'] = hmac_sha1
	keys = Object.keys(params)
	const formString = keys.map(key => `<input type="hidden" name="${key}" value="${params[key]}"/><br/>`).join('')

	res.set('Content-Type', 'text/html');
	res.send(`<html>
		<body>
		<form id="form" method="${method}" action="${endpoint}" >
			${formString}
		</form>
		<script>document.getElementById('form').submit()</script>
		</body></html>`)
}

module.exports = (app) => {
	var bodyParser = require('body-parser')
	// create application/json parser
	app.use(bodyParser.json());
	// create application/x-www-form-urlencoded parser
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/lti/dev', (req, res) => {
		res.set('Content-Type', 'text/html');
		res.send(`<html><body>
			<ul>
				<li><a href="/lti/dev/launch/course_navigation">Course Nav</a></li>
				<li><a href="/lti/dev/launch/resource_selection">Resource Selection</a></li>
				<li><a href="/lti/dev/launch/view">View</a></li>
				<li><a href="/profile/logout">Logout</a></li>
			</ul>
			</body></html>`)
	})

	app.get('/lti/dev/launch/course_navigation', (req, res) => {
		const method = "POST"
		const endpoint = "https://127.0.0.1:8080/lti/canvas/course_navigation"
		const params = {
			context_id: "S3294476",
			context_label: "ST101",
			context_title: "Telecommuncations 101",
			context_type: "CourseSection",
			launch_presentation_css_url: "http://lti.tools/saltire/css/tc.css",
			launch_presentation_document_target: "frame",
			launch_presentation_locale: "en-GB",
			launch_presentation_return_url: "http://lti.tools/saltire/tc-return.php",
			lis_course_offering_sourcedid: "DD-ST101",
			lis_course_section_sourcedid: "DD-ST101:C1",
			lis_outcome_service_url: "http://lti.tools/saltire/tc-outcomes.php/6rd5e8jmvf4tlpgndtg0f2dcl7",
			lis_person_contact_email_primary: "jbaird@uni.ac.uk",
			lis_person_name_family: "Baird",
			lis_person_name_full: "John Logie Baird",
			lis_person_name_given: "John",
			lis_person_sourcedid: "sis:942a8dd9",
			lis_result_sourcedid: "UzMyOTQ0NzY6Ojo0Mjk3ODUyMjY6OjoyOTEyMw==",
			lti_message_type: "basic-lti-launch-request",
			lti_version: "LTI-1p0",
			resource_link_id: "429785226",
			resource_link_title: "Phone home",
			roles: "Instructor",
			tool_consumer_info_product_family_code: "jisc",
			tool_consumer_instance_guid: "vle.uni.ac.uk",
			tool_consumer_instance_name: "University of Central Florida",
			user_id: "29123",
		}
		buildLaunchHTML(params, method, endpoint, res)
	});

	app.get('/lti/dev/launch/view', (req, res) => {
		const method = "POST"
		const endpoint = "https://127.0.0.1:8080/view/00000000-0000-0000-0000-000000000000"
		const params = {
			custom_context_memberships_url: "http://lti.tools/saltire/tc-membership.php/context/6rd5e8jmvf4tlpgndtg0f2dcl7",
			custom_context_setting_url: "http://lti.tools/saltire/tc-settings.php/context/6rd5e8jmvf4tlpgndtg0f2dcl7",
			custom_link_setting_url: "http://lti.tools/saltire/tc-settings.php/link/6rd5e8jmvf4tlpgndtg0f2dcl7",
			custom_system_setting_url: "http://lti.tools/saltire/tc-settings.php/system/6rd5e8jmvf4tlpgndtg0f2dcl7",
			custom_tc_profile_url: "http://lti.tools/saltire/tc-profile.php/6rd5e8jmvf4tlpgndtg0f2dcl7",
			lis_outcome_service_url: "http://lti.tools/saltire/tc-outcomes.php/6rd5e8jmvf4tlpgndtg0f2dcl7",
			lis_person_contact_email_primary: "jbaird@uni.ac.uk",
			lis_person_name_family: "Baird",
			lis_person_name_full: "John Logie Baird",
			lis_person_name_given: "John",
			lis_person_sourcedid: "sis:942a8dd9",
			lis_result_sourcedid: "Ojo6NDI5Nzg1MjI2Ojo6MjkxMjM=",
			lti_message_type: "basic-lti-launch-request",
			lti_version: "LTI-1p0",
			resource_link_id: "429785226",
			roles: "Instructor",
			user_id: "29123",
			user_image: "http://lti.tools/saltire/images/lti.gif",
		}
		buildLaunchHTML(params, method, endpoint, res)
	})

	app.get('/lti/dev/launch/resource_selection', (req, res) => {
		const method = "POST"
		const endpoint = "https://127.0.0.1:8080/lti/canvas/resource_selection"
		const params = {
			accept_copy_advice: "false",
			accept_media_types: "*/*",
			accept_multiple: "false",
			accept_presentation_document_targets: "embed,frame,iframe,window,popup,overlay,none",
			accept_unsigned: "false",
			auto_create: "true",
			can_confirm: "false",
			content_item_return_url: "https://127.0.0.1:8080/lti/dev/return/resource_selection",
			context_id: "S3294476",
			context_type: "CourseSection",
			launch_presentation_css_url: "http://lti.tools/saltire/css/tc.css",
			launch_presentation_locale: "en-GB",
			lis_person_contact_email_primary: "jbaird@uni.ac.uk",
			lis_person_name_family: "Baird",
			lis_person_name_full: "John Logie Baird",
			lis_person_name_given: "John",
			lis_person_sourcedid: "sis:942a8dd9",
			lti_message_type: "ContentItemSelectionRequest",
			lti_version: "LTI-1p0",
			roles: "Instructor",
			tool_consumer_instance_guid: "vle.uni.ac.uk",
			tool_consumer_instance_url: "https://vle.uni.ac.uk/",
			user_id: "29123",
			user_image: "http://lti.tools/saltire/images/lti.gif",
		}
		buildLaunchHTML(params, method, endpoint, res)
	})

	app.post('/lti/dev/return/resource_selection', (req, res) => {
		const data = JSON.parse(req.body.content_items)
		res.set('Content-Type', 'text/html');
		res.send(`<html><body><h1>Resource selected!</h1>
			<ul>
			<li>lti_message_type: ${req.body.lti_message_type}</li>
			<li>Type: ${data["@graph"][0]["@type"]}</li>
			<li>URL: ${data["@graph"][0].url}</li>
			<li>Title: ${data["@graph"][0].title}</li>
			</ul>
			<code>${req.body.content_items}</code></body></html>`)
	})
}

