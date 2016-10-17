* @TODO - IDEA - Have click targets, allow you to set future carets on them, so you can click on the img in figure chunk and then setFutureCaret() it
* '@TODO - All of the command handlers should move out to Editor since they all have to do with editing!!!!'
* '@TODO - forcePageRender should just use callbacks'
* '@TODO - Need a better name than "compoment"'
* '@TODO - consider css namespacing'
* '@TODO - Allow full rich text editing inside a modal window, should you want it'
* '@TODO - turn classes like pad into sass mixins'
* '@TODO - Dont like that Im getting the dom selection for curChunkSel when the chunk selection should be up to date theoretically'
* '@TODO - Shortcuts like Ctrl+S to save trigger screen tween'
* '@TODO - '
* Editing of YouTube / iFrame bubble is focus wonky
* Need to load google fonts on editor end probably

Migrate key commands and inputmanger alg to functions

aka

editor.deleteSelection()
editor.sendKey 'a' ?
editor.insertText ?
editor.sendTab()
editor.setSelection
