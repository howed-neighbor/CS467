module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> XML External Entities",
			xmlExternalEntities: true,
			darkTheme: req.session.darkTheme
		}
		res.render("xmlExternalEntities",context)
		console.log("XML External Entities loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
