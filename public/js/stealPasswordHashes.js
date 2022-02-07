module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Steal Password Hashes/Break Cryptography",
			stealPasswordHashes: true,
			darkTheme: req.session.darkTheme
		}
		res.render("stealPasswordHashes",context)
		console.log("Steal Password Hashes/Break Cryptography loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	return router
}();
