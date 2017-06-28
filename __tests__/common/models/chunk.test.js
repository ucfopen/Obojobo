describe.skip('Chunk')

// VirtualCursor    = window.Common.oboDOM.Selection.VirtualCursor;
// VirtualSelection    = window.Common.oboDOM.Selection.VirtualSelection;
// StyleableText    = window.Common.text.StyleableText;
// TextGroupCursor  = window.Common.text.TextGroupCursor;
// TextGroupSelection  = window.Common.text.TextGroupSelection;
// Chunk            = window.Common.models.Chunk;
// Module            = window.Common.models.Module;
// TextGroup        = window.Common.text.TextGroup;
// ComponentClassMap        = window.Common.util.ComponentClassMap;
// DOMSelection = window.Common.page.DOMSelection;

// window.OBO.getChunks( function(chunks) {
// 	chunks.forEach(function(chunkClass, type) {
// 		ComponentClassMap.register(type, chunkClass);
// 	});
// 	ComponentClassMap.setDefault(OBO.defaultChunk);

// 	describe('Chunk', function() {
// 		beforeEach(function() {
// 			chunkTop = Chunk.create();
// 			chunkTop.componentContent.textGroup.first.text.insertText(0, "abc123");
// 			chunkTop.componentContent.textGroup.splitText(0, 3);

// 			chunkMiddle = chunkTop.clone();

// 			chunkBottom = chunkTop.clone();

// 			chunkTop.componentContent.textGroup.first.text.insertText(0, 'T-');
// 			chunkTop.componentContent.textGroup.last.text.insertText(1, 'T-');
// 			chunkMiddle.componentContent.textGroup.first.text.insertText(0, 'M-');
// 			chunkMiddle.componentContent.textGroup.last.text.insertText(1, 'M-');
// 			chunkBottom.componentContent.textGroup.first.text.insertText(0, 'B-');
// 			chunkBottom.componentContent.textGroup.last.text.insertText(1, 'B-');

// 			module = new Module();
// 			module.chunks.add(chunkTop);
// 			module.chunks.add(chunkMiddle);
// 			module.chunks.add(chunkBottom);

// 			/*
// 			T-abc
// 			T-12[3

// 			M-abc
// 			M-123

// 			B]-abc
// 			B-123
// 			*/
// 			chunkSpanVirtSel = new VirtualSelection(module);
// 			chunkSpanVirtSel.setStart(chunkTop, { groupIndex: 1, offset: 4});
// 			chunkSpanVirtSel.setEnd(chunkBottom, { groupIndex: 0, offset: 1});

// 			/*
// 			T-abc
// 			T-123

// 			M[-ab]c
// 			M-123

// 			B-abc
// 			B-123
// 			*/
// 			textSpanVirtSel = new VirtualSelection(module);
// 			textSpanVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
// 			textSpanVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 4});

// 			/*
// 			T-abc
// 			T-123

// 			M|-abc
// 			M-123

// 			B-abc
// 			B-123
// 			*/
// 			caretVirtSel = new VirtualSelection(module);
// 			caretVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
// 			caretVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 1});

// 			noneVirtSel = new VirtualSelection(module);

// 			doc = document.createElement('div');

// 			chunkEl = document.createElement('div');
// 			chunkEl.classList.add('component');
// 			chunkEl.setAttribute('data-component-index', '0');

// 			text1 = document.createElement('div');
// 			text1.setAttribute('data-group-index', '0');
// 			text1.innerHTML = '<b>123</b>456<i>789<b>ABC</b></i>DEF';

// 			text2 = document.createElement('div');
// 			text2.setAttribute('data-group-index', '1');
// 			text2.innerHTML = '<b>123</b>456<i>789<b>ABC</b></i>DEF';

// 			chunkEl.appendChild(text1);
// 			chunkEl.appendChild(text2);
// 			doc.appendChild(chunkEl);
// 			document.body.appendChild(doc);

// 			domSelection = new DOMSelection();
// 			domSelection.set(text1.childNodes[0].childNodes[0], 1, text2.childNodes[3], 2);

// 			// Little hack since the fromDOMSelection method
// 			// calls getVirtualSelectionStartData on the chunks
// 			// which will send editor.state.selection to the
// 			// getVirtualSelectionStartData method in that chunk's
// 			// commandHandler (in this case TextGroupCommandHandler)
// 			module.editor = {
// 				state: {
// 					selection: {
// 						virtualSelection: chunkSpanVirtSel,
// 						dom: domSelection
// 					}
// 				}
// 			};
// 		});

