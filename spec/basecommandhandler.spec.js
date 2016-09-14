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
BaseCommandHandler = window.ObojoboDraft.command.BaseCommandHandler;
TextGroupCommandHandler = window.Editor.command.TextGroupCommandHandler;

window.OBO.getChunks( function(chunks) {
	chunks.forEach(function(chunkClass, type) {
		ComponentClassMap.register(type, chunkClass);
	});
	ComponentClassMap.setDefault(OBO.defaultChunk);

	describe('BaseCommandHandler', function() {
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

			chunkSpanVirtSel = new VirtualSelection(module);
			chunkSpanVirtSel.setStart(chunkTop, { groupIndex: 1, offset: 4});
			chunkSpanVirtSel.setEnd(chunkBottom, { groupIndex: 0, offset: 1});

			textSpanVirtSel = new VirtualSelection(module);
			textSpanVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
			textSpanVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 4});

			caretVirtSel = new VirtualSelection(module);
			caretVirtSel.setStart(chunkMiddle, { groupIndex: 0, offset: 1});
			caretVirtSel.setEnd(chunkMiddle, { groupIndex: 0, offset: 1});

			noneVirtSel = new VirtualSelection(module);

			// Little hack since the fromDOMSelection method
			// calls getVirtualSelectionStartData on the chunks
			// which will send editor.state.selection to the
			// getVirtualSelectionStartData method in that chunk's
			// commandHandler (in this case TextGroupCommandHandler)
			FakeSelectionClass = function() {
				this.savedSelection = null;
				this.virtual = chunkSpanVirtSel;
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

			// Hack to make sure they're using just the default class
			newGetCommandHandlerFn = function() {
				return new BaseCommandHandler();
			};
			chunkTop.getComponent().getCommandHandler = newGetCommandHandlerFn;
		});

		it("attempts to replace the selection", function() {
			newChunk = Chunk.create();
			chunkTop.addChunkBefore(newChunk);
			newChunk.replaceSelection();

			expect(newChunk.componentContent.textGroup.isBlank).toBe(true);
		});

		it("replaces the selection for chunks which implement the TextGroupCommandHandler and selects the chunk which replaced the selection", function() {
			newGetCommandHandlerFn = function() {
				return new TextGroupCommandHandler();
			};
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
			newGetCommandHandlerFn = function() {
				return new TextGroupCommandHandler();
			};
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
			newGetCommandHandlerFn = function() {
				return new TextGroupCommandHandler();
			};
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

		it('returns a complete clone when getting a copy of the selection', function() {
			clone = chunkTop.getCopyOfSelection();
			expect(clone.componentContent).toEqual(chunkTop.componentContent);
		});

		it('returns an empty array when getting selection styles', function() {
			chunkTop.componentContent.textGroup.first.text.styleText('b');
			expect(chunkTop.getSelectionStyles()).toEqual([]);
		});

		it('removes a chunk to be merged', function() {
			chunkTop.merge(chunkMiddle);
			expect(chunkMiddle.isOrphan()).toBe(true);
		});

		it('never returns any text commands', function() {
			expect(chunkTop.getTextMenuCommands()).toEqual([]);
		});

		it('caret edge always returns startAndEnd', function() {
			expect(chunkTop.getCaretEdge()).toBe('startAndEnd');
		});

		it('isEmpty returns false', function() {
			expect(chunkTop.isEmpty()).toBe(false);
		});

		it('canRemoveSibling returns false', function() {
			expect(chunkTop.canRemoveSibling()).toBe(false);
		});

		it('insertText returns false', function() {
			expect(chunkTop.insertText()).toBe(false);
		});

		it('deleteText returns false', function() {
			expect(chunkTop.deleteText()).toBe(false);
		});

		it('onEnter returns false', function() {
			expect(chunkTop.onEnter()).toBe(false);
		});

		it('splitText returns false', function() {
			expect(chunkTop.splitText()).toBe(false);
		});

		it('deleteSelection returns false', function() {
			expect(chunkTop.deleteSelection()).toBe(false);
		});

		it('styleSelection returns false', function() {
			expect(chunkTop.styleSelection()).toBe(false);
		});

		it('unstyleSelection returns false', function() {
			expect(chunkTop.unstyleSelection()).toBe(false);
		});

		it('canMergeWith returns false', function() {
			expect(chunkTop.canMergeWith()).toBe(false);
		});

		it('indent returns false', function() {
			expect(chunkTop.indent()).toBe(false);
		});

		it('onTab returns false', function() {
			expect(chunkTop.onTab()).toBe(false);
		});

		it('acceptAbsorb returns false', function() {
			expect(chunkTop.acceptAbsorb()).toBe(false);
		});

		it('absorb returns false', function() {
			expect(chunkTop.absorb()).toBe(false);
		});

		it('split returns false', function() {
			expect(chunkTop.split()).toBe(false);
		});

		it('canRemoveSibling returns false', function() {
			expect(chunkTop.canRemoveSibling()).toBe(false);
		});

		it('getDOMStateBeforeInput returns null', function() {
			expect(chunkTop.getDOMStateBeforeInput()).toBe(null);
		});

		it('getDOMModificationAfterInput returns null', function() {
			expect(chunkTop.getDOMModificationAfterInput()).toBe(null);
		});

		it('applyDOMModification returns null', function() {
			expect(chunkTop.applyDOMModification()).toBe(null);
		});

		it('selectStart returns false', function() {
			expect(chunkTop.selectStart()).toBe(false);
		});

		it('selectEnd returns false', function() {
			expect(chunkTop.selectEnd()).toBe(false);
		});

		it('selectAll returns false', function() {
			expect(chunkTop.selectAll()).toBe(false);
		});

		it('onSelectAll returns false', function() {
			expect(chunkTop.onSelectAll()).toBe(false);
		});

		it('paste returns false', function() {
			expect(chunkTop.paste()).toBe(false);
		});

		it('areCursorsEquivalent returns false', function() {
			expect(chunkTop.areCursorsEquivalent()).toBe(false);
		});

		it('getVirtualSelectionStartData returns null', function() {
			expect(chunkTop.getVirtualSelectionStartData()).toBe(null);
		});

		it('getVirtualSelectionEndData returns null', function() {
			expect(chunkTop.getVirtualSelectionEndData()).toBe(null);
		});

		it('getDOMSelectionStart returns null', function() {
			expect(chunkTop.getDOMSelectionStart()).toBe(null);
		});

		it('getDOMSelectionEnd returns null', function() {
			expect(chunkTop.getDOMSelectionEnd()).toBe(null);
		});

		it('dirtys chunks where appropriate', function() {
			['getCaretEdge', 'isEmpty', 'canRemoveSibling', 'insertText', 'deleteText', 'onEnter', 'splitText', 'deleteSelection', 'getCopyOfSelection', 'styleSelection', 'unstyleSelection', 'getSelectionStyles', 'canMergeWith', 'indent', 'onTab', 'acceptAbsorb', 'absorb', 'split', 'getDOMStateBeforeInput', 'getDOMModificationAfterInput', 'applyDOMModification', 'selectStart', 'selectEnd', 'selectAll', 'onSelectAll', 'getTextMenuCommands', 'paste', 'getVirtualSelectionStartData', 'getVirtualSelectionEndData', 'getDOMSelectionStart', 'getDOMSelectionEnd', 'areCursorsEquivalent'].map(function(fn) {
				chunkTop.dirty = false;
				chunkTop[fn]();
				expect(chunkTop.dirty).toBe(false);
			});

			chunkTop.dirty = false;
			chunkTop.merge(chunkMiddle);
			expect(chunkTop.dirty).toBe(false);
		});

	});
});