module.exports = {
	routes: [
		{
			method: "POST",
			path: "/orders/checkout",
			handler: "order.createCheckout"
		}
	]
}