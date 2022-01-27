jest.mock('../../../src/scripts/viewer/util/api')
jest.mock('downloadjs')

import { downloadDocument } from '../../../src/scripts/common/util/download-document'
import API from '../../../src/scripts/viewer/util/api'
import download from 'downloadjs'

describe('downloadDocument', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('calls get with correct api endpoint', async () => {
		// setup
		API.get.mockResolvedValueOnce({
			json: () => ({
				value: { mock: 'contents' }
			})
		})

		// execute
		await downloadDocument('mock-draft-id')

		// verify
		expect(API.get).toHaveBeenCalledTimes(1)
		expect(API.get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/full', 'json')
		expect(download).toHaveBeenCalledTimes(1)
		expect(download.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "{
		  \\"mock\\": \\"contents\\"
		}",
		  "obojobo-draft-mock-draft-id.json",
		  "application/json",
		]
	`)
	})

	test('calls get with correct api endpoint with xml formatting', async () => {
		// setup
		API.get.mockResolvedValueOnce({
			text: () => 'mock-draft-contents'
		})

		// execute
		await downloadDocument('mock-draft-id', 'xml')

		// verify
		expect(API.get).toHaveBeenCalledTimes(1)
		expect(API.get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/full', 'xml')
		expect(download).toHaveBeenCalledTimes(1)
		expect(download.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mock-draft-contents",
		  "obojobo-draft-mock-draft-id.xml",
		  "application/xml",
		]
	`)
	})

	test('calls get with correct api endpoint with a draft content id', async () => {
		// setup
		API.get.mockResolvedValueOnce({
			json: () => ({
				value: { mock: 'contents' }
			})
		})

		// execute
		await downloadDocument('mock-draft-id', 'json', 'mock-content-id')

		// verify
		expect(API.get).toHaveBeenCalledTimes(1)
		expect(API.get).toHaveBeenCalledWith(
			'/api/drafts/mock-draft-id/full?contentId=mock-content-id',
			'json'
		)
		expect(download).toHaveBeenCalledTimes(1)
		expect(download.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "{
		  \\"mock\\": \\"contents\\"
		}",
		  "obojobo-draft-mock-draft-id.json",
		  "application/json",
		]
	`)
	})
})
