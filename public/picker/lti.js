if (!window.obo) {
	window.obo = {}
}

obo.lti = (function() {
	'use strict'

	var PROGESS_FAKE_DELAY_MS = 1000
	var SEARCH_DELAY_MS = 250
	var CHANGE_SECTION_FADE_DELAY_MS = 250
	var MAX_ITEMS = 20
	var VERIFY_TIME_SECONDS = 30

	var MESSAGE_LOGOUT = 'You have been logged out. Please refresh the page and try again.'

	var searchIntervalId = -1
	var data = { items: undefined, allItems: undefined, last: 0 }
	var searchStrings = {}
	var selectedItem = null

	// elements:
	var $template = $($('.template.obo-item')[0])
	var $listContainer = $('#list-container')
	var $createInstanceForm = $('#create-instance')
	var $search = $('#search')
	var section = 'My Modules'

	// searching:
	function search() {
		if (data.items === 'pending') {
			return
		}

		var text = $.trim($search.val())
		if ($search.attr('data-last-search') !== text) {
			var className = section.replace(' ', '-').toLowerCase()
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
		var className = section.replace(' ', '-').toLowerCase()
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
			return item.drafId == draftId
		})
	}

	function filterList(searchTerms) {
		var $list = $('.' + section.toLowerCase().replace(' ', '-'))
		//$lis = $list.find('.obo-item');
		var items = data.allItems

		if (searchTerms.length === 0) {
			clearSearch()
			return
		}

		var terms = searchTerms.split(' ')
		var numTerms = terms.length

		var len = items.length
		var item
		var ss
		var numMatches
		var key

		data.items = []

		for (var i = 0; i < len; i++) {
			item = items[i]
			key = item.draftId
			if (typeof searchStrings[key] === 'undefined') {
				searchStrings[key] = ((typeof item.title !== 'undefined' ? item.title : 'Untitled') +
					(typeof item.draftId !== 'undefined' ? ' draftId:' + item.draftId : '')
				).toLowerCase()
			}
			ss = searchStrings[key]

			numMatches = 0
			for (var j = 0; j < numTerms; j++) {
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
	function gotoSection(sectionId, skipFadeAnimation) {
		if (sectionId === 'create-instance') {
			showProgress()
		} else if (sectionId === 'success') {
			$('.selected-instance-title').html(window.repreviousResponse.body.name)
			$('.preview-link').attr('href', '/preview/' + window.__previousResponse.body.loID)
		}

		var $shownSection = $('section:not(:hidden)')
		var $newSection = $('#' + sectionId)
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

	function gotoTab(tab) {
		populateList(section)
		$('#select-object')
			.removeClass('community-library-section')
			.removeClass('my-objects-section')
			.removeClass('my-instances-section')
	}

	function showProgress() {
		$('#progress h1').html(selectedItem.title)
		$('.progressbar').progressbar()
		gotoSection('progress')

		setTimeout(function() {
			startProgressBar()
		}, 500)
	}

	function getRandInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	function startProgressBar() {
		// create a random number of progress bar stops
		var availStops = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		var stops = { tick: 0 }
		for (var i = 0, len = getRandInt(3, 5); i < len; i++) {
			stops[availStops.splice(getRandInt(0, availStops.length), 1)] = true
		}

		var intervalId = setInterval(function() {
			stops.tick++
			if (typeof stops[stops.tick] !== 'undefined') {
				$('.progressbar').progressbar('value', stops.tick * 10)
			}
			if (stops.tick >= 10) {
				clearInterval(intervalId)
				finishProgressBarAndSubmit()
			}
		}, 200)

		$(document).on('keyup', function(event) {
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
		setTimeout(function() {
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
		return window.location.protocol + '//' + window.location.host + '/view/' + draftId
	}

	// utility
	function hasMoreItems() {
		var d = data
		return d.last < d.items.length
	}

	// list pages
	function appendListItem(lo, $list) {
		var $clone = $template.clone()
		$clone.removeClass('template')
		$clone.find('.title').html(lo.title ? lo.title : 'Untitled')
		$clone.find('.draft-id').html('id: ' + lo.draftId)
		$clone.find('.preview').attr('href', '/view/' + lo.draftId)
		$clone.attr('data-lo-id', lo.draftId)

		$clone.find('.button').click(onSelectClick)

		$list.append($clone)
		return $clone
	}

	function populateList(section) {
		$listContainer.find('.section').hide()
		$search.val('')

		switch (section) {
			case 'My Modules':
				if (typeof data.items === 'undefined') {
					//$listContainer.addClass('loading');
					$('.my-objects')
						.show()
						.addClass('loading')
					data.items = 'pending'

					fetch('/api/drafts/', { credentials: 'same-origin' })
						.then(resp => resp.json())
						.then(respJson => {
							if (respJson.status != 'ok') throw 'Failed loading drafts'

							data.allItems = data.items = respJson.value
							populateSection(section)
							$('.my-objects').removeClass('loading')

							if ($search.val() !== '') {
								search()
							}
						})
						.catch(error => {
							handleError(error)
						})
				} else {
					showList($('.my-objects'))
				}
				break
		}
	}

	function populateSection(section) {
		var className = section.replace(' ', '-').toLowerCase()
		var items = data.items
		var lastIndex = Math.min(Math.min(items.length, MAX_ITEMS) + data.last, items.length)
		var $section = $('.' + className)
		var $list = $section.children('ul')

		if (items.length === 0) {
			$section.find('.no-items').show()
		} else {
			$section.find('.no-items').hide()

			var len = lastIndex
			for (var i = data.last; i < len; i++) {
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

	// UI:
	function setupUI() {
		$listContainer.find('ul.template').remove()
		$createInstanceForm.remove()

		$search.keyup(function(event) {
			clearInterval(searchIntervalId)

			if (event.keyCode === 27) {
				//esc
				clearSearch()
				populateSection(section)
			} else {
				searchIntervalId = setInterval(function() {
					clearInterval(searchIntervalId)
					search()
				}, SEARCH_DELAY_MS)
			}
		})

		$('#list-container').scroll(function() {
			var $this = $(this)
			var $list = $this.find('.' + section.replace(' ', '-').toLowerCase()).children('ul')
			if ($list.height() - $this.scrollTop() <= $this.height()) {
				if (hasMoreItems() && $list.find('.click-to-expand').length === 0) {
					populateSection(section)
				}
			}
		})

		$('#refresh').click(function(event) {
			event.preventDefault()

			if (typeof data.items !== 'undefined' && data.items !== 'pending') {
				var $list = $('.' + section.toLowerCase().replace(' ', '-'))
				data.items = undefined
				data.last = 0
				$list.find('ul').empty()
				$list.find('.no-items').hide()

				populateList(section)
			}
		})

		$('.back-button').click(function(event) {
			event.preventDefault()
			gotoSection('wizard')
		})

		$('.tab').click(function(event) {
			event.preventDefault()
			var $this = $(this)

			if (!$this.hasClass('selected')) {
				gotoTab($this.text())
			}
		})

		// wizard
		// $('.community-library-button-container').click(function(event) {
		// 	event.preventDefault();
		// 	gotoSection('select-object');
		// 	gotoTab('Community Library');
		// });

		$('.personal-library-button-container').click(function(event) {
			event.preventDefault()
			gotoSection('select-object')
			gotoTab('My Modules')
		})
	}

	function onSelectClick(event) {
		event.preventDefault()

		var $this = $(this)
		var $oboItem = $this.parent().parent()
		selectedItem = getDraftById($oboItem.attr('data-inst-id'))

		gotoSection('create-instance')
		$('#instance-name').val($oboItem.find('.title').text())

		if (
			typeof $oboItem.attr('data-inst-id') === 'undefined' ||
			$oboItem.attr('data-inst-id') === '0'
		) {
			$('.instance-copy-note').hide()
		} else {
			$('.instance-copy-note').show()
		}
	}

	function successfulResponse(response) {
		return (
			typeof response !== 'undefined' &&
			response !== null &&
			typeof response.success !== 'undefined' &&
			response.success === true &&
			typeof response.body === 'object'
		)
	}

	function remotingResultIsError(result) {
		return typeof result !== 'undefined' && typeof result.errorID !== 'undefined'
	}

	function handleError(result) {
		var isErrorObject = remotingResultIsError(result)
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

		var message = 'Sorry, something went wrong. Please try again.'
		if (typeof errorID !== 'undefined') {
			message += ' (' + errorID + ')'
		}

		$('#error-window p').html(message)
		$('#error-window').dialog({
			modal: true,
			close: function() {
				gotoSection('wizard')
			}
		})
	}

	function killPage(message) {
		gotoSection('dead', true)
		gotoSection = function(a, b) {}

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
	gotoSection('wizard')
})()
