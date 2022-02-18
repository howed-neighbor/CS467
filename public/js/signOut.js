// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")

	// Routes
	router.post("/", (req,res) => {
		// Clears session sign in data
		req.session.userName = null
		req.session.authorized = null
		
		// Redirects to page user was on when they signed in
		path = req.session.previousPath
		res.redirect(path)
	})

	return router
}();
