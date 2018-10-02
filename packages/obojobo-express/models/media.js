const db = require('../db');
const logger = require('../logger.js');

const verifyMedia = () => {
    return true;
}

class Media {
    static createAndSave(userId, mediaInfo) {
        let newMedia;

        const {
            file,
            file_size,
            mime_type,
            dimensions,
            filename
        } = mediaInfo

        if ( ! verifyMedia()) {
            return null;
        }

		return db
			.tx(transactionDb => {
                // Create the media first
				return transactionDb
					.one(
						`
						INSERT INTO media
							(blob, file_size, mime_type, dimensions)
						VALUES
							($[file], $[file_size], $[mime_type], $[dimensions])
						RETURNING *`,
						{ file, file_size, mime_type, dimensions }
					)
                    .then(result => {
                        newMedia = result;

                        return transactionDb.one(
							`
							INSERT INTO user_media
								(user_id, file_name)
							VALUES
								($[userId], $[filename])
							RETURNING *`,
							{ userId, filename }
						)
                    })
					.then(result => {
						return transactionDb.one(
							`
							INSERT INTO media_records
								(user_media_id, media_id)
							VALUES
								($[user_media_id], $[mediaId])
							RETURNING *`,
							{ user_media_id: result.id, mediaId: newMedia.id }
						)
                    })
			})
			.then(() => {
				// transaction committed
				return newMedia
			})
			.catch(e => {
				console.log(e)
			})
    }
}

module.exports = Media;