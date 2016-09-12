StyleableText = window.ObojoboDraft.text.StyleableText;
StyleRange    = window.ObojoboDraft.text.StyleRange;
TextGroup     = window.ObojoboDraft.text.TextGroup;
TextGroupItem = window.ObojoboDraft.text.TextGroupItem;

describe('TextGroup', function() {
	beforeEach(function() {
		tg = new TextGroup()
		tg3items = new TextGroup(3)
		tgDataTemplate = new TextGroup(Infinity, { a:1, b:2 });
		tgWithItems = new TextGroup(Infinity, {}, [
			new TextGroupItem(new StyleableText('first'), { a:1 }),
			new TextGroupItem(new StyleableText('second'), { b:1 })
		]);
		tgWith3Items = new TextGroup(Infinity, {}, [
			new TextGroupItem(new StyleableText('first')),
			new TextGroupItem(new StyleableText('second')),
			new TextGroupItem(new StyleableText('third')),
		]);

		frozenEmptyObject = Object.freeze({});
	});

	it('creates instances with expected values', function(done) {
		expect(tg.maxItems).toBe(Infinity);
		expect(tg.items.length).toBe(0);
		expect(tg.dataTemplate).toEqual(frozenEmptyObject);

		expect(tg3items.maxItems).toBe(3);
		expect(tg3items.items.length).toBe(0);
		expect(tg3items.dataTemplate).toEqual(frozenEmptyObject);

		expect(tgDataTemplate.maxItems).toBe(Infinity);
		expect(tgDataTemplate.items.length).toBe(0);
		expect(tgDataTemplate.dataTemplate).toEqual(Object.freeze({ a:1, b:2 }));

		expect(tgWithItems.maxItems).toBe(Infinity);
		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.dataTemplate).toEqual(frozenEmptyObject);

		// done();
	});

	it('adds initial items while conforming to data template', function(done) {
		expect(tgWithItems.items[0].data).toEqual({});

		// done();
	});

	it('clears items', function(done) {
		tgWithItems.clear();

		expect(tgWithItems.maxItems).toBe(Infinity);
		expect(tgWithItems.items.length).toBe(0);
		expect(tgWithItems.dataTemplate).toEqual(frozenEmptyObject);

		// done();
	});

	it('returns the index of an item', function(done) {
		tg.add(new StyleableText('test'));

		expect(tg.indexOf(tg.first)).toBe(0);

		// done();
	});

	it('initializes the text group with items', function(done) {
		tgWithItems.init(10);

		tgWithItems.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText());
			expect(item.data).toEqual({});
		});

		expect(tgWithItems.items.length).toBe(10);

		// done();
	});

	it('initializes the text group with items while respecting the max items limit', function(done) {
		tg3items.init(10);

		tg3items.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText());
			expect(item.data).toEqual({});
		});

		expect(tg3items.items.length).toBe(3);

		// done();
	});

	it('fills items to the max item limit', function(done) {
		tg3items.fill();

		tg3items.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText());
			expect(item.data).toEqual({});
		});

		expect(tg3items.items.length).toBe(3);

		// done();
	});

	it("doesn't fill items with no max item limit", function(done) {
		tg.fill();

		expect(tg.items.length).toBe(0);

		// done();
	});

	it("adds items while respecting data template", function(done) {
		tg.add(new StyleableText('new item'), { x:0 });

		expect(tg.items.length).toBe(1);
		expect(tg.first.text).toEqual(new StyleableText('new item'));
		expect(tg.first.data).toEqual({});

		tgDataTemplate.add(new StyleableText('new item'), { a:100, c:200 });

		expect(tgDataTemplate.items.length).toBe(1);
		expect(tgDataTemplate.first.text).toEqual(new StyleableText('new item'));
		expect(tgDataTemplate.first.data).toEqual({ a:100, b:2 });

		// done();
	});

	it("adds item at a specified index", function(done) {
		tgWithItems.addAt(0, new StyleableText('new'));

		expect(tgWithItems.items.length).toBe(3);
		expect(tgWithItems.first.text).toEqual(new StyleableText('new'));
		expect(tgWithItems.first.data).toEqual({});

		// done();
	});

	it("adds a group", function(done) {
		tg.add(new StyleableText('A'));
		tg.add(new StyleableText('B'));

		tg.addGroup(tgWithItems);

		expect(tg.items.length).toBe(4);
		expect(tg.items[0].text).toEqual(new StyleableText('A'));
		expect(tg.items[1].text).toEqual(new StyleableText('B'));
		expect(tg.items[2].text).toEqual(new StyleableText('first'));
		expect(tg.items[3].text).toEqual(new StyleableText('second'));

		// done();
	});

	it("adds a group at a specified index", function(done) {
		tg.add(new StyleableText('A'));
		tg.add(new StyleableText('B'));

		tg.addGroupAt(tgWithItems, 1);

		expect(tg.items.length).toBe(4);
		expect(tg.items[0].text).toEqual(new StyleableText('A'));
		expect(tg.items[1].text).toEqual(new StyleableText('first'));
		expect(tg.items[2].text).toEqual(new StyleableText('second'));
		expect(tg.items[3].text).toEqual(new StyleableText('B'));

		// done();
	});

	it("adds a group and maintains data template", function(done) {
		tg.dataTemplate = { a:1, b:2, x:3 };
		tg.add(new StyleableText('A'));
		tg.add(new StyleableText('B'), { a:100, c:200, x:300 });

		expect(tg.items[1].data).toEqual({ a:100, b:2, x:300 });

		tgDataTemplate.addGroupAt(tg);

		expect(tgDataTemplate.items.length).toBe(2);
		expect(tgDataTemplate.items[0].data).toEqual({ a:1, b:2 });
		expect(tgDataTemplate.items[1].data).toEqual({ a:100, b:2 });

		// done();
	});

	it("adds a group with custom clone data function", function(done) {
		tg.dataTemplate = { a:1, b:2, x:3 };
		tg.add(new StyleableText('A'));
		tg.add(new StyleableText('B'));

		tg.addGroup(tgWithItems, function(data) {
			data.x = 1000;
			data.z = 2000;

			return data;
		});

		expect(tg.items[2].data).toEqual({ a:1, b:2, x:1000 });

		// done();
	});

	it("retrieves an item at a specified index", function(done) {
		expect(tgWithItems.get(0)).toEqual(tgWithItems.items[0]);

		// done();
	});

	it("sets an item at a specified index", function(done) {
		tgWithItems.set(0, new StyleableText("new"));

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("new"));

		// done();
	});

	it("removes an item at a specified index", function(done) {
		tgWithItems.remove(0);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("clones itself", function(done) {
		clone = tgWithItems.clone();

		expect(clone).not.toBe(tgWithItems);
		expect(clone.items.length).toBe(tgWithItems.items.length);
		expect(clone.maxItems).toBe(tgWithItems.maxItems);
		expect(clone.dataTemplate).toEqual(tgWithItems.dataTemplate);
		expect(clone.dataTemplate).not.toBe(tgWithItems.dataTemplate);

		expect(clone.items[0].text).toEqual(tgWithItems.items[0].text);
		expect(clone.items[1].text).toEqual(tgWithItems.items[1].text);
		expect(clone.items[0].data).toEqual(tgWithItems.items[0].data);
		expect(clone.items[1].data).toEqual(tgWithItems.items[1].data);

		// done();
	});

	it("clones itself with a custom clone function", function(done) {
		tgDataTemplate.add(new StyleableText("new1"), { a:100 });
		tgDataTemplate.add(new StyleableText("new2"), { b:100 });

		clone = tgDataTemplate.clone(function(data) {
			data.b = 5;
			return data;
		});

		expect(clone.items.length).toBe(2);
		expect(clone.items[0].text).toEqual(new StyleableText("new1"));
		expect(clone.items[1].text).toEqual(new StyleableText("new2"));
		expect(clone.items[0].data).toEqual({ a:100, b:5 });
		expect(clone.items[1].data).toEqual({ a:1, b:5 });

		// done();
	});

	it("exports to an object", function(done) {
		expect(tgWithItems.toDescriptor()).toEqual([
			{
				text: {
					value: 'first',
					styleList: null
				},
				data: {}
			},
			{
				text: {
					value: 'second',
					styleList: null
				},
				data: {}
			}
		]);

		// done();
	});

	it("reduces to a subset with toSlice", function(done) {
		tgWithItems.toSlice(0, 1);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'));

		// done();
	});

	it("splits itself into two groups", function(done) {
		tg.add(new StyleableText("A"));
		tg.add(new StyleableText("B"));
		tg.add(new StyleableText("C"));

		a = tg.clone();
		sibling = a.splitBefore(1);

		expect(a.items.length).toBe(1);
		expect(sibling.items.length).toBe(2);
		expect(a.items[0].text).toEqual(new StyleableText("A"));
		expect(sibling.items[0].text).toEqual(new StyleableText("B"));
		expect(sibling.items[1].text).toEqual(new StyleableText("C"));

		b = tg.clone();
		sibling = b.splitBefore(0);
		expect(b.items.length).toBe(0);
		expect(sibling.items.length).toBe(3);
		expect(sibling.items[0].text).toEqual(new StyleableText("A"));
		expect(sibling.items[1].text).toEqual(new StyleableText("B"));
		expect(sibling.items[2].text).toEqual(new StyleableText("C"));

		c = tg.clone();
		sibling = c.splitBefore(3);
		expect(c.items.length).toBe(3);
		expect(sibling.items.length).toBe(0);
		expect(c.items[0].text).toEqual(new StyleableText("A"));
		expect(c.items[1].text).toEqual(new StyleableText("B"));
		expect(c.items[2].text).toEqual(new StyleableText("C"));

		// done();
	});

	it("splits text at the start of the group", function(done) {
		tgWithItems.splitText(0, 0);

		expect(tgWithItems.items.length).toBe(3);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[2].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("splits text in the middle of the group", function(done) {
		tgWithItems.splitText(0, 2);

		expect(tgWithItems.items.length).toBe(3);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("fi"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("rst"));
		expect(tgWithItems.items[2].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("splits text at the end of the group", function(done) {
		tgWithItems.splitText(1, 6);

		expect(tgWithItems.items.length).toBe(3);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));
		expect(tgWithItems.items[2].text).toEqual(new StyleableText(""));

		// done();
	});

	it("splits text and clones data", function(done) {
		tgDataTemplate.add(new StyleableText("first"), { a:100 });
		tgDataTemplate.add(new StyleableText("second"), { b:200 });

		tgDataTemplate.splitText(0, 2);

		expect(tgDataTemplate.items.length).toBe(3);
		expect(tgDataTemplate.items[0].data).toEqual({ a:100, b:2 });
		expect(tgDataTemplate.items[1].data).toEqual({ a:100, b:2 });
		expect(tgDataTemplate.items[2].data).toEqual({ a:1, b:200 });

		// done();
	});

	it("merges text", function(done) {
		tgDataTemplate.add(new StyleableText("my"), { a:'my', b:100 });
		tgDataTemplate.add(new StyleableText("hot"), { a:'hot', b:200 });
		tgDataTemplate.add(new StyleableText("dog"), { a:'dog', b:300 });
		tgDataTemplate.add(new StyleableText("is tasty"), { a:'is tasty', b:400 });

		tgDataTemplate.merge(1);

		expect(tgDataTemplate.items.length).toBe(3);
		expect(tgDataTemplate.items[0].text).toEqual(new StyleableText("my"));
		expect(tgDataTemplate.items[1].text).toEqual(new StyleableText("hotdog"));
		expect(tgDataTemplate.items[2].text).toEqual(new StyleableText("is tasty"));

		expect(tgDataTemplate.items[0].data).toEqual({ a:'my', b:100 });
		expect(tgDataTemplate.items[1].data).toEqual({ a:'hot', b:200 });
		expect(tgDataTemplate.items[2].data).toEqual({ a:'is tasty', b:400 });

		// done();
	});

	it("merges text with a custom merge function", function(done) {
		tgDataTemplate.add(new StyleableText("abc"), { b:100 });
		tgDataTemplate.add(new StyleableText("xyz"), { b:200 });

		tgDataTemplate.merge(0, function(consumer, digested) {
			consumer.b += digested.b;
			return consumer;
		});

		expect(tgDataTemplate.items[0].data).toEqual({ a:1, b:300 });

		// done();
	});

	it("deletes a span of text", function(done) {
		tgWithItems.deleteSpan(0, 1, 0, 2);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("frst"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("deletes a span of text at the start of the first item", function(done) {
		tgWithItems.deleteSpan(0, 0, 0, 1);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("irst"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("deletes a span of text at the end of the first item", function(done) {
		tgWithItems.deleteSpan(0, 4, 0, 5);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("firs"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("deletes the complete span of the first text item", function(done) {
		tgWithItems.deleteSpan(0, 0, 0, 5);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("deletes a span of text at the start of the last item", function(done) {
		tgWithItems.deleteSpan(1, 0, 1, 1);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("econd"));

		// done();
	});

	it("deletes a span of text at the end of the last item", function(done) {
		tgWithItems.deleteSpan(1, 5, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("secon"));

		// done();
	});

	it("deletes the complete span of the last text item", function(done) {
		tgWithItems.deleteSpan(1, 0, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(""));

		// done();
	});

	it("deletes a span of text that covers two text items", function(done) {
		tgWithItems.deleteSpan(0, 1, 1, 5);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("fd"));

		// done();
	});

	it("deletes a span of text that covers two text items but doesn't merge when specified not to merge", function(done) {
		tgWithItems.deleteSpan(0, 1, 1, 5, false);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("f"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("d"));

		// done();
	});

	it("deletes a span of text from the beginning to inside the last text item", function(done) {
		tgWithItems.deleteSpan(0, 0, 1, 5);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("d"));

		// done();
	});

	it("deletes a span of text from inside the first text item to the end", function(done) {
		tgWithItems.deleteSpan(0, 1, 1, 6);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("f"));

		// done();
	});

	it("deletes all the text", function(done) {
		tgWithItems.deleteSpan(0, 0, 1, 6);

		expect(tgWithItems.items.length).toBe(1);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));

		// done();
	});

	it("deletes a span of text and merges data", function(done) {
		tgDataTemplate.add(new StyleableText("first"), { a:100 });
		tgDataTemplate.add(new StyleableText("second"), { b:200 });

		tgDataTemplate.deleteSpan(0, 1, 1, 5);

		expect(tgDataTemplate.items.length).toBe(1);
		expect(tgDataTemplate.items[0].data).toEqual({ a:100, b:2 });

		// done();
	});

	it("deletes a span of text and merges data with a custom merge function", function(done) {
		tgDataTemplate.add(new StyleableText("first"), { a:100 });
		tgDataTemplate.add(new StyleableText("second"), { b:200 });

		tgDataTemplate.deleteSpan(0, 1, 1, 5, true, function(consumer, digested) {
			consumer.a += digested.a;
			return consumer;
		});

		expect(tgDataTemplate.items.length).toBe(1);
		expect(tgDataTemplate.items[0].data).toEqual({ a:101, b:2 });

		// done();
	});

	it("clears a span of text", function(done) {
		tgWithItems.clearSpan(0, 1, 0, 2);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("frst"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("clears a span of text at the start of the first item", function(done) {
		tgWithItems.clearSpan(0, 0, 0, 1);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("irst"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("clears a span of text at the end of the first item", function(done) {
		tgWithItems.clearSpan(0, 4, 0, 5);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("firs"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("clears the complete span of the first text item", function(done) {
		tgWithItems.clearSpan(0, 0, 0, 5);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("second"));

		// done();
	});

	it("clears a span of text at the start of the last item", function(done) {
		tgWithItems.clearSpan(1, 0, 1, 1);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("econd"));

		// done();
	});

	it("clears a span of text at the end of the last item", function(done) {
		tgWithItems.clearSpan(1, 5, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("secon"));

		// done();
	});

	it("clears the complete span of the last text item", function(done) {
		tgWithItems.clearSpan(1, 0, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("first"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(""));

		// done();
	});

	it("clears a span of text that covers two text items", function(done) {
		tgWithItems.clearSpan(0, 1, 1, 5, false);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("f"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("d"));

		// done();
	});

	it("clears a span of text from the beginning to inside the last text item", function(done) {
		tgWithItems.clearSpan(0, 0, 1, 5);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText("d"));

		// done();
	});

	it("clears a span of text from inside the first text item to the end", function(done) {
		tgWithItems.clearSpan(0, 1, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText("f"));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(""));

		// done();
	});

	it("clears all the text", function(done) {
		tgWithItems.clearSpan(0, 0, 1, 6);

		expect(tgWithItems.items.length).toBe(2);
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(""));
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(""));

		// done();
	});

	it("styles text at the beginning of the group", function(done) {
		tgWith3Items.styleText(0, 0, 0, 1, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(1);
		expect(styles2.length).toBe(0);
		expect(styles3.length).toBe(0);
		expect(styles1[0]).toEqual(new StyleRange(0, 1, 'b'));

		// done();
	});

	it("styles text at the end of the group", function(done) {
		tgWith3Items.styleText(2, 4, 2, 5, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(0);
		expect(styles2.length).toBe(0);
		expect(styles3.length).toBe(1);
		expect(styles3[0]).toEqual(new StyleRange(4, 5, 'b'));

		// done();
	});

	it("styles text spanning two text items", function(done) {
		tgWith3Items.styleText(0, 1, 1, 1, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(1);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(0);
		expect(styles1[0]).toEqual(new StyleRange(1, 5, 'b'));
		expect(styles2[0]).toEqual(new StyleRange(0, 1, 'b'));

		// done();
	});

	it("styles all text", function(done) {
		tgWith3Items.styleText(0, 0, 2, 5, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(1);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(1);
		expect(styles1[0]).toEqual(new StyleRange(0, 5, 'b'));
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'));
		expect(styles3[0]).toEqual(new StyleRange(0, 5, 'b'));

		// done();
	});

	it("unstyles a span of text", function(done) {
		tgWith3Items.styleText(0, 0, 2, 5, 'b');
		tgWith3Items.unstyleText(0, 0, 0, 1, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(1);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(1);
		expect(styles1[0]).toEqual(new StyleRange(1, 5, 'b'));
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'));
		expect(styles3[0]).toEqual(new StyleRange(0, 5, 'b'));

		// done();
	});

	it("toggleStyle will style a portion of un-styled text", function(done) {
		tgWith3Items.toggleStyleText(1, 1, 1, 5, 'b');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(0);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(0);
		expect(styles2[0]).toEqual(new StyleRange(1, 5, 'b'));

		// done();
	});

	it("toggleStyle will style a portion of partially styled text", function(done) {
		tgWith3Items.styleText(1, 1, 1, 5, 'b');
		tgWith3Items.toggleStyleText(1, 0, 1, 6, 'b')
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(0);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(0);
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'));

		// done();
	});

	it("toggleStyle will un-style a portion of styled text", function(done) {
		tgWith3Items.styleText(1, 1, 1, 5, 'b');
		tgWith3Items.toggleStyleText(1, 2, 1, 5, 'b')
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(0);
		expect(styles2.length).toBe(1);
		expect(styles3.length).toBe(0);
		expect(styles2[0]).toEqual(new StyleRange(1, 2, 'b'));

		// done();
	});

	it("toggleStyle will un-style the portion of styled text", function(done) {
		tgWith3Items.styleText(1, 1, 1, 5, 'b');
		tgWith3Items.toggleStyleText(1, 1, 1, 5, 'b')
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		expect(styles1.length).toBe(0);
		expect(styles2.length).toBe(0);
		expect(styles3.length).toBe(0);

		// done();
	});

	it("getStyles will return only the styles covered by the span", function(done) {
		tgWith3Items.styleText(1, 1, 1, 5, 'b');
		tgWith3Items.styleText(1, 0, 1, 6, 'i');
		styles1 = tgWith3Items.items[0].text.styleList.styles;
		styles2 = tgWith3Items.items[1].text.styleList.styles;
		styles3 = tgWith3Items.items[2].text.styleList.styles;

		styles = tgWith3Items.getStyles(1, 1, 1, 5);
		expect(styles.i).toBe('i');
		expect(styles.b).toBe('b');

		styles = tgWith3Items.getStyles(1, 0, 1, 5);
		expect(styles.i).toBe('i');
		expect(styles.b).not.toBeDefined();

		// done();
	});

	it("returns the length", function(done) {
		expect(tgWithItems.length).toBe(tgWithItems.items.length);

		// done();
	});

	it("returns the first item", function(done) {
		expect(tgWithItems.first).toBe(tgWithItems.items[0]);

		// done();
	});

	it("returns the last item", function(done) {
		expect(tgWithItems.last).toBe(tgWithItems.items[tgWithItems.items.length - 1]);

		// done();
	});

	it("can respond if it is full", function(done) {
		expect(tg3items.isFull).toBe(false);
		tg3items.add(new StyleableText("item"));
		expect(tg3items.isFull).toBe(false);
		tg3items.add(new StyleableText("item"));
		expect(tg3items.isFull).toBe(false);
		tg3items.add(new StyleableText("item"));
		expect(tg3items.isFull).toBe(true);

		// done();
	});

	it("can respond if it is empty or blank", function(done) {
		expect(tgWithItems.isEmpty).toBe(false);
		expect(tgWithItems.isBlank).toBe(false);

		tgWithItems.remove(0);

		expect(tgWithItems.isEmpty).toBe(false);
		expect(tgWithItems.isBlank).toBe(false);

		tgWithItems.first.text.init();

		expect(tgWithItems.isEmpty).toBe(false);
		expect(tgWithItems.isBlank).toBe(true);

		tgWithItems.remove(0);

		expect(tgWithItems.isEmpty).toBe(true);
		expect(tgWithItems.isBlank).toBe(true);

		// done();
	});

	it("can create an instance from an object", function(done) {
		tgDataTemplate.add("first", { a:1, c:1 });
		tgDataTemplate.add("second", { a:2, c:2 });

		o = tgWithItems.toDescriptor();
		newTg = TextGroup.fromDescriptor(o, 10, { b:2 });

		expect(newTg.maxItems).toBe(10);
		expect(newTg.items.length).toBe(2);
		expect(newTg.items[0].text).toEqual(new StyleableText('first'));
		expect(newTg.items[1].text).toEqual(new StyleableText('second'));
		expect(newTg.items[0].data).toEqual({ b:2 });
		expect(newTg.items[1].data).toEqual({ b:2 });

		// done();
	});

	it("can create an instance using the create method shortcut", function(done) {
		newTg = TextGroup.create(10, { x:1 }, 4);
		newTg.addAt(0, new StyleableText("first"), { x:2, y:1 });

		expect(newTg.maxItems).toBe(10);
		expect(newTg.items.length).toBe(5);
		expect(newTg.items[0].text).toEqual(new StyleableText('first'));
		expect(newTg.items[1].text).toEqual(new StyleableText(''));
		expect(newTg.items[2].text).toEqual(new StyleableText(''));
		expect(newTg.items[3].text).toEqual(new StyleableText(''));
		expect(newTg.items[4].text).toEqual(new StyleableText(''));
		expect(newTg.items[0].data).toEqual({ x:2 });
		expect(newTg.items[1].data).toEqual({ x:1 });
		expect(newTg.items[2].data).toEqual({ x:1 });
		expect(newTg.items[3].data).toEqual({ x:1 });
		expect(newTg.items[4].data).toEqual({ x:1 });

		// done();
	});
});
