module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")

	// Updates userData for layout header on page load
	function selectUserData(res,mysql,context,loaded,table) {
		var sql = "SELECT userData FROM " + table + " WHERE userName = ?;"
		var values = context.userName
		mysql.pool.query(sql,values,
			function(err,results) {
				if(err) {
					res.redirect("../500");
				}
				else {
					context.userData = results[0].userData
					loaded();
				}
			});
	}

	router.get("/", (req,res) => {
		var context = {
			header: "> Cross-Site Scripting (XSS)",
			crossSiteScripting: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			password: req.session.password,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		
		// Tracks MySQL query count
		var queries = 0;
		var mysql = req.app.get('mysql');

		if (context.userName != null) {
			selectUserData(res,mysql,context,loaded,"Users");
		}
		else {
			loaded()
		}
		req.session.userData = context.userData

		// Checks if all SQL queries have completed before rendering page
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("crossSiteScripting",context)
				console.log("Cross-Site Scripting (XSS) loaded!")
			}
		}

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