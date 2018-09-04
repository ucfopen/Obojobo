import looksLikeListItem from '../../../../ObojoboDraft/Chunks/List/list-detector'

describe('List Detector', () => {
	test('looksLikeListItem will return false when text is not formatted property', () => {
		expect(looksLikeListItem('')).toBe(false)
		expect(looksLikeListItem(' ')).toBe(false)
		expect(looksLikeListItem('  ')).toBe(false)
		expect(looksLikeListItem('*')).toBe(false)
		expect(looksLikeListItem('*Text')).toBe(false)
		expect(looksLikeListItem('* Text')).toBe(false)
		expect(looksLikeListItem('1')).toBe(false)
		expect(looksLikeListItem('1Text')).toBe(false)
		expect(looksLikeListItem('1.')).toBe(false)
		expect(looksLikeListItem('1.Text')).toBe(false)
		expect(looksLikeListItem('1. Text')).toBe(false)
		expect(looksLikeListItem('1 ')).toBe(false)
		expect(looksLikeListItem('*. ')).toBe(false)
	})

	test('looksLikeListItem returns details about a text-representation of an unordered list', () => {
		expect(looksLikeListItem('* ')).toEqual({
			type: 'unordered',
			symbol: '*',
			symbolIndex: 1,
			defaultSymbol: true,
			symbolStyle: ''
		})
	})

	test('looksLikeListItem returns details about a text-representation of an ordered list - Number', () => {
		expect(looksLikeListItem('1. ')).toEqual({
			type: 'ordered',
			symbol: '1',
			symbolIndex: 1,
			defaultSymbol: true,
			symbolStyle: 'decimal'
		})

		expect(looksLikeListItem('01. ')).toEqual({
			type: 'ordered',
			symbol: '01',
			symbolIndex: 1,
			defaultSymbol: false,
			symbolStyle: 'decimal-leading-zero'
		})

		expect(looksLikeListItem('2. ')).toEqual({
			type: 'ordered',
			symbol: '2',
			symbolIndex: 2,
			defaultSymbol: false,
			symbolStyle: 'decimal'
		})
	})

	test('looksLikeListItem returns details about a text-representation of an ordered list - Letter', () => {
		expect(looksLikeListItem('a. ')).toEqual({
			type: 'ordered',
			symbol: 'a',
			symbolIndex: 1,
			defaultSymbol: false,
			symbolStyle: 'lower-alpha'
		})

		expect(looksLikeListItem('B. ')).toEqual({
			type: 'ordered',
			symbol: 'B',
			symbolIndex: 2,
			defaultSymbol: false,
			symbolStyle: 'upper-alpha'
		})
	})

	test('looksLikeListItem returns details about a text-representation of an ordered list - Roman', () => {
		expect(looksLikeListItem('i. ')).toEqual({
			type: 'ordered',
			symbol: 'i',
			symbolIndex: 1,
			defaultSymbol: false,
			symbolStyle: 'lower-roman'
		})

		expect(looksLikeListItem('II. ')).toEqual({
			type: 'ordered',
			symbol: 'II',
			symbolIndex: 2,
			defaultSymbol: false,
			symbolStyle: 'upper-roman'
		})

		expect(looksLikeListItem('iii. ')).toEqual({
			type: 'ordered',
			symbol: 'iii',
			symbolIndex: 3,
			defaultSymbol: false,
			symbolStyle: 'lower-roman'
		})

		expect(looksLikeListItem('IV. ')).toEqual({
			type: 'ordered',
			symbol: 'IV',
			symbolIndex: 4,
			defaultSymbol: false,
			symbolStyle: 'upper-roman'
		})

		expect(looksLikeListItem('v. ')).toEqual({
			type: 'ordered',
			symbol: 'v',
			symbolIndex: 5,
			defaultSymbol: false,
			symbolStyle: 'lower-roman'
		})

		expect(looksLikeListItem('VI. ')).toEqual({
			type: 'ordered',
			symbol: 'VI',
			symbolIndex: 6,
			defaultSymbol: false,
			symbolStyle: 'upper-roman'
		})

		expect(looksLikeListItem('vii. ')).toEqual({
			type: 'ordered',
			symbol: 'vii',
			symbolIndex: 7,
			defaultSymbol: false,
			symbolStyle: 'lower-roman'
		})

		expect(looksLikeListItem('VIII. ')).toEqual({
			type: 'ordered',
			symbol: 'VIII',
			symbolIndex: 8,
			defaultSymbol: false,
			symbolStyle: 'upper-roman'
		})

		expect(looksLikeListItem('ix. ')).toEqual({
			type: 'ordered',
			symbol: 'ix',
			symbolIndex: 9,
			defaultSymbol: false,
			symbolStyle: 'lower-roman'
		})
	})
})
