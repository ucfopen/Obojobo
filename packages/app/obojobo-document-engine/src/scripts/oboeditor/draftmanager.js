import 'whatwg-fetch'
/* eslint-disable no-alert */
/* eslint-disable no-console */

const domParser = new DOMParser()
let childWindow = null
const draftEls = document.querySelectorAll('.link-edit')
let isCtrlPressed = false
let editingDraftId = null
let mode = ''

document.getElementById('add-image-form').addEventListener('submit', onSubmitInsertImage)

// Setup unload
window.onbeforeunload = function() {
	const unsavedEls = document.getElementsByClassName('unsaved')
	if (unsavedEls.length > 0) {
		return true // Returning true will cause browser to ask user to confirm leaving page
	}
	//eslint-disable-next-line
	return undefined // Returning undefined will allow browser to close normally
}

// Reload preview windows:
//eslint-disable-next-line
function preview() {
	childWindow = window.open(`/preview/${editingDraftId}`, 'preview')
}

// listen for Ctrl-S for saving
document.addEventListener('keydown', function(event) {
	if (event.key === 'Meta') {
		isCtrlPressed = true
		return
	}
	if (event.keyCode === 83 && isCtrlPressed) {
		event.preventDefault()
		saveDraft()
	}
	isCtrlPressed = false
})
document.addEventListener('keyup', function(event) {
	if (event.keyCode === 83 && event.ctrlKey) {
		event.preventDefault()
		saveDraft()
	}
})

//eslint-disable-next-line
const editor = CodeMirror(document.getElementById('edit'), {
	lineNumbers: true,
	mode: 'text/xml',
	matchTags: true,
	foldGutter: true,
	lineWrapping: true,
	indentWithTabs: true,
	tabSize: 4,
	indentUnit: 4,
	gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
	theme: 'monokai'
})

document.getElementById('button-save-draft').addEventListener('click', saveDraft)
//eslint-disable-next-line
function addQuestion() {
	const questionText =
		'<Question>\n					<h1>Your question here</h1>\n					<MCAssessment responseType="pick-one" shuffle="true">\n						<MCChoice score="100">\n							<MCAnswer>\n								<p>Answer 1 text</p>\n							</MCAnswer>\n							<MCFeedback>\n								<p>Optional answer 1 feedback</p>\n							</MCFeedback>\n						</MCChoice>\n						<MCChoice score="0">\n							<MCAnswer>\n								<p>Answer 2 text</p>\n							</MCAnswer>\n							<MCFeedback>\n								<p>Optional answer 2 feedback</p>\n							</MCFeedback>\n						</MCChoice>\n					</MCAssessment>\n					<!-- Optional solution: -->\n					<solution>\n						<Page>\n							<p>Add additional information here</p>\n						</Page>\n					</solution>\n				</Question>'
	editor.replaceSelection(questionText)
	setTimeout(function() {
		editor.focus()
	}, 100)
}

//eslint-disable-next-line
function addImage() {
	const addImageModalEl = document.getElementById('add-image-modal')
	addImageModalEl.style.display = 'block'
}

function enableLoadingSpinner() {
	document.getElementById('image-loading').style.display = 'block'
}

function disableLoadingSpinner() {
	document.getElementById('image-loading').style.display = 'none'
}

//eslint-disable-next-line
function onChangeImageSize(radioEl) {
	const customSizeInputsEl = document.getElementById('custom-size-inputs')
	customSizeInputsEl.style.visibility = radioEl.value === 'custom' ? 'visible' : 'hidden'
}

function closeInsertImageModal() {
	const addImageModalEl = document.getElementById('add-image-modal')
	addImageModalEl.style.display = 'none'
	resetImageForm()
}

//eslint-disable-next-line
function onUpdateImage() {
	const modal = document.getElementById('add-image-form')
	if (event.target.value) {
		modal.classList.add('on-step-2')
	} else {
		modal.classList.remove('on-step-2')
	}
}

function resetImageForm() {
	document.getElementById('add-image-form').classList.remove('on-step-2')
	document.getElementById('add-image-form').reset()
	disableLoadingSpinner()
	document.getElementById('custom-size-inputs').style.visibility = 'hidden'
}

