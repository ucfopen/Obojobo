import './choose-image-modal.scss'

import React, { useState, useEffect } from 'react'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal

const ChooseImageModal = props => {
	const [medias, setMedias] = useState([])
	const [isFetching, setIsFetching] = useState(true)
	const [hasMore, setHasMore] = useState(true)
	const [start, setStart] = useState(0)
	const [url, setUrl] = useState('')
	const count = 11

	useEffect(() => {
		fetchMedias()
	}, [])

	const handleFileChange = event => {
		const file = event.target.files[0]
		const formData = new window.FormData()
		formData.append('userImage', file, file.name)
		APIUtil.postMultiPart('/api/media/upload', formData).then(mediaData => {
			props.onSetMediaUrl(mediaData.media_id)
			props.onSetIsChoosingImage(false)
		})
	}

	// Fetch `count` images
	const fetchMedias = () => {
		setIsFetching(() => true)
		APIUtil.get(`/api/media/many/?start=${start}&count=${count}`)
			.then(res => res.json())
			.then(result => {
				if (result.status != 'error') {
					setMedias(() => [...medias, ...result])
					setIsFetching(() => false)
					setHasMore(() => result.length === count)
					setStart(() => start + count)
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	return (
		<SimpleDialog
			cancelOk
			title="Choose an image"
			onConfirm={() => {
				props.onSetIsChoosingImage(false)
				props.onSetMediaUrl(url)
			}}
			onCancel={() => props.onSetIsChoosingImage(false)}
		>
			<div className="choose-image">
				<div className="choose-image--image-controls">
					<label htmlFor="choose-image--image-controls--upload">
						<input
							type="file"
							id="choose-image--image-controls--upload"
							accept={props.allowedUploadTypes}
							onChange={e => handleFileChange(e)}
						/>
						<span className="upload">+ Upload new image</span>
					</label>

					<div className="choose-image--image-controls--or">or</div>

					<input
						id="choose-image--image-controls--url"
						type="text"
						placeholder="Enter URL"
						value={url}
						onChange={e => setUrl(e.target.value)}
					/>
					{/* <div className="figure--url--upload">
						<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
							<button className="button">Enter URL</button>
						</div>
					</div> */}
				</div>
				<div className="choose-image--divider" />
				<small>Recently uploaded</small>
				<div className="choose-image--image-gallary">
					{medias.map(media => (
						<img
							id={media.id}
							className="image-gallary--single-photo"
							src={`/api/media/${media.id}/small`}
							onClick={() => {
								props.onSetMediaUrl(media.id)
								props.onSetIsChoosingImage(false)
							}}
						/>
					))}

					{isFetching ? (
						<h5>Loading...</h5>
					) : hasMore ? (
						<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
							<button
								className="choose-image--image-gallary--view-more-btn button"
								onClick={() => fetchMedias()}
							>
								Load More...
							</button>
						</div>
					) : null}
				</div>
			</div>
		</SimpleDialog>
	)
}

export default ChooseImageModal
