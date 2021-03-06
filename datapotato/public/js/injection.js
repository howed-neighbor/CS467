module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var session = require("express-session")

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

	// Select row from table based on userName queried
	// #exploitable 
	function selectUserName(res,mysql,context,loaded,table) {
		mysql.pool.query("SELECT userName, userData FROM " + table + " WHERE userName='" + context.queriedUserName + "';",
			function(err,results) {
				if(err) {
					res.end();
				}
				context.users = results[0]
				loaded();
			});
	}

	// Select row from table based on userName queried
	// Parameterized to prevent SQL injection
	function selectUserNameRemediation(res,mysql,context,loaded,table) {
		var sql = "SELECT userName, userData FROM " + table + " WHERE userName = ?;"
		var values = context.queriedUserName
		mysql.pool.query(sql,values,
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
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			password: req.session.password
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
				res.render("injection",context)
				console.log("Injection loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/", (req,res) => {
		var context = {
			header: "> Injection",
			injection: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			password: req.session.password,
			queriedUserName: req.body.queriedUserName
		}
		var mysql = req.app.get('mysql');

		if (req.body.type == "default") { 
			selectUserName(res,mysql,context,loaded,"Users");
			}
		else if (req.body.type == "remediation") { 
			selectUserNameRemediation(res,mysql,context,loaded,"Users");
			}

		// Checks if all SQL queries have completed before rendering page
		var queries = 0;
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("injection",context)
				console.log("Injection loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();
