'use strict';
const stripe = require('stripe')('sk_test_51KhIUbKwkuYIilDGbJkQeepYXXYe4mepkk4KX2QOfTGCL2gvaANpkheObHGtP6HYv559Bu1mojd655CYafI7w8LE00t7hFhFI9');

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
	// Get the products data from the frontend and the checkout data from stripes api
	// Mix both data up and create an "order" with it
	async create(ctx) {
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
			"customer_shipping_address": session.customer_details.address,
			"customer_discount_amount": session.total_details.amount_discount / 100,
			"customer_shipping_amount": session.total_details.amount_shipping / 100
		};
		const response = await super.create(newCtx);
		return response;
	},

	// Outsourcing of the checkout creation to the backend because there are more options
	// and it is the preferred method!
	createCheckout: async (ctx) => {
		console.log(ctx.request.body);
		const { cartLineItems, cartTotal } = ctx.request.body;

		if (!cartLineItems) {
			return ctx.throw(400, "No Items in Cart!");
		}

		// Depending on the cart value, offer different shipping_rates
		const getShipping = (cartTotal) => {
			if (cartTotal < 70) {
				return [
					{ shipping_rate: 'shr_1KkVj3KwkuYIilDGgVSM30dv' },
					{ shipping_rate: 'shr_1KjIzSKwkuYIilDGmdPrxR2f' }
				]
			} else {
				return [
					{ shipping_rate: 'shr_1KjIz1KwkuYIilDGYpYqm68s' },
					{ shipping_rate: 'shr_1KjIzSKwkuYIilDGmdPrxR2f' }
				]
			}
		}

		const BASE_URL = 'http://localhost:3000';

		const session = await stripe.checkout.sessions.create({
			line_items: cartLineItems,
			payment_method_types: ['card', 'giropay', 'klarna', 'sepa_debit'],
			mode: 'payment',
			shipping_address_collection: {
				allowed_countries: ['US', 'CA', 'DE'],
			},
			shipping_options: getShipping(cartTotal),
			success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${BASE_URL}/cart`,
			allow_promotion_codes: true
		})

		return { id: session.id };
	}
}));
