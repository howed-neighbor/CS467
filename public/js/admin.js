// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")

	// MySQL query functions
	// Returns count of rows in table
	function selectUsers(res,mysql,context,loaded,table) {
		mysql.pool.query("SELECT Users.userId, Users.passwordSalt, Users.passwordHash, Users.userName, Users.userData FROM " + table,
			function(err,results) {
				if(err){
					res.end();
				}
				context.users = results;
				loaded();
			});
	}

	// Routes
	router.get("/", (req,res) => {
		var context = {
			header: "> ADMIN",
			admin: true,
			darkTheme: req.session.darkTheme
		}

		// Tracks MySQL query count
		var queries = 0;
		var mysql = req.app.get('mysql');
		selectUsers(res,mysql,context,loaded,"Users");

		// Checks if all SQL queries have completed before rendering page
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("admin",context)
				console.log("ADMIN loaded!")
			}
		}		
	})

	return router
}();
