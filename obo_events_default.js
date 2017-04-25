let oboEvents = oboRequire('obo_events')

// save state changed
// oboEvents.on('client:saveState', (event, req) => {
// 	req.requireCurrentUser()
// 	.then(currentUser => {
// 		let data = {
// 			_id: `${currentUser.id}:${event.draft_id}:${event.draft_rev}`,
// 			userId: currentUser.id,
// 			metadata: metadata,
// 			payload: payload
// 		};

// 		db.none(`
// 			INSERT INTO view_state
// 			(user_id, metadata, payload)
// 			VALUES($[userId], $[metadata], $[payload])`
// 			, data)
// 		.then(result => {
// 			return true;
// 		})
// 		.catch(error => {
// 			console.log(error);
// 			res.error(404).json({error:'Draft not found'})
// 		})
// 	})
// });
