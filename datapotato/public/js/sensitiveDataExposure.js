module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")
	var crypto = require("crypto")
	var buffer = require("buffer")

	const algorithm = 'aes-256-cbc'
	const password = 'admin'
	const salt = crypto.randomBytes(16)

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

	function createCipher(algorithm,password,salt,userData) {
		key = crypto.scryptSync(password,salt,32)
		cipher = crypto.createCipher(algorithm,key)
		result = cipher.update(userData,'utf8','hex')
		result += cipher.final('hex')			
		return result
	}

	// Encrypt userData column of MariaDB table
	function encrypt(res,context,loaded,userData) {
		encrypted = createCipher(algorithm,password,salt,userData)
		context.encrypted = encrypted
		loaded();
	}

	function createDecipher(algorithm,password,salt,userData) {
		key = crypto.scryptSync(password,salt,32)
		cipher = crypto.createDecipher(algorithm,key)
		result = cipher.update(userData,'hex','utf8')
		result += cipher.final('utf8')			
		return result
	}

	// Encrypt userData column of MariaDB table
	function decrypt(res,context,loaded,userData) {
		decrypted = createDecipher(algorithm,password,salt,userData)
		context.decrypted = decrypted
		loaded();
	}

	router.get("/", (req,res) => {
		var context = {
			header: "> Sensitive Data Exposure",
			sensitiveDataExposure: true,
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
				res.render("sensitiveDataExposure",context)
				console.log("Sensitive Data Exposure loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/", (req,res) => {
		var context = {
			decryptError: false
		}

		// Tracks MySQL query count
		var queries = 0;

		if (req.body.type == "encrypt") {
			encrypt(res,context,loaded,req.body.userData)
		} 
		else if (req.body.type == "decrypt") {
			decrypt(res,context,loaded,req.body.userData)
		}
		
		// Checks if all SQL queries have completed before rendering page
		function loaded(){
			queries++;
			if(queries >= 1) {
				req.session.decryptError = context.decryptError
				res.render("sensitiveDataExposure",context)
			}
		}	
	})

	return router
}();

