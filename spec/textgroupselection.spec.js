VirtualCursor    = window.ObojoboDraft.oboDOM.Selection.VirtualCursor;
VirtualSelection    = window.ObojoboDraft.oboDOM.Selection.VirtualSelection;
StyleableText    = window.ObojoboDraft.text.StyleableText;
TextGroupCursor  = window.ObojoboDraft.text.TextGroupCursor;
TextGroupSelection  = window.ObojoboDraft.text.TextGroupSelection;
Chunk            = window.ObojoboDraft.models.Chunk;
Module            = window.ObojoboDraft.models.Module;
TextGroup        = window.ObojoboDraft.text.TextGroup;
ComponentClassMap        = window.ObojoboDraft.util.ComponentClassMap;

window.OBO.getChunks( function(chunks) {
	chunks.forEach(function(chunkClass, type) {
		ComponentClassMap.register(type, chunkClass);
	});
	ComponentClassMap.setDefault(OBO.defaultChunk);

	describe('TextGroupSelection', function() {
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
			chunkSpanVirtSel = new VirtualSelection();
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
			textSpanVirtSel = new VirtualSelection();
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
			caretVirtSel = new VirtualSelection();
			caretVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
			caretVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 1});

			noneVirtSel = new VirtualSelection();

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
		});

		it('reports type none when selection is invalid', function() {
			expect((new TextGroupSelection(chunkTop, noneVirtSel)).type).toBe('none')
			expect((new TextGroupSelection(chunkMiddle, noneVirtSel)).type).toBe('none')
			expect((new TextGroupSelection(chunkBottom, noneVirtSel)).type).toBe('none')
		});

		it('reports single and multiple text span types for chunk spanning selections', function() {
			expect((new TextGroupSelection(chunkTop, chunkSpanVirtSel)).type).toBe('singleTextSpan')
			expect((new TextGroupSelection(chunkMiddle, chunkSpanVirtSel)).type).toBe('multipleTextSpan')
			expect((new TextGroupSelection(chunkBottom, chunkSpanVirtSel)).type).toBe('singleTextSpan')
		});

		it('reports single and none types for text spanning selections', function() {
			expect((new TextGroupSelection(chunkTop, textSpanVirtSel)).type).toBe('none')
			expect((new TextGroupSelection(chunkMiddle, textSpanVirtSel)).type).toBe('singleTextSpan')
			expect((new TextGroupSelection(chunkBottom, textSpanVirtSel)).type).toBe('none')
		});

		it('reports caret and none types for caret selections', function() {
			expect((new TextGroupSelection(chunkTop, caretVirtSel)).type).toBe('none')
			expect((new TextGroupSelection(chunkMiddle, caretVirtSel)).type).toBe('caret')
			expect((new TextGroupSelection(chunkBottom, caretVirtSel)).type).toBe('none')
		});

		it('reports start and end cursors correct for chunk spanning selections', function() {
			expect((new TextGroupSelection(chunkTop, chunkSpanVirtSel))
				.start
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkTop, {
				groupIndex: 1,
				offset: 4
			})));
			expect((new TextGroupSelection(chunkTop, chunkSpanVirtSel))
				.end
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkTop, {
				groupIndex: 1,
				offset: 5
			})));

			expect((new TextGroupSelection(chunkMiddle, chunkSpanVirtSel))
				.start
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 0,
				offset: 0
			})));
			expect((new TextGroupSelection(chunkMiddle, chunkSpanVirtSel))
				.end
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 1,
				offset: 5
			})));

			expect((new TextGroupSelection(chunkBottom, chunkSpanVirtSel))
				.start
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkBottom, {
				groupIndex: 0,
				offset: 0
			})));
			expect((new TextGroupSelection(chunkBottom, chunkSpanVirtSel))
				.end
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkBottom, {
				groupIndex: 0,
				offset: 1
			})));
		});

		it('reports start and end cursors correct for text spanning selections', function() {
			expect((new TextGroupSelection(chunkTop, textSpanVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkTop, textSpanVirtSel))
				.end
			).toBe(null);

			expect((new TextGroupSelection(chunkMiddle, textSpanVirtSel))
				.start
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 0,
				offset: 1
			})));
			expect((new TextGroupSelection(chunkMiddle, textSpanVirtSel))
				.end
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 0,
				offset: 4
			})));

			expect((new TextGroupSelection(chunkBottom, textSpanVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkBottom, textSpanVirtSel))
				.end
			).toBe(null);
		});

		it('reports start and end cursors correct for caret selections', function() {
			expect((new TextGroupSelection(chunkTop, caretVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkTop, caretVirtSel))
				.end
			).toBe(null);

			expect((new TextGroupSelection(chunkMiddle, caretVirtSel))
				.start
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 0,
				offset: 1
			})));
			expect((new TextGroupSelection(chunkMiddle, caretVirtSel))
				.end
			).toEqual(new TextGroupCursor(new VirtualCursor(chunkMiddle, {
				groupIndex: 0,
				offset: 1
			})));

			expect((new TextGroupSelection(chunkBottom, caretVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkBottom, caretVirtSel))
				.end
			).toBe(null);
		});

		it('reports start and end cursors correct for none selections', function() {
			expect((new TextGroupSelection(chunkTop, noneVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkTop, noneVirtSel))
				.end
			).toBe(null);

			expect((new TextGroupSelection(chunkMiddle, noneVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkMiddle, noneVirtSel))
				.end
			).toBe(null);

			expect((new TextGroupSelection(chunkBottom, noneVirtSel))
				.start
			).toBe(null);
			expect((new TextGroupSelection(chunkBottom, noneVirtSel))
				.end
			).toBe(null);
		});

		it('reports chunks which are included in the chunk span selection', function() {
			expect((new TextGroupSelection(chunkTop, chunkSpanVirtSel))
				.includes(chunkTop.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkTop, chunkSpanVirtSel))
				.includes(chunkTop.componentContent.textGroup.last)
			).toBe(true);

			expect((new TextGroupSelection(chunkMiddle, chunkSpanVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.first)
			).toBe(true);
			expect((new TextGroupSelection(chunkMiddle, chunkSpanVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.last)
			).toBe(true);

			expect((new TextGroupSelection(chunkBottom, chunkSpanVirtSel))
				.includes(chunkBottom.componentContent.textGroup.first)
			).toBe(true);
			expect((new TextGroupSelection(chunkBottom, chunkSpanVirtSel))
				.includes(chunkBottom.componentContent.textGroup.last)
			).toBe(false);
		});

		it('reports chunks which are included in the text span selection', function() {
			expect((new TextGroupSelection(chunkTop, textSpanVirtSel))
				.includes(chunkTop.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkTop, textSpanVirtSel))
				.includes(chunkTop.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkMiddle, textSpanVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.first)
			).toBe(true);
			expect((new TextGroupSelection(chunkMiddle, textSpanVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkBottom, textSpanVirtSel))
				.includes(chunkBottom.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkBottom, textSpanVirtSel))
				.includes(chunkBottom.componentContent.textGroup.last)
			).toBe(false);
		});

		it('reports chunks which are included in the caret selection', function() {
			expect((new TextGroupSelection(chunkTop, caretVirtSel))
				.includes(chunkTop.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkTop, caretVirtSel))
				.includes(chunkTop.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkMiddle, caretVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.first)
			).toBe(true);
			expect((new TextGroupSelection(chunkMiddle, caretVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkBottom, caretVirtSel))
				.includes(chunkBottom.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkBottom, caretVirtSel))
				.includes(chunkBottom.componentContent.textGroup.last)
			).toBe(false);
		});

		it('reports chunks which are included in the none selection', function() {
			expect((new TextGroupSelection(chunkTop, noneVirtSel))
				.includes(chunkTop.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkTop, noneVirtSel))
				.includes(chunkTop.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkMiddle, noneVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkMiddle, noneVirtSel))
				.includes(chunkMiddle.componentContent.textGroup.last)
			).toBe(false);

			expect((new TextGroupSelection(chunkBottom, noneVirtSel))
				.includes(chunkBottom.componentContent.textGroup.first)
			).toBe(false);
			expect((new TextGroupSelection(chunkBottom, noneVirtSel))
				.includes(chunkBottom.componentContent.textGroup.last)
			).toBe(false);
		});

		it("selects the group", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.selectGroup();

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:0, offset:0 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("selects the text", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.selectText(1);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:1, offset:0 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("sets caret to group start", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.setCaretToGroupStart();

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:0, offset:0 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:0, offset:0 });
		});

		it("sets caret to text start", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.setCaretToTextStart(1);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:1, offset:0 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:0 });
		});

		it("sets caret to group end", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.setCaretToGroupEnd();

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:1, offset:5 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("sets caret to text end", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.setCaretToTextEnd(0);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:0, offset:5 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:0, offset:5 });
		});

		it("sets caret to a specified value", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.setCaret(1, 2);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:1, offset:2 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:2 });
		});

		it("sets start to a specified value", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.selectGroup();
			tgs.setStart(1, 2);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:1, offset:2 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("sets end to a specified value", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.selectGroup();
			tgs.setEnd(1, 2);

			expect(tgs.start.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.start.virtualCursor.data).toEqual({ groupIndex:0, offset:0 });
			expect(tgs.end.virtualCursor.chunk).toBe(chunkTop);
			expect(tgs.end.virtualCursor.data).toEqual({ groupIndex:1, offset:2 });
		});

		it("get all selected texts", function() {
			tgs = new TextGroupSelection(chunkTop, chunkSpanVirtSel);
			tgs.selectGroup();

			selectedTexts = tgs.getAllSelectedTexts();
			expect(selectedTexts.length).toBe(2);
			expect(selectedTexts[0]).toBe(chunkTop.componentContent.textGroup.first);
			expect(selectedTexts[1]).toBe(chunkTop.componentContent.textGroup.last);

			tgs.selectText(1);

			selectedTexts = tgs.getAllSelectedTexts();
			expect(selectedTexts.length).toBe(1);
			expect(selectedTexts[0]).toBe(chunkTop.componentContent.textGroup.last);

			tgs.setCaret(0, 2);

			selectedTexts = tgs.getAllSelectedTexts();
			expect(selectedTexts.length).toBe(1);
			expect(selectedTexts[0]).toBe(chunkTop.componentContent.textGroup.first);

			tgs = new TextGroupSelection(chunkTop, textSpanVirtSel);

			expect(tgs.getAllSelectedTexts().length).toBe(0);
		});

		it("gets cursor data from the DOM", function() {
			cursorData = TextGroupSelection.getCursorDataFromDOM(text1.childNodes[0].childNodes[0], 0);
			expect(cursorData).toEqual({ offset:0, groupIndex:0 })

			cursorData = TextGroupSelection.getCursorDataFromDOM(text1.childNodes[1], 0);
			expect(cursorData).toEqual({ offset:3, groupIndex:0 })

			cursorData = TextGroupSelection.getCursorDataFromDOM(text2.childNodes[3], 1);
			expect(cursorData).toEqual({ offset:13, groupIndex:1 })
		});
	});
});


