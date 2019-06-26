import './css/module-selector.scss'

import 'whatwg-fetch'

(function() {
	const PROGESS_FAKE_DELAY_MS = 1000
	const SEARCH_DELAY_MS = 250
	const CHANGE_SECTION_FADE_DELAY_MS = 250
	const MAX_ITEMS = 20
	const VERIFY_TIME_SECONDS = 30
	const MESSAGE_LOGOUT = 'You have been logged out. Please refresh the page and try again.'

	let searchIntervalId = -1
	let data = { items: undefined, allItems: undefined, last: 0 }
	let searchStrings = {}
	let selectedItem = null

	// elements:
	let $template = $($('.template.obo-item')[0])
	let $listContainer = $('#list-container')
	let $search = $('#search')
	let section = null

	// searching:
	function search() {
		if (data.items === 'pending') {
			return
		}

		let text = $.trim($search.val())
		if ($search.attr('data-last-search') !== text) {
			let className = section.replace(' ', '-').toLowerCase()
			$('.' + className)
				.children('ul')
				.empty()
			filterList(text)
			populateSection(section)
			$('#list-container').scrollTop(0)
		}
		$search.attr('data-last-search', text)
	}

	function clearSearch() {
		let className = section.replace(' ', '-').toLowerCase()
		$('.' + className)
			.children('ul')
			.empty()
		$('#search').val('')
		data.items = data.allItems
		data.last = 0
		$search.attr('data-last-search', '')
	}

	function getDraftById(draftId) {
		return data.allItems.find(item => {
			return item.draftId == draftId
		})
	}

	function filterList(searchTerms) {
		let $list = $('.' + section.toLowerCase().replace(' ', '-'))
		//$lis = $list.find('.obo-item');
		let items = data.allItems

		if (searchTerms.length === 0) {
			clearSearch()
			return
		}

		let terms = searchTerms.toLowerCase().split(' ')
		let numTerms = terms.length

		let len = items.length
		let item
		let ss
		let numMatches
		let key

		data.items = []

		for (let i = 0; i < len; i++) {
			item = items[i]
			key = item.draftId
			if (typeof searchStrings[key] === 'undefined') {
				searchStrings[key] = (
					(typeof item.title !== 'undefined' ? item.title : 'Untitled') +
					(typeof item.draftId !== 'undefined' ? ' draftId:' + item.draftId : '')
				).toLowerCase()
			}
			ss = searchStrings[key]

			numMatches = 0
			for (let j = 0; j < numTerms; j++) {
				if (ss.indexOf(terms[j]) >= 0) {
					numMatches++
				}
			}
			if (numMatches === numTerms) {
				data.items.push(items[i])
			}
		}

		data.last = 0
	}

	// navigation
	function gotoSection(sectionId, skipFadeAnimation = false, addClass = '') {
		if (sectionId === 'progress') {
			showProgress()
		} else if (sectionId === 'section-success') {
			$('.selected-instance-title').html(window.repreviousResponse.body.name)
			$('.preview-link').attr('href', '/preview/' + window.__previousResponse.body.loID)
		}

		let $shownSection = $('section:not(:hidden)')
		let $newSection = $('#' + sectionId)
		$newSection.removeClass().addClass(addClass)
		if ($shownSection.length === 0) {
			if (skipFadeAnimation) {
				$newSection.show()
			} else {
				$newSection.fadeIn(CHANGE_SECTION_FADE_DELAY_MS)
			}
		} else {
			if (skipFadeAnimation) {
				$shownSection.hide()
				$newSection.show()
			} else {
				$shownSection.fadeOut(CHANGE_SECTION_FADE_DELAY_MS, function() {
					$newSection.fadeIn(CHANGE_SECTION_FADE_DELAY_MS)
				})
			}
		}
	}

	function gotoTab(newSection) {
		section = newSection
		populateList(section)
		$('#section-select-object')
			.removeClass('community-library-section')
			.removeClass('my-objects-section')
			.removeClass('my-instances-section')
	}

	function showProgress() {
		$('#section-progress h1').html(selectedItem.title)
		$('.progressbar').progressbar()
		gotoSection('section-progress')

		setTimeout(() => {
			startProgressBar()
		}, 500)
	}

	function getRandInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	function startProgressBar() {
		// create a random number of progress bar stops
		let availStops = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		let stops = { tick: 0 }
		for (let i = 0, len = getRandInt(3, 5); i < len; i++) {
			stops[availStops.splice(getRandInt(0, availStops.length), 1)] = true
		}

		let intervalId = setInterval(() => {
			stops.tick++
			if (typeof stops[stops.tick] !== 'undefined') {
				$('.progressbar').progressbar('value', stops.tick * 10)
			}
			if (stops.tick >= 10) {
				clearInterval(intervalId)
				finishProgressBarAndSubmit()
			}
		}, 200)

		$(document).on('keyup', event => {
			if (event.keyCode === 16) {
				// shift
				$('.progress-container')
					.find('span')
					.html('Reticulating splines...')
				$(document).off('keyup')
			}
		})
	}

	function finishProgressBarAndSubmit() {
		$('.progress-container').addClass('success')
		$('.progress-container')
			.find('span')
			.html('Success!')
		$('.progressbar').progressbar('value', 100)
		setTimeout(() => {
			let ltiData = buildContentItem(
				selectedItem.title,
				buildLaunchUrl(selectedItem.draftId),
				__isAssignment
			)
			let $form = $('#submit-form')
			$form.find('input[name=content_items]').val(JSON.stringify(ltiData))
			$form.attr('action', __returnUrl)
			$form.submit()
		}, 1000)
	}

	function buildContentItem(title, url, isAssignment = false) {
		let specialTitle = isAssignment ? title : title + " (doesn't send scores to gradebook)"
		return {
			'@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
			'@graph': [
				{
					'@type': 'LtiLinkItem',
					url: url,
					title: specialTitle,
					placementAdvice: {
						presentationDocumentTarget: 'window'
					}
				}
			]
		}
	}

	function buildLaunchUrl(draftId) {
		return window.location.origin + '/view/' + draftId
	}

	// utility
	function hasMoreItems() {
		let d = data
		return d.last < d.items.length
	}

	// list pages
	function appendListItem(lo, $list) {
		let $clone = $template.clone()
		$clone.removeClass('template')
		$clone.find('.title').html(lo.title ? lo.title : 'Untitled')
		$clone.find('.draft-id').html('id: ' + lo.draftId)
		$clone.find('.preview').attr('href', '/preview/' + lo.draftId)
		$clone.attr('data-lo-id', lo.draftId)

		$clone.find('.button').click(onSelectClick)

		$list.append($clone)
		return $clone
	}

	function populateList(section) {
		resetSectionList(section)

		const fetchOptions = { credentials: 'same-origin' }
		$listContainer.find('.section').hide()
		$search.val('')

		let title = ''
		let apiUrl = ''
		let color = ''

		switch (section) {
			default:
			case 'My Modules':
				title = 'Personal Library'
				apiUrl = '/api/drafts'
				color = 'blue'
				break

			case 'Community Library':
				title = 'Community Collection'
				apiUrl = '/api/drafts-public'
				color = 'purple'
				break
		}

		const className = section.replace(' ', '-').toLowerCase()
		$('.' + className).addClass(color)
		$('.my-objects')
			.show()
			.addClass('loading')

		$('#select-section-title').html(title)
		data.items = 'pending'
		fetch(apiUrl, fetchOptions)
			.then(resp => resp.json())
			.then(respJson => {
				if (respJson.status != 'ok') throw 'Failed loading modules'

				data.allItems = data.items = respJson.value
				populateSection(section, title, color)
				$('.my-objects').removeClass('loading')

				if ($search.val() !== '') {
					search()
				}
			})
			.catch(error => {
				handleError(error)
			})
	}

	function populateSection(section) {
		const className = section.replace(' ', '-').toLowerCase()
		const items = data.items
		const lastIndex = Math.min(Math.min(items.length, MAX_ITEMS) + data.last, items.length)
		const $section = $('.' + className)
		const $list = $section.children('ul')

		if (items.length === 0) {
			$section.find('.no-items').show()
		} else {
			$section.find('.no-items').hide()

			let len = lastIndex
			for (let i = data.last; i < len; i++) {
				appendListItem(items[i], $list)
			}

			data.last = lastIndex
		}

		$section.show()
	}

	function showList($list) {
		clearSearch()
		populateSection(section)
		$list.show()
		$listContainer.scrollTop(0)
	}

	function resetSectionList(section){
		let $list = $('.' + section.toLowerCase().replace(' ', '-'))
		data.items = undefined
		data.last = 0
		$list.find('ul').empty()
		$list.find('.no-items').hide()
	}

	// UI:
	function setupUI() {
		$listContainer.find('ul.template').remove()

		$search.keyup(event => {
			clearInterval(searchIntervalId)

			if (event.keyCode === 27) {
				//esc
				clearSearch()
				populateSection(section)
			} else {
				searchIntervalId = setInterval(() => {
					clearInterval(searchIntervalId)
					search()
				}, SEARCH_DELAY_MS)
			}
		})

		$('#list-container').scroll(() => {
			let $this = $(this)
			let $list = $this.find('.' + section.replace(' ', '-').toLowerCase()).children('ul')
			if ($list.height() - $this.scrollTop() <= $this.height()) {
				if (hasMoreItems() && $list.find('.click-to-expand').length === 0) {
					populateSection(section)
				}
			}
		})

		$('#refresh').click(event => {
			event.preventDefault()

			if (typeof data.items !== 'undefined' && data.items !== 'pending') {
				resetSectionList(section)
				populateList(section)
			}
		})

		$('#back-button').click(event => {
			event.preventDefault()
			gotoSection('section-module-selection')
		})

		// section-module-selection
		$('.community-library-button-container').click(event => {
			event.preventDefault();
			gotoSection('section-select-object', false, 'purple');
			gotoTab('Community Library');
		});

		$('.personal-library-button-container').click(event => {
			event.preventDefault()
			gotoSection('section-select-object', false, 'blue')
			gotoTab('My Modules')
		})
	}

	function onSelectClick(event) {
		event.preventDefault()

		let $this = $(this)
		let $oboItem = $this.parent().parent()
		selectedItem = getDraftById($oboItem.attr('data-lo-id'))

		gotoSection('progress')
		$('#instance-name').val($oboItem.find('.title').text())

		if (typeof $oboItem.attr('data-lo-id') === 'undefined' || $oboItem.attr('data-lo-id') === '0') {
			$('.instance-copy-note').hide()
		} else {
			$('.instance-copy-note').show()
		}
	}

	function handleError(result) {
		const isErrorObject = (typeof result !== 'undefined' && typeof result.errorID !== 'undefined')
		if (isErrorObject && result.errorID === 1) {
			killPage(MESSAGE_LOGOUT)
		} else if (isErrorObject) {
			showError(result.errorID)
		} else {
			showError()
		}
	}

	function showError(errorID) {
		gotoSection('dead', true)

		let message = 'Sorry, something went wrong. Please try again.'
		if (typeof errorID !== 'undefined') {
			message += ' (' + errorID + ')'
		}

		$('#error-window p').html(message)
		$('#error-window').dialog({
			modal: true,
			close: () => {
				gotoSection('section-module-selection')
			}
		})
	}

	function killPage(message) {
		gotoSection('dead', true)
		gotoSection = (a, b) => {}

		$('#error-window p').html(message)
		$('#error-window')
			.dialog({
				modal: true,
				closeOnEscape: false
			})
			.parent()
			.find('.ui-button')
			.hide() // remove close button
	}

	// initalize:
	setupUI()
	// gotoSection('section-module-selection')
	gotoSection('section-select-object', false, 'blue')
	gotoTab('My Modules')
})()
