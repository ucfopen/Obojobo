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
TextGroupCommandHandler = window.Editor.command.TextGroupCommandHandler;

window.OBO.getChunks( function(chunks) {
	chunks.forEach(function(chunkClass, type) {
		ComponentClassMap.register(type, chunkClass);
	});
	ComponentClassMap.setDefault(OBO.defaultChunk);

	describe('TextGroupCommandHandler', function() {
		beforeEach(function() {
			// ch = new TextGroupCommandHandler();

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

			// doc = document.createElement('div');

			document.body.innerHTML = '<div class="component" data-component-index="0" id="chunkTop"><div data-group-index="0"><p>T-abc</p></div><div data-group-index="1"><p>1T-23</p></div></div><div class="component" data-component-index="1" id="chunkMiddle"><div data-group-index="0"><p>M-abc</p></div><div data-group-index="1"><p>1M-23</p></div></div><div class="component" data-component-index="2" id="chunkBottom"><div data-group-index="0"><p>B-abc</p></div><div data-group-index="1"><p>1B-23</p></div></div>';


			domSelection = DOMSelection.set(document.body.childNodes[1].childNodes[0].childNodes[0].childNodes[0], 1, document.body.childNodes[1].childNodes[0].childNodes[0].childNodes[0], 4);

			// Little hack since the fromDOMSelection method
			// calls getVirtualSelectionStartData on the chunks
			// which will send editor.state.selection to the
			// getVirtualSelectionStartData method in that chunk's
			// commandHandler (in this case TextGroupCommandHandler)
			//
			FakeSelectionClass = function() {
				this.savedSelection = null;
				this.virtual = chunkSpanVirtSel;
				this.dom = domSelection;
			};
			FakeSelectionClass.prototype.saveVirtualSelection = function() {
				this.savedSelection = module.editor.state.selection.virtual.clone();
			};

			FakeSelectionClass.prototype.restoreVirtualSelection = function() {
				module.editor.state.selection.virtual = this.savedSelection;
			};
			Object.defineProperties(FakeSelectionClass.prototype, {
				startChunk: { get: function() {
					if(!module.editor.state.selection.virtual.start)
					{
						return null;
					}
					return module.editor.state.selection.virtual.start.chunk;
				}},
				endChunk: { get: function() {
					if(!module.editor.state.selection.virtual.end)
					{
						return null;
					}
					return module.editor.state.selection.virtual.end.chunk;
				}},
			});

			module.editor = {
				state: {
					selection: new FakeSelectionClass
				}
			};


			// The SingleText chunks override the default TextGroupCommandHandler slightly,
			// so here is a hack to make sure they're using just the default class
			newGetCommandHandlerFn = function() {
				return new TextGroupCommandHandler();
			};
			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;
			// chunkMiddle.getComponent().getCommandHandler = newGetCommandHandlerFn;
			// chunkBottom.getComponent().getCommandHandler = newGetCommandHandlerFn;
		});

		it('returns a caret edge of none when caret not at edge', function() {
			expect(chunkTop.getCaretEdge()).toBe('none')
		});

		it('returns a caret edge of start when caret at start of text', function() {
			chunkSpanVirtSel.start.data = { groupIndex:0, offset:0 };
			chunkSpanVirtSel.collapse();
			expect(chunkTop.getCaretEdge()).toBe('start');
		});

		it('returns a caret edge of end when caret at start of text', function() {
			chunkSpanVirtSel.start.data = { groupIndex:1, offset:chunkTop.componentContent.textGroup.last.text.length };
			chunkSpanVirtSel.collapse();
			expect(chunkTop.getCaretEdge()).toBe('end');
		});

		it('returns a caret edge of startAndEnd when caret in a blank chunk', function() {
			chunkTop.revert();
			chunkTop.selectAll();
			expect(chunkTop.getCaretEdge()).toBe('startAndEnd');
		});

		it('returns a caret edge of none when selection not in chunk', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;
			expect(chunkTop.getCaretEdge()).toBe('none');
		});

		it('returns if a chunk is empty', function() {
			expect(chunkTop.isEmpty()).toBe(false);

			chunkTop.revert();
			expect(chunkTop.isEmpty()).toBe(true);
		});

		it('can remove siblings', function() {
			expect(chunkTop.canRemoveSibling()).toBe(true);
		});

		it('inserts text and sets caret to the end of the newly selected text', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.insertText('NEW');

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-2NEW3'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:7 });
			expect(s.start).toEqual(s.end);
		});

		it('inserts text while styling it at the same time', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.componentContent.textGroup.last.text.styleText('a');

			chunkTop.insertText('NEW', ['b', 'i'], ['a']);

			compare = new StyleableText('1T-2NEW3');
			compare.styleText('a', 0, 4);
			compare.styleText('a', 7, 8);
			compare.styleText('b', 4, 7);
			compare.styleText('i', 4, 7);

			expect(chunkTop.componentContent.textGroup.last.text).toEqual(compare);
		});

		it('deletes characters and moves caret', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.deleteText();

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-3'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:3 });
			expect(s.start).toEqual(s.end);
		});

		it('deletes characters forward', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.deleteText(true);

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-2'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:4 });
			expect(s.start).toEqual(s.end);
		});

		it('splits text on enter', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.splitText();
			cc1 = chunkTop.componentContent.textGroup.toDescriptor();

			beforeEach();


			chunkSpanVirtSel.collapse();
			chunkTop.onEnter();
			cc2 = chunkTop.componentContent.textGroup.toDescriptor();

			expect(cc1).toEqual(cc2);
		});

		it('splits text and moves caret to start of new text', function() {
			chunkSpanVirtSel.collapse();
			chunkTop.splitText();

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(3);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2'));
			expect(tg.last.text).toEqual(new StyleableText('3'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:2, offset:0 });
			expect(s.start).toEqual(s.end);
		});

		it('deletes the selected portion of text and sets caret to start of selection portion', function() {
			chunkTop.deleteSelection();

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-2'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:4 });
			expect(s.start).toEqual(s.end);
		});

		it('deletes the selected portion of text for chunks within the selection', function() {
			prevSelection = module.editor.state.selection.virtual.clone();
			chunkMiddle.deleteSelection();

			tg = chunkMiddle.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText(''));

			s = module.editor.state.selection.virtual;
			expect(s).toEqual(prevSelection);
		});

		it('deletes the selected portion of text for chunks in the end of the selection and sets the end of the selection to the start of the group', function() {
			prevSelection = module.editor.state.selection.virtual.clone();
			chunkBottom.deleteSelection();

			tg = chunkBottom.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('-abc'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('chunkSpan');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkBottom);
			expect(s.start.data).toEqual({ groupIndex:1, offset:4 });
			expect(s.end.data).toEqual({ groupIndex:0, offset:0 });
		});

		it('gets a copy of the selection for a chunk in the start of the selection', function() {
			clone = chunkTop.getCopyOfSelection();
			tg = clone.componentContent.textGroup;

			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('3'));
		});

		it('gets a copy of the selection for a chunk inside the selection', function() {
			clone = chunkMiddle.getCopyOfSelection();
			expect(chunkMiddle.componentContent.textGroup).toEqual(clone.componentContent.textGroup);
		});

		it('gets a copy of the selection for a chunk in the end of the selection', function() {
			clone = chunkTop.getCopyOfSelection();
			tg = clone.componentContent.textGroup;

			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('3'));
		});

		it('gets a copy of the selection for a chunk which contains the selection', function() {
			module.editor.state.selection.virtual = textSpanVirtSel
			clone = chunkMiddle.getCopyOfSelection();
			tg = clone.componentContent.textGroup;

			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('-ab'));
		});

		it('styles the selection', function() {
			chunkTop.styleSelection('a', { href:'www.google.com' });

			topStyledText = new StyleableText('T-abc');
			botStyledText = new StyleableText('1T-23');
			botStyledText.styleText('a', 4, 5, { href:'www.google.com' });

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(topStyledText);
			expect(tg.last.text).toEqual(botStyledText);
		});

		it('unstyles the selection', function() {
			chunkTop.componentContent.textGroup.last.text.styleText('a', 0, 5, { href:'www.google.com' });
			chunkTop.unstyleSelection('a');

			topStyledText = new StyleableText('T-abc');
			botStyledText = new StyleableText('1T-23');
			botStyledText.styleText('a', 0, 4, { href:'www.google.com' });

			tg = chunkTop.componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(topStyledText);
			expect(tg.last.text).toEqual(botStyledText);
		});

		it('gets the selection styles of a chunk in the start of the selection', function() {
			chunkTop.styleSelection('a', { href:'www.google.com' });
			styles = chunkTop.getSelectionStyles();

			expect(styles).toEqual({ a:'a' });
		});

		it('gets the selection styles of a chunk within the selection', function() {
			chunkMiddle.styleSelection('a', { href:'www.google.com' });
			styles = chunkMiddle.getSelectionStyles();

			expect(styles).toEqual({ a:'a' });
		});

		it('gets the selection styles of a chunk in the end of the selection', function() {
			chunkBottom.styleSelection('a', { href:'www.google.com' });
			styles = chunkBottom.getSelectionStyles();

			expect(styles).toEqual({ a:'a' });
		});

		it('gets the selection styles of a chunk that contains the selection', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;
			chunkMiddle.styleSelection('a', { href:'www.google.com' });
			styles = chunkMiddle.getSelectionStyles();

			expect(styles).toEqual({ a:'a' });
		});

		it('replies that a chunk can merge with another chunk of similar type', function() {
			expect(chunkTop.canMergeWith(chunkMiddle)).toBe(true);
		});

		it('replies that a chunk cannot merge with another chunk of another type', function() {
			chunkMiddle.componentContent = {};
			expect(chunkTop.canMergeWith(chunkMiddle)).toBe(false);
		});

		it("merges with another chunk, digesting that chunk's content, merging text, removes it and sets the caret at the merge point", function() {
			chunkTop.merge(chunkMiddle);
			module.editor.state.selection.virtual.collapse();

			ttg = chunkTop.componentContent.textGroup;
			mtg = chunkMiddle.componentContent.textGroup;

			expect(ttg.length).toBe(3);
			expect(ttg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(ttg.get(1).text).toEqual(new StyleableText('1T-23M-abc'));
			expect(ttg.get(2).text).toEqual(new StyleableText('1M-23'));
			expect(chunkTop.isOrphan()).toBe(false);

			expect(mtg.length).toBe(0);
			expect(chunkMiddle.isOrphan()).toBe(true);

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("merges with another chunk, digesting that chunk's content, optionally doesn't merge text, removes it and sets the caret at the merge point", function() {
			chunkTop.merge(chunkMiddle, false);
			module.editor.state.selection.virtual.collapse();

			ttg = chunkTop.componentContent.textGroup;
			mtg = chunkMiddle.componentContent.textGroup;

			expect(ttg.length).toBe(4);
			expect(ttg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(ttg.get(1).text).toEqual(new StyleableText('1T-23'));
			expect(ttg.get(2).text).toEqual(new StyleableText('M-abc'));
			expect(ttg.get(3).text).toEqual(new StyleableText('1M-23'));
			expect(chunkTop.isOrphan()).toBe(false);

			expect(mtg.length).toBe(0);
			expect(chunkMiddle.isOrphan()).toBe(true);

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it("indents all selected texts", function() {
			chunkTop.indent();
			chunkMiddle.indent();
			chunkBottom.indent();

			ttg = chunkTop.componentContent.textGroup;
			mtg = chunkMiddle.componentContent.textGroup;
			btg = chunkBottom.componentContent.textGroup;

			expect(ttg.length).toBe(2);
			expect(ttg.first.data).toEqual({ indent:0 });
			expect(ttg.last.data).toEqual({ indent:1 });

			expect(mtg.length).toBe(2);
			expect(mtg.first.data).toEqual({ indent:1 });
			expect(mtg.last.data).toEqual({ indent:1 });

			expect(btg.length).toBe(2);
			expect(btg.first.data).toEqual({ indent:1 });
			expect(btg.last.data).toEqual({ indent:1 });
		});

		it("indents all texts if the selection ends in the first text", function() {
			chunkTop.selectStart();
			chunkTop.indent();

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.data).toEqual({ indent:1 });
			expect(tg.last.data).toEqual({ indent:1 });
		});

		it("indents text on tab when the selection spans texts/chunks", function() {
			chunkTop.onTab();

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.data).toEqual({ indent:0 });
			expect(tg.last.data).toEqual({ indent:1 });
		});

		it("indents on tab when the selection is a caret at the start of a text", function() {
			chunkTop.selectStart();
			chunkTop.onTab();

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.data).toEqual({ indent:1 });
			expect(tg.last.data).toEqual({ indent:1 });
		});

		it("inserts tab characters on tab when the selection is a caret after the start of the text", function() {
			module.editor.state.selection.virtual.collapse();
			chunkTop.onTab();

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-2	3'));
		});

		it('returns false when pasting in text only', function() {
			initSel = module.editor.state.selection.virtual.clone();
			clone = chunkTop.clone();

			expect(chunkTop.paste('text', null, [])).toBe(false);

			chunkTop.replaceWith(clone);
			module.editor.state.selection.virtual = initSel;

			expect(chunkTop.componentContent.textGroup).toEqual(clone.componentContent.textGroup);
		});

		it('pasting external html will insert the content at the cursor position and move cursor to end of pasted content', function() {
			module.editor.state.selection.virtual.collapse();

			html = '<p>some<b>bold</b>text</p>';

			chunkTop.paste('', html, []);

			tg = chunkTop.componentContent.textGroup;

			st = new StyleableText('1T-2someboldtext3');
			st.styleText('b', 8, 12);

			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(st);

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:16 });
		});

		it('pasting external html will insert the content at the start of a group and move cursor to end of pasted content', function() {
			chunkTop.selectStart();

			html = '<p>new-text</p>';

			chunkTop.paste('', html, []);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('new-textT-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:0, offset:8 });
		});

		it('pasting external html will insert the content at the end of a group and move cursor to end of that group', function() {
			chunkTop.selectEnd();

			html = '<p>new-text</p>';

			chunkTop.paste('', html, []);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('T-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1T-23new-text'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:13 });
		});

		it('pasting one chunk will insert the content at the cursor position and move cursor to end of pasted content', function() {
			module.editor.state.selection.virtual.collapse();

			chunkBottom.remove();

			chunkTop.paste('', '', [chunkBottom]);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(3);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2B-abc'));
			expect(tg.get(2).text).toEqual(new StyleableText('1B-233'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:2, offset:5 });
		});

		it('pasting one chunk will insert the content at the start of the group and move cursor to end of pasted content', function() {
			chunkTop.selectStart();

			chunkBottom.remove();

			chunkTop.paste('', '', [chunkBottom]);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(3);
			expect(tg.get(0).text).toEqual(new StyleableText('B-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1B-23T-abc'));
			expect(tg.get(2).text).toEqual(new StyleableText('1T-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it('pasting one chunk will insert the content at the end of the group and move cursor to end of that group', function() {
			chunkTop.selectEnd();

			chunkBottom.remove();

			chunkTop.paste('', '', [chunkBottom]);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(3);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-23B-abc'));
			expect(tg.get(2).text).toEqual(new StyleableText('1B-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:2, offset:5 });
		});

		it('pasting multiple chunks inside similar chunks will insert the content at the cursor position, merge it with the cursor position and move cursor to end of pasted content', function() {
			module.editor.state.selection.virtual.collapse();

			chunkMiddle.remove();
			chunkBottom.remove();

			index = chunkTop.get('index');
			chunkTop.paste('', '', [chunkMiddle, chunkBottom]);
			chunkTop = module.chunks.at(index);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(3);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2M-abc'));
			expect(tg.get(2).text).toEqual(new StyleableText('1M-23'));

			tg = chunkTop.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('B-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1B-233'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop.nextSibling());
			expect(s.end.chunk).toBe(chunkTop.nextSibling());
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it('pasting multiple chunks inside dis-similar chunks will insert the content at the cursor position and move cursor to end of pasted content', function() {
			newGetCommandHandlerFn = function() {
				ch = new TextGroupCommandHandler();
				ch.canMergeWith = function() { return false; }

				return ch;
			};

			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;

			module.editor.state.selection.virtual.collapse();

			chunkMiddle.remove();
			chunkBottom.remove();

			index = chunkTop.get('index');
			chunkTop.paste('', '', [chunkMiddle, chunkBottom]);
			chunkTop = module.chunks.at(index);

			tg = chunkTop.componentContent.textGroup;

			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2'));

			tg = chunkTop.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('M-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1M-23'));

			tg = chunkTop.nextSibling().nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('B-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1B-23'));

			tg = chunkTop.nextSibling().nextSibling().nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.get(0).text).toEqual(new StyleableText('3'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop.nextSibling().nextSibling());
			expect(s.end.chunk).toBe(chunkTop.nextSibling().nextSibling());
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it('pasting a chunk inside dis-similar chunks returns false', function() {
			newGetCommandHandlerFn = function() {
				ch = new TextGroupCommandHandler();
				ch.canMergeWith = function() { return false; }

				return ch;
			};

			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;

			module.editor.state.selection.virtual.collapse();

			chunkMiddle.remove();

			index = chunkTop.get('index');
			expect(chunkTop.paste('', '', [chunkMiddle])).toBe(false);
		});

		it('reports that it accepts absorb when chunks are similar', function() {
			expect(chunkTop.acceptAbsorb(chunkMiddle)).toBe(true);
		});

		it('reports that it does not accept absorb when chunks are the same', function() {
			expect(chunkTop.acceptAbsorb(chunkTop)).toBe(false);
		});

		it('reports that it does not accept absorb when chunks are dis-similar', function() {
			chunkMiddle.componentContent = {};
			expect(chunkTop.acceptAbsorb(chunkMiddle)).toBe(false);
		});

		it('can absorb another chunk, stealing its content and removing it from the module', function() {
			clone = chunkTop.clone();

			newChunk = Chunk.create();
			newChunk.absorb(chunkTop);

			expect(newChunk.componentContent).toEqual(clone.componentContent);
			expect(chunkTop.isOrphan()).toBe(true);
			expect(chunkTop.componentContent.textGroup.isEmpty).toBe(true);
		});

		it('will split a chunk with a span of text selected into three chunks with the middle chunk containing the selection and with the selection set to the split chunk', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;

			splitChunks = chunkMiddle.split();

			expect(splitChunks.prev).toBe(chunkMiddle.prevSibling());
			expect(splitChunks.next).toBe(chunkMiddle.nextSibling());

			//M[-ab]c
			//1M-23

			tg = chunkMiddle.prevSibling().componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('M'));

			tg = chunkMiddle.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('-ab'));

			tg = chunkMiddle.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('c'));
			expect(tg.last.text).toEqual(new StyleableText('1M-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('textSpan');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
			expect(s.end.data).toEqual({ groupIndex:0, offset:3 });
		});

		it('will split a chunk with a caret selection into three chunks with the middle chunk being blank and with the selection set to the split chunk', function() {
			module.editor.state.selection.virtual = caretVirtSel;

			splitChunks = chunkMiddle.split();

			expect(splitChunks.prev).toBe(chunkMiddle.prevSibling());
			expect(splitChunks.next).toBe(chunkMiddle.nextSibling());

			//M|-abc
			//1M-23

			tg = chunkMiddle.prevSibling().componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText('M'));

			tg = chunkMiddle.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText(''));

			tg = chunkMiddle.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1M-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
		});

		it('will split a chunk with a caret selection at the start of the chunk into two chunks with the selection set to the split chunk', function() {
			chunkMiddle.selectStart();

			splitChunks = chunkMiddle.split();

			expect(splitChunks.prev).toBe(null);
			expect(splitChunks.next).toBe(chunkMiddle.nextSibling());

			//|M-abc
			//1M-23

			expect(chunkMiddle.prevSibling()).toBe(chunkTop);

			tg = chunkMiddle.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText(''));

			tg = chunkMiddle.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('M-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1M-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
		});

		it('will split a chunk with a caret selection at the end of the chunk into two chunks with the selection set to the split chunk', function() {
			chunkMiddle.selectEnd();

			splitChunks = chunkMiddle.split();

			expect(splitChunks.prev).toBe(chunkMiddle.prevSibling());
			expect(splitChunks.next).toBe(null);

			//|M-abc
			//1M-23

			expect(chunkMiddle.nextSibling()).toBe(chunkBottom);

			tg = chunkMiddle.prevSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.first.text).toEqual(new StyleableText('M-abc'));
			expect(tg.last.text).toEqual(new StyleableText('1M-23'));

			tg = chunkMiddle.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.first.text).toEqual(new StyleableText(''));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
		});

		it('can update chunk with new text inserted via dom input event', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;

			s = chunkMiddle.getDOMStateBeforeInput();

			// Modify dom (simulating a right-click spell-check type change)
			document.getElementById('chunkMiddle').childNodes[0].innerHTML = '<p>M!new-stuff!c</p>';

			m = chunkMiddle.getDOMModificationAfterInput(s);
			chunkMiddle.applyDOMModification(m);

			expect(chunkMiddle.componentContent.textGroup.length).toBe(2);
			expect(chunkMiddle.componentContent.textGroup.first.text).toEqual(new StyleableText('M!new-stuff!c'));
			expect(chunkMiddle.componentContent.textGroup.last.text).toEqual(new StyleableText('1M-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:12 });
		});

		it('can update chunk with removed text via dom input event', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;

			s = chunkMiddle.getDOMStateBeforeInput();

			// Modify dom (simulating a right-click spell-check type change)
			document.getElementById('chunkMiddle').childNodes[0].innerHTML = '<p>Mc</p>';

			m = chunkMiddle.getDOMModificationAfterInput(s);
			chunkMiddle.applyDOMModification(m);

			expect(chunkMiddle.componentContent.textGroup.length).toBe(2);
			expect(chunkMiddle.componentContent.textGroup.first.text).toEqual(new StyleableText('Mc'));
			expect(chunkMiddle.componentContent.textGroup.last.text).toEqual(new StyleableText('1M-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkMiddle);
			expect(s.end.chunk).toBe(chunkMiddle);
			expect(s.start.data).toEqual({ groupIndex:0, offset:1 });
		});

		it('can change selection to a caret at the start of a chunk', function() {
			chunkTop.selectStart();

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
		});

		it('can change start of selection to start of a chunk', function() {
			chunkTop.selectStart(true);

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('chunkSpan');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkBottom);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
			expect(s.end.data).toEqual({ groupIndex:0, offset:1 });
		});

		it('can change selection to a caret at the end of a chunk', function() {
			chunkTop.selectEnd();

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:5 });
		});

		it('can change start of selection to end of a chunk', function() {
			chunkTop.selectEnd(true);

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('textSpan');
			expect(s.start.chunk).toBe(chunkTop);
			expect(s.end.chunk).toBe(chunkTop);
			expect(s.start.data).toEqual({ groupIndex:1, offset:4 });
			expect(s.end.data).toEqual({ groupIndex:1, offset:5 });
		});

		it('should return valid objects for text menu commands', function() {
			tmc = chunkTop.getTextMenuCommands();

			expect(tmc.length).toBeTruthy();

			tmc.map(function(command) {
				expect(typeof command.label).toBe('string');
				expect(typeof command.fn).toBe('function');
			});
		});

		it('should return a virtual selection that matches the dom selection', function() {
			expect(chunkMiddle.getVirtualSelectionStartData()).toEqual({ groupIndex:0, offset:1 });
			expect(chunkMiddle.getVirtualSelectionEndData()).toEqual({ groupIndex:0, offset:4 });
		});

		it('should return a dom selection that matches the virtual selection', function() {
			module.editor.state.selection.virtual = textSpanVirtSel;

			node = document.getElementById('chunkMiddle').childNodes[0].childNodes[0].childNodes[0];
			expect(chunkMiddle.getDOMSelectionStart()).toEqual({ textNode:node, offset:1 });
			expect(chunkMiddle.getDOMSelectionEnd()).toEqual({ textNode:node, offset:4 });
		});

		it('should report if two cursors are equivalent', function() {
			expect(chunkTop.areCursorsEquivalent(
				new VirtualCursor(chunkTop, { offset:0, groupIndex:0 }),
				new VirtualCursor(chunkTop, { offset:0, groupIndex:1 })
			)).toBe(false);

			expect(chunkTop.areCursorsEquivalent(
				new VirtualCursor(chunkTop, { offset:0, groupIndex:0 }),
				new VirtualCursor(chunkMiddle, { offset:0, groupIndex:0 })
			)).toBe(false);

			expect(chunkTop.areCursorsEquivalent(
				new VirtualCursor(chunkTop, { offset:0, groupIndex:0 }),
				new VirtualCursor(chunkTop, { offset:0, groupIndex:0 })
			)).toBe(true);
		});

		it("replaces the selection for chunks which implement the TextGroupCommandHandler and selects the chunk which replaced the selection", function() {
			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;

			newChunk = Chunk.create();
			chunkTop.addChunkBefore(newChunk);

			newChunk.replaceSelection();

			tg = newChunk.prevSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2'));

			tg = newChunk.componentContent.textGroup;
			expect(tg.length).toBe(4);
			expect(tg.get(0).text).toEqual(new StyleableText('3'));
			expect(tg.get(1).text).toEqual(new StyleableText('M-abc'));
			expect(tg.get(2).text).toEqual(new StyleableText('1M-23'));
			expect(tg.get(3).text).toEqual(new StyleableText('B'));

			tg = newChunk.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1B-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('textSpan');
			expect(s.start.chunk).toBe(newChunk);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
			expect(s.end.data).toEqual({ groupIndex:3, offset:1 });
		});

		it("replaces the selection (which is a caret) for chunks which implement the TextGroupCommandHandler and selects the chunk which replaced the selection", function() {
			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;

			module.editor.state.selection.virtual.collapse();

			newChunk = Chunk.create();
			chunkTop.addChunkBefore(newChunk);

			newChunk.replaceSelection();

			tg = newChunk.prevSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-2'));

			tg = newChunk.componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.get(0).text).toEqual(new StyleableText(''));

			tg = newChunk.nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(1);
			expect(tg.get(0).text).toEqual(new StyleableText('3'));

			tg = newChunk.nextSibling().nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('M-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1M-23'));

			tg = newChunk.nextSibling().nextSibling().nextSibling().componentContent.textGroup;
			expect(tg.length).toBe(2);
			expect(tg.get(0).text).toEqual(new StyleableText('B-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1B-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('caret');
			expect(s.start.chunk).toBe(newChunk);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
			expect(s.end.data).toEqual(s.start.data);
		});

		it("replaces the selection (which has the whole document selected) for chunks which implement the TextGroupCommandHandler and selects the chunk which replaced the selection", function() {
			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;

			chunkTop.selectStart(true);
			chunkBottom.selectEnd(true);

			newChunk = Chunk.create();
			chunkTop.addChunkBefore(newChunk);

			newChunk.replaceSelection();

			tg = newChunk.componentContent.textGroup;
			expect(tg.length).toBe(6);
			expect(tg.get(0).text).toEqual(new StyleableText('T-abc'));
			expect(tg.get(1).text).toEqual(new StyleableText('1T-23'));
			expect(tg.get(2).text).toEqual(new StyleableText('M-abc'));
			expect(tg.get(3).text).toEqual(new StyleableText('1M-23'));
			expect(tg.get(4).text).toEqual(new StyleableText('B-abc'));
			expect(tg.get(5).text).toEqual(new StyleableText('1B-23'));

			s = module.editor.state.selection.virtual;
			expect(s.type).toBe('textSpan');
			expect(s.start.chunk).toBe(newChunk);
			expect(s.start.data).toEqual({ groupIndex:0, offset:0 });
			expect(s.end.data).toEqual({ groupIndex:5, offset:5 });
		});

		it('dirtys chunks', function() {
			// These methods should not dirty the chunk:
			chunkTop.dirty = false;
			chunkTop.getCaretEdge();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.isEmpty();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getCopyOfSelection();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getSelectionStyles();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkMiddle.dirty = false;
			chunkTop.canMergeWith(chunkMiddle);
			expect(chunkTop.dirty).toBe(false);
			expect(chunkMiddle.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkMiddle.dirty = false;
			chunkTop.acceptAbsorb(chunkMiddle);
			expect(chunkTop.dirty).toBe(false);
			expect(chunkMiddle.dirty).toBe(false);

			chunkTop.dirty = false;
			s = chunkTop.getDOMStateBeforeInput();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getDOMModificationAfterInput(s);
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getTextMenuCommands();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getVirtualSelectionStartData();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getVirtualSelectionEndData();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getDOMSelectionStart();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.getDOMSelectionEnd();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.areCursorsEquivalent(new VirtualCursor(chunkTop, {}), new VirtualCursor(chunkTop, {}));
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.selectStart();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.selectEnd();
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.selectAll();
			expect(chunkTop.dirty).toBe(false);


			// These methods should dirty the chunk:
			chunkTop.dirty = false;
			chunkTop.insertText('t');
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.deleteText();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.splitText();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.deleteSelection();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.styleSelection('b');
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.unstyleSelection('b');
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkMiddle.dirty = false;
			chunkTop.merge(chunkMiddle);
			expect(chunkTop.dirty).toBe(true);
			expect(chunkMiddle.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.indent();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.onTab();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.insertText('t');
			expect(chunkTop.dirty).toBe(true);

			newChunk = Chunk.create();
			newChunk.dirty = false;
			newChunk.absorb(chunkMiddle);
			expect(newChunk.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.split();
			expect(chunkTop.dirty).toBe(true);

			chunkTop.dirty = false;
			chunkTop.applyDOMModification({text:'text'});
			expect(chunkTop.dirty).toBe(true);


			// This method may or may not dirty the chunk depending on arguments
			chunkTop.dirty = false;
			chunkTop.paste('text', '', []);
			expect(chunkTop.dirty).toBe(false);

			chunkTop.dirty = false;
			chunkTop.paste('', '<p>test</p>', []);
			expect(chunkTop.dirty).toBe(true);

			newChunk = Chunk.create();
			chunkBottom.addChunkAfter(newChunk);
			chunkTop.dirty = false;
			chunkTop.paste('', '', [newChunk]);
			expect(chunkTop.dirty).toBe(true);

			newChunk1 = Chunk.create();
			newChunk2 = Chunk.create();
			chunkBottom.addChunkAfter(newChunk1);
			chunkBottom.addChunkAfter(newChunk2);
			chunkTop.dirty = false;
			chunkTop.paste('', '', [newChunk1, newChunk2]);
			expect(chunkTop.dirty).toBe(true);
		});
	});
});