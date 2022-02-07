module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme
		}
		res.render("crossSiteScripting",context)
		console.log("Cross-Site Scripting (XSS) loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
