module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Sensitive Data Exposure",
			sensitiveDataExposure: true,
			darkTheme: req.session.darkTheme
		}
		res.render("sensitiveDataExposure",context)
		console.log("Sensitive Data Exposure loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
