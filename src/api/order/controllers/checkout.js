'use strict';

/**
 * A set of functions called "actions" for `checkout`
 */

module.exports = {
	// exampleAction: async (ctx, next) => {
	//   try {
	//     ctx.body = 'ok';
	//   } catch (err) {
	//     ctx.body = err;
	//   }
	// }

	create: async (ctx, next) => {
		ctx.body = "ok";
	}
};
