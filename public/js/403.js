// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")

	// Routes
	router.get("/", (req,res) => {
		var context = {
			header: "> 403",
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			error: "error"
		}
		res.render("403",context)
		console.log("403 loaded!")
		
		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();
