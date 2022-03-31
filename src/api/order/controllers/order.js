'use strict';

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
	async create(ctx) {
		const stripe = require('stripe')('sk_test_51KhIUbKwkuYIilDGbJkQeepYXXYe4mepkk4KX2QOfTGCL2gvaANpkheObHGtP6HYv559Bu1mojd655CYafI7w8LE00t7hFhFI9');
		const session = await stripe.checkout.sessions.retrieve(
			ctx.request.body.data.session_id
		);
		console.log(session);
		let newCtx = ctx;
		newCtx.request.body.data = {
			"session_id": session.id,
			"payment_amount": session.amount_total / 100,
			"currency": session.currency,
			"payment_status": session.payment_status,
			"products": ctx.request.body.data.products,
			"customer_email": session.customer_details.email,
			"customer_name": session.customer_details.name,
			"customer_shipping_address": session.customer_details.address
		};
		const response = await super.create(newCtx);
		return response;
	},
}));
