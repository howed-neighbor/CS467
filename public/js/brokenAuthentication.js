module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Broken Authentication",
			brokenAuthentication: true,
			darkTheme: req.session.darkTheme
		}
		res.render("brokenAuthentication",context)
		console.log("Broken Authentication loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
