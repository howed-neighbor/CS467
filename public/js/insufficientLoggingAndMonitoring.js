module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme
		}
		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