function writeImageToDocument(mediaId) {
	const customWidth = document.getElementById('custom-width').value
	const customHeight = document.getElementById('custom-height').value
	const customCaption = document.getElementById('image-caption').value
	const customAlt = document.getElementById('alt-text').value
	const selectedSize = document.querySelector('input[name="size"]:checked').value
	const customAttributes = {
		size: selectedSize,
		width: customWidth,
		height: customHeight,
		alt: customAlt
	}
	let imgString = '<figure>\n					<img src="' + mediaId + '" '
	Object.keys(customAttributes).forEach(key => {
		switch (key) {
			case 'size':
				imgString += 'size="' + selectedSize + '" '
				break
			case 'width':
				// b/c IE doesn't support input type number do num validation here
				if (!isNaN(parseInt(customAttributes[key], 10))) {
					imgString += 'width="' + customAttributes[key] + '" '
				}
				break
			case 'height':
				// b/c IE doesn't support input type number do num validation here
				if (!isNaN(parseInt(customAttributes[key], 10))) {
					imgString += 'height="' + customAttributes[key] + '" '
				}
				break
			case 'alt':
				if (customAttributes[key]) {
					imgString += 'alt="' + customAttributes[key] + '" '
				}
				break
		}
	})
	imgString += '/>'
	if (customCaption) {
		imgString += '\n					<figcaption>' + customCaption + '</figcaption>'
	}
	imgString += '\n				</figure>'
	editor.replaceSelection(imgString)
	setTimeout(function() {
		editor.focus()
	}, 100)
}

function onSubmitInsertImage(event) {
	event.preventDefault()
	enableLoadingSpinner()
	const fileInput = document.getElementById('image-file-input')
	const file = fileInput.files[0]
	const formData = new FormData()
	formData.append('userImage', file, file.name)
	const request = new XMLHttpRequest()
	request.onreadystatechange = function() {
		// response text contains the media id upon successful upload, and the error message for
		// 	unsuccessful uploads
		if (request.readyState === 4) {
			if (request.status === 200) {
				writeImageToDocument(request.responseText)
				closeInsertImageModal()
			} else {
				alert(request.responseText)
				disableLoadingSpinner()
			}
		}
	}
	request.open('POST', '/api/media/upload', true)
	request.send(formData)
}

function saveDraft() {
	if (!editingDraftId) return
	const draftContent = editor.getValue()
	apiSaveDraft(draftContent)
		.then(res => {
			switch (res.status) {
				case 200:
					res.json().then(json => {
						if (json.value.id) {
							animateSavedButton()
							refreshPreviewWindow()
						} else {
							alert('Something went wrong, please try again')
							console.error(json)
						}
					})
					break
				default:
					res
						.json()
						.then(json => {
							alert('Error: ' + json.value.message + ' (' + res.status + ')')
						})
						.catch(() => {
							alert('Error: ' + res.statusText + ' (' + res.status + ')')
						})
					break
			}
		})
		.catch(error => {
			alert('Error: ' + error)
			console.error(error)
		})
}

function edit(draftId) {
	if (!draftId) return

	apiLoadDraft(draftId)
		.then(content => {
			let theContent
			console.log(content)
			document.getElementById('editor').style.display = 'block'
			editingDraftId = draftId

			if(content.value.xml){
				mode = 'xml'
				editor.setOption('mode', 'text/xml')
				theContent = content.value.xml
			} else {
				mode = 'json'
				editor.setOption('mode', 'application/json')
				theContent = content.value.content
			}
			editor.setValue(theContent)
		})
}

function apiLoadDraft(draftId){
	const options = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	}

	return fetch(`/api/drafts/${draftId}/raw`, options)
		.then(res => res.json())
}

function apiSaveDraft(content){
	const mime = (mode === 'json' ? 'application/json' : 'text/plain')
	const options = {
		method: 'POST',
		credentials: 'include',
		body: content,
		headers: {
			Accept: mime,
			'Content-Type': mime
		}
	}
	return fetch(`/api/drafts/${editingDraftId}`, options)
}

function animateSavedButton(){
	document.body.classList.add('saved')
	document.getElementById('button-save-draft').innerText = 'Saved!'
	document.getElementById('button-save-draft').disabled = true
	setTimeout(() => {
		document.body.classList.remove('saved')
		document.getElementById('button-save-draft').innerText = 'Save Draft'
		document.getElementById('button-save-draft').disabled = false
	}, 1000)
}

function refreshPreviewWindow(){
	if (childWindow && childWindow.location && childWindow.location.reload) {
		childWindow.location.reload()
	}
}

if (location.hash.indexOf('#id:') === 0) {
	edit(location.hash.substr(4))
}

window.addImage = addImage
window.addQuestion = addQuestion
window.preview = preview
window.saveDraft = saveDraft
window.closeInsertImageModal = closeInsertImageModal
window.onUpdateImage = onUpdateImage
window.onChangeImageSize = onChangeImageSize
