module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var session = require("express-session")
	var crypto = require("crypto")
	var buffer = require("buffer")

	const algorithm = 'aes-256-cbc'
	const password = 'admin'
	const salt = Buffer.from(["Sixteenbytes!!!!"]) // Salt must remain constant to consistently decrypt between sessions

	// Decrypt userData
	function createDecipher(algorithm,password,salt,userData) {
		key = crypto.scryptSync(password,salt,32)
		decipher = crypto.createDecipher(algorithm,key)
		try {
			result = decipher.update(userData,'hex','utf8')
			result += decipher.final('utf8')
		} 
		catch (error) {
			throw (error)
		}			
		return result
	}

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
					try {
						context.userData = createDecipher(algorithm,password,salt,results[0].userData)
					}
					catch (error) {
						context.userData = "Decryption error!"
					}
					// context.userData = results[0].userData
					loaded();
				}
			});
	}

	router.get("/", (req,res) => {
		var context = {
			header: "> Broken Access Control",
			brokenAccessControl: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			password: req.session.password
		}
		
		// Tracks MySQL query count
		var queries = 0;
		var mysql = req.app.get('mysql');

		if (context.userName != null) {
			selectUserData(res,mysql,context,loaded,"UsersHardened");
		}
		else {
			loaded()
		}
		req.session.userData = context.userData

		// Checks if all SQL queries have completed before rendering page
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("brokenAccessControl",context)
				console.log("Broken Access Control loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();