// 		it('can assign itself a new id', function() {
// 			oldId = chunkTop.get('id');
// 			chunkTop.assignNewId();
// 			newId = chunkTop.get('id');

// 			expect(oldId).not.toBe(newId);
// 		});

// 		it('knows if it is an orphan', function() {
// 			expect(chunkTop.isOrphan()).toBe(false);
// 			chunkTop.remove();
// 			expect(chunkTop.isOrphan()).toBe(true);
// 		});

// 		it('can add a chunk before another chunk', function() {
// 			chunkTop.addChunkBefore(chunkBottom);

// 			expect(chunkBottom.get('index')).toBe(0);
// 			expect(chunkTop.get('index')).toBe(1);
// 			expect(chunkMiddle.get('index')).toBe(2);
// 		});

// 		it('can add a chunk after another chunk', function() {
// 			chunkBottom.addChunkAfter(chunkTop);
// 			chunkTop.addChunkAfter(chunkMiddle);

// 			expect(chunkBottom.get('index')).toBe(0);
// 			expect(chunkTop.get('index')).toBe(1);
// 			expect(chunkMiddle.get('index')).toBe(2);
// 		});

// 		it('can move a chunk', function() {
// 			chunkBottom.moveTo(0);

// 			expect(chunkBottom.get('index')).toBe(0);
// 			expect(chunkTop.get('index')).toBe(1);
// 			expect(chunkMiddle.get('index')).toBe(2);
// 		});

// 		it('can move a chunk to the top', function() {
// 			chunkBottom.moveToTop();

// 			expect(chunkBottom.get('index')).toBe(0);
// 			expect(chunkTop.get('index')).toBe(1);
// 			expect(chunkMiddle.get('index')).toBe(2);
// 		});

// 		it('can move a chunk to the bottom', function() {
// 			chunkTop.moveToBottom();
// 			chunkMiddle.moveToBottom();

// 			expect(chunkBottom.get('index')).toBe(0);
// 			expect(chunkTop.get('index')).toBe(1);
// 			expect(chunkMiddle.get('index')).toBe(2);
// 		});

// 		it("can find it's next sibling", function() {
// 			expect(chunkTop.nextSibling()).toBe(chunkMiddle);
// 			expect(chunkMiddle.nextSibling()).toBe(chunkBottom);
// 			expect(chunkBottom.nextSibling()).toBe(null);

// 			chunkTop.remove();
// 			expect(chunkTop.nextSibling()).toBe(null);
// 		});

// 		it("can find it's previous sibling", function() {
// 			expect(chunkTop.prevSibling()).toBe(null);
// 			expect(chunkMiddle.prevSibling()).toBe(chunkTop);
// 			expect(chunkBottom.prevSibling()).toBe(chunkMiddle);

// 			chunkBottom.remove();
// 			expect(chunkBottom.prevSibling()).toBe(null);
// 		});

// 		it("knows if it is the first chunk", function() {
// 			expect(chunkTop.isFirst()).toBe(true);
// 			expect(chunkMiddle.isFirst()).toBe(false);
// 			expect(chunkBottom.isFirst()).toBe(false);

// 			chunkTop.remove();
// 			expect(chunkTop.isFirst()).toBe(false);
// 			expect(chunkMiddle.isFirst()).toBe(true);
// 			expect(chunkBottom.isFirst()).toBe(false);
// 		});

// 		it("knows if it is the last chunk", function() {
// 			expect(chunkTop.isLast()).toBe(false);
// 			expect(chunkMiddle.isLast()).toBe(false);
// 			expect(chunkBottom.isLast()).toBe(true);

// 			chunkBottom.remove();
// 			expect(chunkTop.isLast()).toBe(false);
// 			expect(chunkMiddle.isLast()).toBe(true);
// 			expect(chunkBottom.isLast()).toBe(false);
// 		});

// 		it("knows if it is before another chunk", function() {
// 			expect(chunkTop.isBefore(chunkTop)).toBe(false);
// 			expect(chunkTop.isBefore(chunkMiddle)).toBe(true);
// 			expect(chunkTop.isBefore(chunkBottom)).toBe(true);

// 			expect(chunkMiddle.isBefore(chunkTop)).toBe(false);
// 			expect(chunkMiddle.isBefore(chunkMiddle)).toBe(false);
// 			expect(chunkMiddle.isBefore(chunkBottom)).toBe(true);

