let secretsLoaded = false

// define SECRET_SOURCE to determine where ENV and secrets come from (none, aws)
switch(process.env.SECRET_SOURCE){
	case 'none':
		secretsLoaded = true
		break;

	case 'aws':
		{
			const loadAWSJSONSecretsIntoENV = require('aws-secrets-environment')
			const region = process.env.AWS_SECRETS_REGION
			const key =  process.env.AWS_SECRETS_KEY
			console.log(`Loading env from AWS Secrets Manager (${key})...`)
			// load the secrets (async)
			loadAWSJSONSecretsIntoENV(region, key).then(() => {secretsLoaded = true})
		}
		break;

	default:
		throw Error('No SECRET_SOURCE defined')
		break;
}

// uses deasync to loop here with a 100ms repeat delay till the secrets are loaded
while(!secretsLoaded){
	require('deasync').sleep(100);
}
