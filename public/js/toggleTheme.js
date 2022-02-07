module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		// Toggles theme
		req.session.darkTheme = !req.session.darkTheme
		
		// Redirects to page user was on when they toggled the theme
		path = req.session.previousPath
		res.redirect(path)
	})

	return router
}();
