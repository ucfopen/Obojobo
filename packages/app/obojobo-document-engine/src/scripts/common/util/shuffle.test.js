import shuffle from '../../../src/scripts/common/util/shuffle'

describe('Shuffle', () => {
	test('shuffle returns original array reference', () => {
		const src = [1, 2]
		const result = shuffle(src)
		expect(src).toBe(result)
	})

	test('shuffle returns things in different orders', () => {
		const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		const results = []

		for (let i = 0; i <= 5; i++) {
			results.push(shuffle([...src]).join(''))
		}

		const allMatch = (((results[0] === results[1]) === results[2]) === results[3]) === results[4]
		expect(allMatch).toBe(false)
	})
})
