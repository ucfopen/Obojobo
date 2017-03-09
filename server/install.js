var db = require('../db.js')

db
	.none(`
		CREATE TABLE attempts(
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			created_at TIMESTAMP WITH TIME zone NOT NULL DEFAULT now(),
			updated_at TIMESTAMP WITH TIME zone NOT NULL DEFAULT now(),
			completed_at TIMESTAMP WITH TIME zone DEFAULT NULL,
			user_id integer NOT NULL,
			draft_id UUID NOT NULL,
			assessment_id varchar(100) NOT NULL,
			state json NOT NULL,
			score decimal
		);
		CREATE TABLE attempts_question_responses(
			id bigserial PRIMARY KEY,
			created_at TIMESTAMP WITH TIME zone NOT NULL DEFAULT now(),
			updated_at TIMESTAMP WITH TIME zone NOT NULL DEFAULT now(),
			attempt_id varchar(100),
			question_id varchar(100),
			response json
		);
		ALTER TABLE attempts_question_responses
		ADD CONSTRAINT attempt_question
		UNIQUE (attempt_id, question_id);
	`)
	.then(function() {
		console.log('INSTALLED');
		process.exit();
	})
	.catch(function(error) {
		console.error(error);
		process.exit();
	})