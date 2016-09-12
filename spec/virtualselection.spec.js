VirtualCursor    = window.ObojoboDraft.oboDOM.Selection.VirtualCursor;
VirtualSelection    = window.ObojoboDraft.oboDOM.Selection.VirtualSelection;
StyleableText    = window.ObojoboDraft.text.StyleableText;
TextGroupCursor  = window.ObojoboDraft.text.TextGroupCursor;
TextGroupSelection  = window.ObojoboDraft.text.TextGroupSelection;
Chunk            = window.ObojoboDraft.models.Chunk;
Module            = window.ObojoboDraft.models.Module;
TextGroup        = window.ObojoboDraft.text.TextGroup;
ComponentClassMap        = window.ObojoboDraft.util.ComponentClassMap;
DOMSelection = window.ObojoboDraft.page.DOMSelection;

window.OBO.getChunks( function(chunks) {
	chunks.forEach(function(chunkClass, type) {
		ComponentClassMap.register(type, chunkClass);
	});
	ComponentClassMap.setDefault(OBO.defaultChunk);

	describe('VirtualSelection', function() {
		beforeEach(function() {
			chunkTop = Chunk.create();
			chunkTop.componentContent.textGroup.first.text.insertText(0, "abc123");
			chunkTop.componentContent.textGroup.splitText(0, 3);

			chunkMiddle = chunkTop.clone();

			chunkBottom = chunkTop.clone();

			chunkTop.componentContent.textGroup.first.text.insertText(0, 'T-');
			chunkTop.componentContent.textGroup.last.text.insertText(1, 'T-');
			chunkMiddle.componentContent.textGroup.first.text.insertText(0, 'M-');
			chunkMiddle.componentContent.textGroup.last.text.insertText(1, 'M-');
			chunkBottom.componentContent.textGroup.first.text.insertText(0, 'B-');
			chunkBottom.componentContent.textGroup.last.text.insertText(1, 'B-');

			module = new Module();
			module.chunks.add(chunkTop);
			module.chunks.add(chunkMiddle);
			module.chunks.add(chunkBottom);

			/*
			T-abc
			T-12[3

			M-abc
			M-123

			B]-abc
			B-123
			*/
			chunkSpanVirtSel = new VirtualSelection(module);
			chunkSpanVirtSel.setStart(chunkTop, { groupIndex: 1, offset: 4});
			chunkSpanVirtSel.setEnd(chunkBottom, { groupIndex: 0, offset: 1});

			/*
			T-abc
			T-123

			M[-ab]c
			M-123

			B-abc
			B-123
			*/
			textSpanVirtSel = new VirtualSelection(module);
			textSpanVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
			textSpanVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 4});

			/*
			T-abc
			T-123

			M|-abc
			M-123

			B-abc
			B-123
			*/
			caretVirtSel = new VirtualSelection(module);
			caretVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
			caretVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 1});

			noneVirtSel = new VirtualSelection(module);

			doc = document.createElement('div');

			chunkEl = document.createElement('div');
			chunkEl.classList.add('component');
			chunkEl.setAttribute('data-component-index', '0');

			text1 = document.createElement('div');
			text1.setAttribute('data-group-index', '0');
			text1.innerHTML = '<b>123</b>456<i>789<b>ABC</b></i>DEF';

			text2 = document.createElement('div');
			text2.setAttribute('data-group-index', '1');
			text2.innerHTML = '<b>123</b>456<i>789<b>ABC</b></i>DEF';

			chunkEl.appendChild(text1);
			chunkEl.appendChild(text2);
			doc.appendChild(chunkEl);
			document.body.appendChild(doc);

			domSelection = new DOMSelection();
			domSelection.set(text1.childNodes[0].childNodes[0], 1, text2.childNodes[3], 2);

			// Little hack since the fromDOMSelection method
			// calls getVirtualSelectionStartData on the chunks
			// which will send editor.state.selection to the
			// getVirtualSelectionStartData method in that chunk's
			// commandHandler (in this case TextGroupCommandHandler)
			module.editor = {
				state: {
					selection: {
						virtualSelection: chunkSpanVirtSel,
						dom: domSelection
					}
				}
			};
		});

		it('clears itself', function() {
			chunkSpanVirtSel.clear();

			expect(chunkSpanVirtSel.start).toBe(null);
			expect(chunkSpanVirtSel.end).toBe(null);
		});

		it('clones itself', function() {
			clone = chunkSpanVirtSel.clone();
			expect(clone).toEqual(chunkSpanVirtSel);
		});

		it("returns position as 'before' for chunks above the selection", function() {
			expect(textSpanVirtSel.getPosition(chunkTop)).toBe('before');
		});

		it("returns position as 'after' for chunks below the selection", function() {
			expect(textSpanVirtSel.getPosition(chunkBottom)).toBe('after');
		});

		it("returns position as 'start' for chunks that contain the start of the selection", function() {
			expect(chunkSpanVirtSel.getPosition(chunkTop)).toBe('start');
		});

		it("returns position as 'end' for chunks that contain the end of the selection", function() {
			expect(chunkSpanVirtSel.getPosition(chunkBottom)).toBe('end');
		});

		it("returns position as 'contains' for chunks that contain the selection", function() {
			expect(textSpanVirtSel.getPosition(chunkMiddle)).toBe('contains');
		});

		it("returns position as 'inside' for chunks that are within the selection", function() {
			expect(chunkSpanVirtSel.getPosition(chunkMiddle)).toBe('inside');
		});

		it("collapses the selection to a caret at the start of the selection", function() {
			chunkSpanVirtSel.collapse();
			expect(chunkSpanVirtSel.end).toEqual(chunkSpanVirtSel.start);
			expect(chunkSpanVirtSel.end).toEqual(new VirtualCursor(chunkTop, {
				groupIndex: 1,
				offset: 4
			}));
		});

		it("collapses the selection to a caret at the end of the selection", function() {
			chunkSpanVirtSel.collapseToEnd();
			expect(chunkSpanVirtSel.start).toEqual(chunkSpanVirtSel.end);
			expect(chunkSpanVirtSel.start).toEqual(new VirtualCursor(chunkBottom, {
				groupIndex: 0,
				offset: 1
			}));
		});

		it("sets the start of the selection", function() {
			chunkSpanVirtSel.setStart(chunkMiddle, { groupIndex: 1, offset: 3 });
			expect(chunkSpanVirtSel.start).toEqual(new VirtualCursor(chunkMiddle, { groupIndex: 1, offset: 3 }));
			expect(chunkSpanVirtSel.end).toEqual(new VirtualCursor(chunkBottom, { groupIndex:0, offset: 1 }));
		});

		it("sets the end of the selection", function() {
			chunkSpanVirtSel.setEnd(chunkMiddle, { groupIndex: 1, offset: 3 });
			expect(chunkSpanVirtSel.start).toEqual(new VirtualCursor(chunkTop, { groupIndex: 1, offset: 4 }));
			expect(chunkSpanVirtSel.end).toEqual(new VirtualCursor(chunkMiddle, { groupIndex: 1, offset: 3 }));
		});

		it("sets the selection to a specified caret", function() {
			chunkSpanVirtSel.setCaret(chunkMiddle, { groupIndex: 1, offset: 3 });
			expect(chunkSpanVirtSel.start).toEqual(new VirtualCursor(chunkMiddle, { groupIndex: 1, offset: 3 }));
			expect(chunkSpanVirtSel.end).toEqual(new VirtualCursor(chunkMiddle, { groupIndex: 1, offset: 3 }));
		});

		it("exports to an object", function() {
			expect(chunkSpanVirtSel.toObject()).toEqual({
				start: {
					index: 0,
					data: {
						groupIndex: 1,
						offset: 4
					}
				},
				end: {
					index: 2,
					data: {
						groupIndex: 0,
						offset: 1
					}
				}
			});
		});

		it("imports from an object", function() {
			textSpanVirtSel.fromObject(chunkSpanVirtSel.toObject());
			expect(textSpanVirtSel).toEqual(chunkSpanVirtSel);
		});

		it("imports from the DOM", function() {
			vs = VirtualSelection.fromDOMSelection(module, domSelection);
			expect(vs.toObject()).toEqual({
				start: {
					index: 0,
					data: {
						groupIndex: 0,
						offset: 1
					}
				},
				end: {
					index: 0,
					data: {
						groupIndex: 1,
						offset: 14
					}
				}
			});
		});

		it("reports none type for a none selection", function() {
			expect(noneVirtSel.type).toBe('none');
		});

		it("reports chunkSpan type for a chunk spanning selection", function() {
			expect(chunkSpanVirtSel.type).toBe('chunkSpan');
		});

		it("reports textSpan type for a text spanning selection", function() {
			expect(textSpanVirtSel.type).toBe('textSpan');
		});

		it("reports caret type for a caret selection", function() {
			expect(caretVirtSel.type).toBe('caret');
		});

		it("returns all chunks within a selection", function() {
			all = chunkSpanVirtSel.all;
			expect(all.length).toBe(3);
			expect(all[0]).toBe(chunkTop);
			expect(all[1]).toBe(chunkMiddle);
			expect(all[2]).toBe(chunkBottom);

			all = textSpanVirtSel.all;
			expect(all.length).toBe(1);
			expect(all[0]).toBe(chunkMiddle);

			all = caretVirtSel.all;
			expect(all.length).toBe(1);
			expect(all[0]).toBe(chunkMiddle);

			all = noneVirtSel.all;
			expect(all.length).toBe(0);
		});

		it("returns chunks that are inside a selection", function() {
			inbetween = chunkSpanVirtSel.inbetween;
			expect(inbetween.length).toBe(1);
			expect(inbetween[0]).toBe(chunkMiddle);

			inbetween = textSpanVirtSel.inbetween;
			expect(inbetween.length).toBe(0);

			inbetween = caretVirtSel.inbetween;
			expect(inbetween.length).toBe(0);

			inbetween = noneVirtSel.inbetween;
			expect(inbetween.length).toBe(0);
		});
	});
});


