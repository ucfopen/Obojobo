VirtualCursor    = window.ObojoboDraft.oboDOM.Selection.VirtualCursor;
StyleableText    = window.ObojoboDraft.text.StyleableText;
TextGroupCursor  = window.ObojoboDraft.text.TextGroupCursor;
Chunk            = window.ObojoboDraft.models.Chunk;
TextGroup        = window.ObojoboDraft.text.TextGroup;
ComponentClassMap        = window.ObojoboDraft.util.ComponentClassMap;

window.OBO.getChunks( function(chunks) {
	chunks.forEach(function(chunkClass, type) {
		ComponentClassMap.register(type, chunkClass);
	});
	ComponentClassMap.setDefault(OBO.defaultChunk);

	describe('TextGroupCursor', function() {
		beforeEach(function() {
			chunk = Chunk.create();
			chunk.componentContent.textGroup.first.text.insertText(0, "abc123");
			chunk.componentContent.textGroup.splitText(0, 3);

			groupStart = new VirtualCursor(chunk, { groupIndex:0, offset:0 });
			firstTextEnd = new VirtualCursor(chunk, { groupIndex:0, offset:3 });
			lastTextStart = new VirtualCursor(chunk, { groupIndex:1, offset:0 });
			groupEnd = new VirtualCursor(chunk, { groupIndex:1, offset:3 });
			middle = new VirtualCursor(chunk, { groupIndex:0, offset:1 });

			tgGroupStart = new TextGroupCursor(groupStart);
			tgFirstTextEnd = new TextGroupCursor(firstTextEnd);
			tgLastTextStart = new TextGroupCursor(lastTextStart);
			tgGroupEnd = new TextGroupCursor(groupEnd);
			tgMiddle = new TextGroupCursor(middle);
		});

		it('reports text start', function() {
			expect(tgGroupStart.isTextStart).toBe(true);
			expect(tgFirstTextEnd.isTextStart).toBe(false);
			expect(tgLastTextStart.isTextStart).toBe(true);
			expect(tgGroupEnd.isTextStart).toBe(false);
			expect(tgMiddle.isTextStart).toBe(false);
		});

		it('reports text end', function() {
			expect(tgGroupStart.isTextEnd).toBe(false);
			expect(tgFirstTextEnd.isTextEnd).toBe(true);
			expect(tgLastTextStart.isTextEnd).toBe(false);
			expect(tgGroupEnd.isTextEnd).toBe(true);
			expect(tgMiddle.isTextEnd).toBe(false);
		});

		it('reports first text', function() {
			expect(tgGroupStart.isFirstText).toBe(true);
			expect(tgFirstTextEnd.isFirstText).toBe(true);
			expect(tgLastTextStart.isFirstText).toBe(false);
			expect(tgGroupEnd.isFirstText).toBe(false);
			expect(tgMiddle.isFirstText).toBe(true);
		});

		it('reports last text', function() {
			expect(tgGroupStart.isLastText).toBe(false);
			expect(tgFirstTextEnd.isLastText).toBe(false);
			expect(tgLastTextStart.isLastText).toBe(true);
			expect(tgGroupEnd.isLastText).toBe(true);
			expect(tgMiddle.isLastText).toBe(false);
		});

		it('reports group start', function() {
			expect(tgGroupStart.isGroupStart).toBe(true);
			expect(tgFirstTextEnd.isGroupStart).toBe(false);
			expect(tgLastTextStart.isGroupStart).toBe(false);
			expect(tgGroupEnd.isGroupStart).toBe(false);
			expect(tgMiddle.isGroupStart).toBe(false);
		});

		it('reports group end', function() {
			expect(tgGroupStart.isGroupEnd).toBe(false);
			expect(tgFirstTextEnd.isGroupEnd).toBe(false);
			expect(tgLastTextStart.isGroupEnd).toBe(false);
			expect(tgGroupEnd.isGroupEnd).toBe(true);
			expect(tgMiddle.isGroupEnd).toBe(false);
		});

		it('returns associated text group', function() {
			expect(tgMiddle.textGroup).toBe(chunk.componentContent.textGroup);
		});

		it('returns associated text group index', function() {
			expect(tgGroupStart.groupIndex).toBe(0);
			expect(tgFirstTextEnd.groupIndex).toBe(0);
			expect(tgLastTextStart.groupIndex).toBe(1);
			expect(tgGroupEnd.groupIndex).toBe(1);
			expect(tgMiddle.groupIndex).toBe(0);
		});

		it('returns offset', function() {
			expect(tgGroupStart.offset).toBe(0);
			expect(tgFirstTextEnd.offset).toBe(3);
			expect(tgLastTextStart.offset).toBe(0);
			expect(tgGroupEnd.offset).toBe(3);
			expect(tgMiddle.offset).toBe(1);
		});

		it('returns associated text group item', function() {
			expect(tgGroupStart.textGroupItem).toBe(chunk.componentContent.textGroup.first);
			expect(tgFirstTextEnd.textGroupItem).toBe(chunk.componentContent.textGroup.first);
			expect(tgLastTextStart.textGroupItem).toBe(chunk.componentContent.textGroup.last);
			expect(tgGroupEnd.textGroupItem).toBe(chunk.componentContent.textGroup.last);
			expect(tgMiddle.textGroupItem).toBe(chunk.componentContent.textGroup.first);
		});

		it('returns associated text', function() {
			expect(tgGroupStart.text).toBe(chunk.componentContent.textGroup.first.text);
			expect(tgFirstTextEnd.text).toBe(chunk.componentContent.textGroup.first.text);
			expect(tgLastTextStart.text).toBe(chunk.componentContent.textGroup.last.text);
			expect(tgGroupEnd.text).toBe(chunk.componentContent.textGroup.last.text);
			expect(tgMiddle.text).toBe(chunk.componentContent.textGroup.first.text);
		});
	});
});


