// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")
	var crypto = require("crypto")

	// Retrieves user's salt/hash and compares vs saved hash 
	function comparePassword(res,mysql,context,loaded,table) {
		var sql = "SELECT passwordSalt, passwordHash, userData FROM " + table + " WHERE userName = ?;"
		var values = context.userName
		mysql.pool.query(sql,values,
			function(err,results) {
				if(err) {
					res.end();
				}
				
				// If no user found, unauthorized
				if (results.length == 0) {
					context.authorized = false
					loaded();
				}

				else {
					// Results of SQL query
					storedUserSalt = results[0].passwordSalt
					storedUserHash = results[0].passwordHash

					// Hashes user input and compares with SQL query
					sha256 = crypto.createHash("sha256")
					hashed = sha256.update(context.password+storedUserSalt).digest("hex")
					if (storedUserHash == hashed) {
						context.authorized = true
						context.userData = results[0].userData
					}
					else {
						context.authorized = false
					}
					loaded();
				}
			});
	}

	router.post("/", (req,res) => {
		var context = {}
			// Tracks MySQL query count
			var queries = 0;
			var mysql = req.app.get('mysql');
			context.userName = req.body.userName;
			context.password = req.body.password;
			context.userData = null;
			comparePassword(res,mysql,context,loaded,"Users");

			// Checks if all SQL queries have completed before rendering page
			function loaded(){
				queries++;
				if(queries >= 1) {
					// If admin, updates session and redirects to /admin, if user or no auth, redirects to previous page
					if (context.authorized == true) {
						req.session.userName = req.body.userName
						req.session.userData = context.userData
						req.session.authorized = true
						if ((req.body.userName == "admin") || (req.body.userName == "superAdmin")) {
							path = "./admin"
						}
						else {
							path = req.session.previousPath	
						}
					}
					else {
						req.session.userName = null
						req.session.authorized = null
						path = req.session.previousPath
					}
					console.log("Redirecting to",path)
					res.redirect(path)
				}
			}	
	})

	return router
}();


