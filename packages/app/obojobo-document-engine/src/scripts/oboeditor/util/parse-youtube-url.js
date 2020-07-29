const ParseYoutubeUrl = {
	youTubeParseUrl(videoUrl) {
		let newVideoId = false
		let videoStartTime = false
		let videoEndTime = false

		let youTubeSiteRegexMatch = false

		// eslint-disable-next-line no-console
		const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?^\s]*)*[&?t=]*([0-9]*)*[&?(amp;)?start=]*([0-9]*)*[&?(amp;)?end=]*([0-9]*)*.*/
		if (typeof videoUrl !== 'undefined') {
			youTubeSiteRegexMatch = videoUrl.match(youTubeSiteRegex)
		}

		if (youTubeSiteRegexMatch) {
			videoStartTime = youTubeSiteRegexMatch[8] ? parseInt(youTubeSiteRegexMatch[8], 10) : 0

			if (youTubeSiteRegexMatch[8]) {
				videoStartTime = youTubeSiteRegexMatch[8]
			} else if (youTubeSiteRegexMatch[9]) {
				videoStartTime = youTubeSiteRegexMatch[9]
			} else {
				videoStartTime = 0
			}

			// if (typeof youTubeSiteRegexMatch[7] !== 'undefined') {
			// 	newVideoId = youTubeSiteRegexMatch[7]
			// }

			newVideoId = youTubeSiteRegexMatch[7]
			videoEndTime = youTubeSiteRegexMatch[10] ? parseInt(youTubeSiteRegexMatch[10], 10) : 0
		}

		return {
			videoId: newVideoId,
			startTime: videoStartTime,
			endTime: videoEndTime
		}
	}
}

export default ParseYoutubeUrl
