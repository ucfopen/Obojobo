// require('./bootstrap');

ChunkStyleList = window.ObojoboDraft.text.ChunkStyleList;
StyleRange     = window.ObojoboDraft.text.StyleRange;

describe('ChunkStyleList', function() {
	beforeEach(function() {
		styleList = new ChunkStyleList();
		styleRangeLink = new StyleRange(5, 15, 'a', { href:'google.com' });
		styleRangeBold = new StyleRange(10, 20, 'b');
		// '01234<a>56789<b>012345</a>67890</b>'

		styleList.add(styleRangeLink);
		styleList.add(styleRangeBold);
	});

	it('exports to an object', function(done) {
		actual = styleList.getExportedObject();

		expected = [
			{
				start: 5,
				end: 15,
				type: 'a',
				data: {
					href: 'google.com'
				}
			},
			{
				start: 10,
				end: 20,
				type: 'b',
				data: {}
			}
		];

		expect(actual).toEqual(expected);

		// done();
	});

	it('imports an object', function(done) {
		styleList = ChunkStyleList.createFromObject([
			{
				start: 10,
				end: 20,
				type: 'a',
				data: { href:'website.net' }
			}
		]);

		expect(styleList.styles.length).toEqual(1);
		expect(styleList.styles[0]).toEqual(new StyleRange(10, 20, 'a', { href:'website.net' }));

		// done();
	});

	it('clones', function(done) {
		clone = styleList.clone();

		expect(clone).not.toBe(styleList);
		expect(clone.getExportedObject()).toEqual(styleList.getExportedObject());

		// done();
	});

	it('specifies the length', function(done) {
		expect(styleList.length()).toBe(2);

		// done();
	});

	it('completely removes ranges enscapsulated by a given range', function(done) {
		styleList.remove(new StyleRange(5, 20));

		expect(styleList.length()).toBe(0);

		// done();
	});

	it('trims ranges overlapped by a given range', function(done) {
		styleList.remove(new StyleRange(0, 10));
		styleList.remove(new StyleRange(15, 20));

		expect(styleList.length()).toBe(2);

		styleList.styles.map(function(range) {
			if(range.type === 'a')
			{
				expect(range).toEqual(new StyleRange(10, 15, 'a', { href:'google.com' }));
			}
			else
			{
				expect(range).toEqual(new StyleRange(10, 15, 'b'));
			}
		});

		// done();
	});

	it('splits ranges that contain a given range', function(done) {
		//styleRangeLink = new StyleRange(5, 15, 'a', { href:'google.com' });
		//styleRangeBold = new StyleRange(10, 20, 'b');
		styleList.remove(new StyleRange(10, 11, 'a'));

		expect(styleList.getExportedObject()).toEqual([
			{
				type: 'b',
				start: 10,
				end: 20,
				data: {}
			},
			{
				type: 'a',
				start: 5,
				end: 10,
				data: { href:'google.com' }
			},
			{
				type: 'a',
				start: 11,
				end: 15,
				data: { href:'google.com' }
			}
		]);

		// done();
	});

	it('normalizes similar ranges', function(done) {
		newStyleRange = new StyleRange(5, 15, 'b');
		styleList.add(newStyleRange);
		styleList.normalize();

		expect(styleList.length()).toBe(2);

		styleList.styles.map(function(range) {
			if(range.type === 'b')
			{
				expect(range).toEqual(new StyleRange(5, 20, 'b'));
			}
		});

		// done();
	});

	it("doesn't normalize dis-similar ranges", function(done) {
		newStyleRange = new StyleRange(0, 20, 'a', { href:'new-website.com'});
		styleList.add(newStyleRange);
		styleList.normalize();

		expect(styleList.length()).toBe(3);

		expect(styleList.getExportedObject()).toEqual([
			{
				start: 10,
				end: 20,
				type: 'b',
				data: {}
			},
			{
				start: 0,
				end: 20,
				type: 'a',
				data: {
					href: 'new-website.com'
				}
			},
			{
				start: 5,
				end: 15,
				type: 'a',
				data: {
					href: 'google.com'
				}
			}
		]);

		// done();
	});

	it("returns styles ranges after a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(0, 1, 'b');

		expect(comparisons.after.length).toBe(1);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(0);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(0);

		expect(comparisons.after[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles ranges before a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(21, 22, 'b');

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(1);
		expect(comparisons.enscapsulatedBy.length).toBe(0);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(0);

		expect(comparisons.before[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles ranges enscapsulated by a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(0, 20, 'b');

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(1);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(0);

		expect(comparisons.enscapsulatedBy[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles ranges containing a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(11, 20, 'b');

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(0);
		expect(comparisons.contains.length).toBe(1);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(0);

		expect(comparisons.contains[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles ranges within the left side of a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(20, 21, 'b');

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(0);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(1);
		expect(comparisons.right.length).toBe(0);

		expect(comparisons.left[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles ranges within the right side of a given range", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(0, 11, 'b');

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(0);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(1);

		expect(comparisons.right[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns all styles range comparisons when no type is specified", function(done) {
		comparisons = styleList.getStyleComparisonsForRange(0, 15);

		expect(comparisons.after.length).toBe(0);
		expect(comparisons.before.length).toBe(0);
		expect(comparisons.enscapsulatedBy.length).toBe(1);
		expect(comparisons.contains.length).toBe(0);
		expect(comparisons.left.length).toBe(0);
		expect(comparisons.right.length).toBe(1);

		expect(comparisons.enscapsulatedBy[0]).toBe(styleRangeLink);
		expect(comparisons.right[0]).toBe(styleRangeBold);

		// done();
	});

	it("returns styles with getStyles", function(done) {
		styles = styleList.getStyles();

		expect(Object.keys(styles).length).toBe(2);
		expect(styles['a']).toBe('a');
		expect(styles['b']).toBe('b');

		// done();
	});

	it("returns styles completely within a given range", function(done) {
		styles = styleList.getStylesInRange(5, 15);

		expect(Object.keys(styles).length).toBe(1);
		expect(styles['a']).toBe('a');

		// done();
	});

	it("doesn't return styles completely within a given range", function(done) {
		styles = styleList.getStylesInRange(0, 15);

		expect(styles).toEqual({});

		// done();
	});

	it("cleans up superscripts", function(done) {
		styleList2 = new ChunkStyleList();
		sub1 = new StyleRange(5, 10, 'sup', 3);
		sub2 = new StyleRange(5, 10, 'sup', -3);
		sub3 = new StyleRange(15, 20, 'sup', 3);
		sub4 = new StyleRange(15, 20, 'sup', -2);

		styleList2.add(sub1);
		styleList2.add(sub2);
		styleList2.add(sub3);
		styleList2.add(sub4);

		styleList2.normalize();

		expect(styleList2.length()).toBe(1);
		expect(styleList2.styles[0]).toEqual(new StyleRange(15, 20, 'sup', 1));

		// done();
	});
});
