module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var xmlParser = require("express-xml-bodyparser")

	router.get("/", (req,res) => {
		var context = {
			header: "> XML External Entities",
			xmlExternalEntities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		res.render("xmlExternalEntities",context)
		console.log("XML External Entities loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/", (req,res) => {

		var context = {
			header: "> XML External Entities",
			xmlExternalEntities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		
		// Logs the XML-formatted request body (express-xml-bodyparser)
		console.log("req.rawBody\n",req.rawBody)

		res.render("xmlExternalEntities",context)

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();
