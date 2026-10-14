import '../css/module-selector.scss'
;(function() {
	// settings set by the view
	const SETTINGS_IS_ASSIGNMENT = __isAssignment // eslint-disable-line no-undef
	const TAB_COMMUNITY = 'Community Library'
	const TAB_PERSONAL = 'My Modules'
	const SECTION_EMBED_TYPE_SELECT = 'section-embed-type-selection'
	const SECTION_MODULE_SELECT = 'section-module-selection'
	const SECTION_SELECT_OBJECT = 'section-select-object'
	const SECTION_PROGRESS = 'section-progress'
	const SECTION_EMBED_OPTIONS = 'section-options'
	const SECTION_PRE_PROGRESS = 'section-pre-progress'
	const SEARCH_DELAY_MS = 250
	const CHANGE_SECTION_FADE_DELAY_MS = 250
	const MAX_ITEMS = 20
	const MESSAGE_LOGOUT = 'You have been logged out. Please refresh the page and try again.'
	const MAX_SPLIT_RUN_OPTION_LENGTH = 2
	const searchStrings = {}
	const itemTemplateEl = document.querySelectorAll('.template.obo-item')[0]
	const listContainerEl = document.getElementById('list-container')
	const searchEl = document.getElementById('search')
	const progressBarEL = document.getElementById('progressbar')
	const progressBarValueEl = progressBarEL.querySelector('.ui-progressbar-value')
	const progressBarContainerEl = document.querySelector('.progress-container')
	const data = {
		items: undefined, // eslint-disable-line no-undefined
		allItems: undefined, // eslint-disable-line no-undefined
		last: 0
	}
	let searchIntervalId = -1
	let section = null
	let selectedItem = null
	let allowScorePassback
	let sectionState = null

	// control whether the embed is for a single module or a split-run scenario
	// in the split-run scenario, two modules will need to be selected prior to
	//  the completion of the embed
	// assume true for convenience
	let embeddingSingleModule = true
	let splitRunSelected = []

	function empty(el) {
		while (el.firstChild) el.removeChild(el.firstChild)
	}

	function hide(el) {
		el.style.display = 'none'
		el.style.opacity = 1
	}

	function show(el) {
		el.style.display = 'block'
		el.style.opacity = 1
	}

	function fadeOut(el) {
		el.style.opacity = 1
		;(function fade() {
			if ((el.style.opacity -= 0.1) < 0) {
				el.style.display = 'none'
			} else {
				window.requestAnimationFrame(fade)
			}
		})()
	}

	function sectionClassName(string) {
		return '.' + string.replace(' ', '-').toLowerCase()
	}

	function fadeIn(el, delay) {
		if (delay) {
			setTimeout(() => {
				fadeIn(el)
			}, delay)
			return
		}

		el.style.opacity = 0
		el.style.display = 'block'
		;(function fade() {
			let val = parseFloat(el.style.opacity)
			if (!((val += 0.1) > 1)) {
				el.style.opacity = val
				window.requestAnimationFrame(fade)
			}
		})()
	}

	function search() {
		if (data.items === 'pending') {
			return
		}

		const text = searchEl.value.trim()
		if (searchEl.getAttribute('data-last-search') !== text) {
			const ul = document.querySelector(sectionClassName(section) + ' ul')
			empty(ul)
			filterModules(text)
			populateSection(section)
			listContainerEl.scrollTop = 0
		}
		searchEl.setAttribute('data-last-search', text)
	}

	function clearSearch() {
		const className = sectionClassName(section)
		const ul = document.querySelector(className + ' ul')
		empty(ul)
		searchEl.value = ''
		data.items = data.allItems
		data.last = 0
		searchEl.setAttribute('data-last-search', '')
	}

	function getDraftById(draftId) {
		return data.allItems.find(item => {
			return item.draftId === draftId
		})
	}

	function getMemoizedSearchStringForDraft(draft) {
		const key = draft.draftId
		if (!searchStrings[key]) {
			searchStrings[key] = `${draft.title || 'untitled'} ${draft.draftId}`.toLowerCase()
		}
		return searchStrings[key]
	}

	function filterModules(searchTerms) {
		const items = data.allItems

		if (searchTerms.length === 0) {
			clearSearch()
			return
		}

		const terms = searchTerms.toLowerCase().split(' ')

		data.items = []

		items.forEach(item => {
			const search = getMemoizedSearchStringForDraft(item)

			// locate any searchterms in the draft search strings
			if (terms.find(term => search.indexOf(term) >= 0)) {
				data.items.push(item)
			}
		})

		data.last = 0
	}

	// navigation
	function gotoSection(sectionId, skipFadeAnimation = false, addClass = '') {
		if (sectionId === SECTION_PRE_PROGRESS) {
			showProgress()
			return
		}

		const shownSectionEl = document.querySelectorAll('section[style*="display: block"]')
		const newSectionEl = document.getElementById(sectionId)
		newSectionEl.className = ''
		if (addClass) newSectionEl.classList.add(addClass)
		if (shownSectionEl.length === 0) {
			if (skipFadeAnimation) {
				show(newSectionEl)
			} else {
				fadeIn(newSectionEl)
			}
		} else if (skipFadeAnimation) {
			shownSectionEl.forEach(s => {
				hide(s)
			})
			show(newSectionEl)
		} else {
			shownSectionEl.forEach(s => {
				fadeOut(s)
			})
			fadeIn(newSectionEl, CHANGE_SECTION_FADE_DELAY_MS)
		}

		// for every section EXCEPT the option selection page, keep track of the args
		//  so we can 'cancel' back to the correct state
		if (sectionId !== SECTION_EMBED_OPTIONS) {
			sectionState = {
				sectionId,
				skipFadeAnimation,
				addClass
			}
		}
	}

	function gotoTab(newSection) {
		section = newSection
		populateList(section)
	}

	function showProgress() {
		const titleEl = document.querySelector('#section-progress h1')
		titleEl.innerHTML = selectedItem.title
		progressBarValueEl.style.width = '10%'
		gotoSection(SECTION_PROGRESS)

		setTimeout(() => {
			startProgressBar()
		}, 500)
	}

	function getRandInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	function startProgressBar() {
		// create a random number of progress bar stops
		const availStops = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		const stops = { tick: 0 }
		for (let i = 0, len = getRandInt(3, 5); i < len; i++) {
			stops[availStops.splice(getRandInt(0, availStops.length), 1)] = true
		}

		const intervalId = setInterval(() => {
			stops.tick++
			if (typeof stops[stops.tick] !== 'undefined') {
				progressBarValueEl.style.width = `${stops.tick * 10}%`
			}
			if (stops.tick >= 10) {
				clearInterval(intervalId)
				finishProgressBarAndSubmit()
			}
		}, 200)
	}

	function finishProgressBarAndSubmit() {
		progressBarContainerEl.classList.add('success')
		progressBarContainerEl.querySelector('span').innerHTML = 'Success!'
		progressBarValueEl.style.width = '100%'

		// TODO: this is all still currently built to only support a single selected module
		// fix it to check the 'single/split-run' variable and adjust as needed
		setTimeout(() => {
			let title = ''
			let url = ''
			if (embeddingSingleModule) {
				title = selectedItem.title
				url = buildLaunchUrl([selectedItem.draftId])
			} else {
				title =
					'Split-Run: ' +
					splitRunSelected.reduce((prev, current) => `${prev.title} or ${current.title}`)
				url = buildLaunchUrl(splitRunSelected.map(m => m.draftId))
			}

			const ltiData = buildContentItem(title, url, SETTINGS_IS_ASSIGNMENT)
			const formEl = document.getElementById('submit-form')
			formEl.querySelector('input[name=content_items]').value = JSON.stringify(ltiData)
			formEl.submit()
		}, 1000)
	}

	function buildContentItem(title, url, isAssignment = false) {
		const specialTitle = isAssignment ? title : title + " (doesn't send scores to gradebook)"
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

	function buildLaunchUrl(draftIds) {
		let draftString = ''
		if (draftIds.length > 1) {
			draftString = `?draftA=${draftIds[0]}&draftB=${draftIds[1]}`
		} else {
			draftString = draftIds[0]
		}
		return (
			window.location.origin +
			(embeddingSingleModule ? '/view/' : '/view-split') +
			draftString +
			(embeddingSingleModule ? '?score_import=' : '&score_import=') +
			(allowScorePassback ? 'true' : 'false')
		)
	}

	// list pages
	function appendListItem(lo, listEl) {
		const cloneEl = itemTemplateEl.cloneNode(true)
		cloneEl.classList.remove('template')
		cloneEl.querySelector('.title').innerHTML = lo.title ? lo.title : 'Untitled'
		cloneEl.querySelector('.draft-id').innerHTML = 'id: ' + lo.draftId
		cloneEl.querySelector('.preview').setAttribute('href', '/preview/' + lo.draftId)
		cloneEl.setAttribute('data-lo-id', lo.draftId)
		cloneEl.querySelector('.button').addEventListener('click', onEmbedClick)

		if (!embeddingSingleModule) {
			const alreadySelected = splitRunSelected.some(selected => selected.draftId === lo.draftId)
			if (alreadySelected) cloneEl.querySelector('.button').classList.add('deselect-button')
			cloneEl.querySelector('.button').innerHTML = alreadySelected ? 'Deselect' : 'Select'

			if (splitRunSelected.length >= MAX_SPLIT_RUN_OPTION_LENGTH && !alreadySelected) {
				cloneEl.querySelector('.button').classList.add('disabled')
			}
		}

		listEl.appendChild(cloneEl)
	}

	function populateList(section) {
		resetSectionList(section)

		hide(listContainerEl.querySelector('.section'))
		searchEl.value = ''

		let title = ''
		let apiUrl = ''
		let color = ''

		switch (section) {
			default:
			case TAB_PERSONAL:
				title = 'Personal Library'
				apiUrl = '/api/drafts'
				color = 'blue'
				document.getElementById('new-module').classList.remove('hidden')
				break

			case TAB_COMMUNITY:
				title = 'Community Collection'
				apiUrl = '/api/drafts-public'
				color = 'purple'
				document.getElementById('new-module').classList.add('hidden')
				break
		}

		const className = sectionClassName(section)
		document.querySelector(className).classList.add(color)

		document.getElementById('select-section-title').innerHTML = title
		data.items = 'pending'
		const fetchOptions = { credentials: 'same-origin' }
		fetch(apiUrl, fetchOptions)
			.then(resp => resp.json())
			.then(respJson => {
				if (respJson.status !== 'ok') throw 'Failed loading modules'

				// personal module lookup has an extra layer indicating total module count
				data.allItems = data.items = respJson.value.modules
					? respJson.value.modules
					: respJson.value
				populateSection(section, title, color)

				if (searchEl.value !== '') {
					search()
				}
			})
			.catch(error => {
				handleError(error)
			})
	}

	function populateSection(section) {
		const className = sectionClassName(section)
		const items = data.items
		const lastIndex = Math.min(Math.min(items.length, MAX_ITEMS) + data.last, items.length)
		const sectionEl = document.querySelector(className)
		const listEl = sectionEl.querySelector('ul')
		// hide all no-item lists
		document.querySelectorAll('.no-items').forEach(el => hide(el))

		if (items.length === 0) {
			show(sectionEl.querySelector('.no-items'))
		} else {
			const len = lastIndex
			for (let i = data.last; i < len; i++) {
				appendListItem(items[i], listEl)
			}

			data.last = lastIndex
		}

		show(sectionEl)
	}

	function resetSectionList(section) {
		const listEl = document.querySelector(sectionClassName(section))
		data.items = undefined // eslint-disable-line no-undefined
		data.last = 0
		empty(listEl.querySelector('ul'))
		hide(listEl.querySelector('.no-items'))
	}

	function resetSplitRunSelectedSectionList() {
		const listEl = document.getElementById('split-run-selected-modules-list')
		listEl.innerHTML = ''
		document.getElementById('select-more-count').innerHTML =
			MAX_SPLIT_RUN_OPTION_LENGTH - splitRunSelected.length

		for (let i = 0; i < splitRunSelected.length; i++) {
			appendListItem(splitRunSelected[i], listEl)
		}

		if (splitRunSelected.length >= MAX_SPLIT_RUN_OPTION_LENGTH) {
			// disable all 'Select' buttons
			// leave 'Deselect' buttons functional
			const selectButtons = document
				.getElementById('list-container')
				.querySelectorAll('.button.embed-button:not(.deselect-button)')
			selectButtons.forEach(button => button.classList.add('disabled'))

			document.getElementById('select-more-indicator').classList.add('is-hidden')
			document.getElementById('split-run-category-embed-button').classList.remove('is-hidden')
			document.getElementById('split-run-list-embed-button-wrapper').classList.remove('is-hidden')
		} else {
			// enable all 'Select' buttons
			const selectButtons = document
				.getElementById('list-container')
				.querySelectorAll('.button.embed-button:not(.deselect-button)')
			selectButtons.forEach(button => button.classList.remove('disabled'))

			document.getElementById('select-more-indicator').classList.remove('is-hidden')
			document.getElementById('split-run-category-embed-button').classList.add('is-hidden')
			document.getElementById('split-run-list-embed-button-wrapper').classList.add('is-hidden')
		}
	}

	// UI:
	function setupUI() {
		listContainerEl.querySelector('ul.template').remove()

		searchEl.addEventListener('keyup', event => {
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

		document.getElementById('refresh').addEventListener('click', event => {
			event.preventDefault()

			if (typeof data.items !== 'undefined' && data.items !== 'pending') {
				resetSectionList(section)
				populateList(section)
			}
		})

		document.getElementById('type-back-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_EMBED_TYPE_SELECT)
		})

		document.getElementById('module-back-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_MODULE_SELECT)
		})

		document.getElementById('single-module-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_MODULE_SELECT, false)
			embeddingSingleModule = true
			document.getElementById('embed-type-indicator').innerHTML = 'Embedding Single Module'
			splitRunSelected = []
			document.getElementById('split-run-selected').classList.add('is-hidden')
			resetSplitRunSelectedSectionList()
		})

		document.getElementById('split-run-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_MODULE_SELECT, false)
			embeddingSingleModule = false
			document.getElementById('embed-type-indicator').innerHTML = 'Embedding Split-Run'
			splitRunSelected = []
			document.getElementById('split-run-selected').classList.remove('is-hidden')
			resetSplitRunSelectedSectionList()
		})

		document.getElementById('community-library-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_SELECT_OBJECT, false, 'purple')
			gotoTab(TAB_COMMUNITY)
		})

		document.getElementById('personal-library-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(SECTION_SELECT_OBJECT, false, 'blue')
			gotoTab(TAB_PERSONAL)
		})

		document.getElementById('split-run-category-embed-button').addEventListener('click', event => {
			event.preventDefault()
			document.getElementById('split-run-import-clarification').classList.remove('is-hidden')
			gotoSection(SECTION_EMBED_OPTIONS)
		})

		document.getElementById('split-run-list-embed-button').addEventListener('click', event => {
			event.preventDefault()
			document.getElementById('split-run-import-clarification').classList.remove('is-hidden')
			gotoSection(SECTION_EMBED_OPTIONS)
		})

		document.getElementById('finish-button').addEventListener('click', event => {
			event.preventDefault()
			allowScorePassback =
				document.querySelector("input[name='allow_import']:checked").value === '1'
			gotoSection(SECTION_PRE_PROGRESS)
		})

		document.getElementById('finish-cancel-button').addEventListener('click', event => {
			event.preventDefault()
			gotoSection(sectionState.sectionId, sectionState.skipFadeAnimation, sectionState.addClass)
		})
	}

	function onEmbedClick(event) {
		event.preventDefault()
		const oboItemEl = this.parentNode.parentNode.parentNode
		const draftId = oboItemEl.getAttribute('data-lo-id')
		selectedItem = getDraftById(draftId)

		if (embeddingSingleModule) {
			document.getElementById('split-run-import-clarification').classList.add('is-hidden')
			return gotoSection(SECTION_EMBED_OPTIONS)
		}

		// the same button serves two purposes - to select an unselected module or to deselect a selected module
		// determine which by checking to see if the module this button belongs to is in the list of selected modules
		const alreadySelected = splitRunSelected.some(selected => selected.draftId === draftId)
		if (alreadySelected) {
			splitRunSelected = splitRunSelected.filter(selected => selected.draftId !== draftId)
			oboItemEl.querySelector('.button').classList.remove('deselect-button')
		} else {
			if (splitRunSelected.length >= MAX_SPLIT_RUN_OPTION_LENGTH) return
			splitRunSelected.push(selectedItem)
			oboItemEl.querySelector('.button').classList.add('deselect-button')
		}

		oboItemEl.querySelector('.button').innerHTML = alreadySelected ? 'Select' : 'Deselect'
		resetSplitRunSelectedSectionList()
	}

	function handleError(result) {
		const isErrorObject = typeof result !== 'undefined' && typeof result.errorID !== 'undefined'
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

		window.alert(message) //eslint-disable-line no-alert
		gotoSection(SECTION_MODULE_SELECT)
	}

	function killPage(message) {
		// go to a non-existant section
		gotoSection('dead', true)
		// disable gotoSection
		gotoSection = () => {} // eslint-disable-line no-func-assign
		window.alert(message) //eslint-disable-line no-alert
	}

	// initalize:
	setupUI()
	// gotoSection(SECTION_MODULE_SELECT)
	gotoSection(SECTION_EMBED_TYPE_SELECT)
})()
