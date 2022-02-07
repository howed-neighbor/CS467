module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var session = require("express-session")

	// Select row from table based on userName queried
	// #exploitable 
	function selectUserName(res,mysql,context,loaded,table) {
		// mysql.pool.query("SELECT userName, userData FROM " + table + " WHERE userName='user1' or TRUE;",
		mysql.pool.query("SELECT userName, userData FROM " + table + " WHERE userName='" + context.userName + "';",
			function(err,results) {
				if(err) {
					res.end();
				}
				context.users = results[0]
				loaded();
			});
	}

	router.get("/", (req,res) => {
		var context = {
			header: "> Injection",
			injection: true,
			darkTheme: req.session.darkTheme
		}

		res.render("injection",context)
		console.log("Injection loaded!")

		// Saves current path for light/dark theme redirect
		req.app.locals.previousPath = req.originalUrl
	})

	router.post("/", (req,res) => {
		var context = {
			header: "> Injection",
			injection: true,
			darkTheme: req.session.darkTheme,
			userName: req.body.userName
		}
		var mysql = req.app.get('mysql');
		selectUserName(res,mysql,context,loaded,"Users");

		// Checks if all SQL queries have completed before rendering page
		var queries = 0;
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("injection",context)
				console.log("Injection loaded!")
			}
		}
	})

	return router
}();
