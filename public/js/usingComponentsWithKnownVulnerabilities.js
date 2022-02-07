module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Using Components with Known Vulnerabilites",
			usingComponentsWithKnownVulnerabilities: true,
			darkTheme: req.session.darkTheme
		}
		res.render("usingComponentsWithKnownVulnerabilities",context)
		console.log("Using Components with Known Vulnerabilites loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
