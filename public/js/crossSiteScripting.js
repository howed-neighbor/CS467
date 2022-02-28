module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	router.get("/", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		res.render("crossSiteScripting",context)
		console.log("Cross-Site Scripting (XSS) loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			input: req.body.userInput,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		console.log("user input: " + req.body.userInput);
		console.log(context.vulnerable);
		res.render("crossSiteScripting",context)
		console.log("Cross-Site Scripting (XSS) loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/vulnerable", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			vuln: req.body.userInput,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		console.log("user input: " + req.body.userInput);
		console.log(context.vulnerable);
		res.render("crossSiteScripting",context)
		console.log("Cross-Site Scripting (XSS) loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/remediate", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			sanitized: req.body.sanitized,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		console.log("user input: " + req.body.sanitized);
		console.log(context.vulnerable);
		res.render("crossSiteScripting",context)
		console.log("Cross-Site Scripting (XSS) loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();