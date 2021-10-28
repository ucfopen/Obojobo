import API from 'obojobo-document-engine/src/scripts/viewer/util/api'

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const isUUID = val => uuidRegex.test(val)

export const uploadFileViaImageNode = (file) => {
    return new Promise((resolve, reject) => {
        const formData = new window.FormData()
		formData.append('userImage', file, file.name)

        API
        .postMultiPart('/api/media/upload', formData)
        .then(mediaData => {
            resolve(mediaData.media_id)
        })
    })
}