// 			expect(chunkBottom.isBefore(chunkTop)).toBe(false);
// 			expect(chunkBottom.isBefore(chunkMiddle)).toBe(false);
// 			expect(chunkBottom.isBefore(chunkBottom)).toBe(false);

// 			chunkTop.remove();
// 			expect(chunkTop.isBefore(chunkMiddle)).toBe(false);
// 		});

// 		it("knows if it is after another chunk", function() {
// 			expect(chunkTop.isAfter(chunkTop)).toBe(false);
// 			expect(chunkTop.isAfter(chunkMiddle)).toBe(false);
// 			expect(chunkTop.isAfter(chunkBottom)).toBe(false);

// 			expect(chunkMiddle.isAfter(chunkTop)).toBe(true);
// 			expect(chunkMiddle.isAfter(chunkMiddle)).toBe(false);
// 			expect(chunkMiddle.isAfter(chunkBottom)).toBe(false);

// 			expect(chunkBottom.isAfter(chunkTop)).toBe(true);
// 			expect(chunkBottom.isAfter(chunkMiddle)).toBe(true);
// 			expect(chunkBottom.isAfter(chunkBottom)).toBe(false);

// 			chunkBottom.remove();
// 			expect(chunkBottom.isAfter(chunkMiddle)).toBe(false);
// 		});

// 		it("can replace a chunk with another chunk", function() {
// 			chunkTop.replaceWith(chunkBottom);

// 			expect(module.chunks.models.length).toBe(2);
// 			expect(module.chunks.at(0)).toBe(chunkBottom);
// 			expect(module.chunks.at(1)).toBe(chunkMiddle);
// 		});

// 		it("ignores attempts for a chunk to replace itself", function() {
// 			chunkTop.replaceWith(chunkTop);

// 			expect(module.chunks.models.length).toBe(3);
// 			expect(module.chunks.at(0)).toBe(chunkTop);
// 			expect(module.chunks.at(1)).toBe(chunkMiddle);
// 			expect(module.chunks.at(2)).toBe(chunkBottom);
// 		});

// 		it("returns its component", function() {
// 			expect(chunkTop.getComponent()).toBe(ComponentClassMap.getDefaultComponentClass());
// 		});

// 		it("returns its element", function() {
// 			expect(chunkTop.getDomEl().isEqualNode(chunkEl)).toBe(true);
// 		});

// 		it("clones itself", function() {
// 			clone = chunkTop.clone();

// 			expect(chunkTop).not.toBe(clone);
// 			expect(chunkTop).not.toEqual(clone);

// 			clone.set('index', 0);
// 			clone.set('id', chunkTop.get('id'));

// 			expect(clone.attributes).toEqual(chunkTop.attributes);
// 			expect(clone.componentContent).toEqual(chunkTop.componentContent);
// 		});

// 		it("can revert to the default state", function() {
// 			newChunk = Chunk.create();
// 			chunkTopReference = chunkTop;

// 			expect(chunkTop.componentContent).not.toEqual(newChunk.componentContent);

// 			chunkTop.revert();

// 			expect(chunkTop).toBe(chunkTopReference);
// 			expect(chunkTop.componentContent).toEqual(newChunk.componentContent);
// 		});

// 		it("can create a default chunk with the create method", function() {
// 			newChunk = Chunk.create();
// 			expect(newChunk.getComponent()).toBe(ComponentClassMap.getDefaultComponentClass());
// 			expect(newChunk.get('type')).toBe('ObojoboDraft.Chunks.SingleText');
// 		});

// 		it("can create a chunk of the type of the component class passed into the create method", function() {
// 			newChunk = Chunk.create(chunks.get('ObojoboDraft.Chunks.List'));
// 			expect(newChunk.getComponent()).toBe(chunks.get('ObojoboDraft.Chunks.List'));
// 			expect(newChunk.get('type')).toBe('ObojoboDraft.Chunks.List');
// 		});

// 		it("can create a chunk of the type of the string passed into the create method", function() {
// 			newChunk = Chunk.create('ObojoboDraft.Chunks.List');
// 			expect(newChunk.getComponent()).toBe(chunks.get('ObojoboDraft.Chunks.List'));
// 			expect(newChunk.get('type')).toBe('ObojoboDraft.Chunks.List');
// 		});

// 		it("can pass in componentContent via the create method", function() {
// 			newChunk = Chunk.create('ObojoboDraft.Chunks.SingleText', { content:'content' });
// 			expect(newChunk.componentContent).toEqual({ content:'content' });
// 		});
// 	});
// });
