module.exports = ({ env }) => ({
	email: {
		config: {
			provider: 'sendgrid',
			providerOptions: {
				apiKey: env('SENDGRID_API_KEY'),
			},
			settings: {
				defaultFrom: 'troestersi76444@th-nuernberg.de',
				defaultReplyTo: 'troestersi76444@th-nuernberg.de'
			}
		}
	}
});