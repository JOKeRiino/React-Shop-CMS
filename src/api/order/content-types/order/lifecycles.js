module.exports = {
	async afterUpdate(event) {
		const { result } = event;

		if (result.payment_status === "paid") {
			try {
				// await strapi.plugins['email'].services.email.send({
				// 	to: result.customer_email,
				// 	from: 'troestersi76444@th-nuernberg.de',
				// 	subject: 'Your Order Confirmation',
				// 	text: `Hello ${result.customer_name}`
				// })

				await strapi
					.plugin('email-designer')
					.service('email')
					.sendTemplatedEmail(
						{
							to: result.customer_email,
							from: 'troestersi76444@th-nuernberg.de',
							replyTo: 'troestersi76444@th-nuernberg.de'
						},
						{
							templateReferenceId: 666,
							subject: `Thank you for your order {{= USER.name }}!`
						},
						{
							USER: {
								name: result.customer_name
							},
							order: {
								products: result.products
							},
							payment: {
								amount: result.payment_amount,
								status: result.payment_status
							},
							address: result.customer_shipping_address
						}
					);
			}
			catch (err) {
				console.log(err);
				return ctx.badRequest(null, err);
			}
		}
	}
}