// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"
// Crypto functions based on code from "Crypto", https://nodejs.org/api/crypto.html

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")
	var crypto = require("crypto")
	var buffer = require("buffer")

	const algorithm = 'aes-256-cbc'
	const password = 'admin'
	const salt = Buffer.from(["Sixteenbytes!!!!"]) // Salt must remain constant to consistently decrypt between sessions

	function createCipher(algorithm,password,salt,userData) {
		key = crypto.scryptSync(password,salt,32)
		cipher = crypto.createCipher(algorithm,key)
		result = cipher.update(userData,'utf8','hex')
		result += cipher.final('hex')			
		return result
	}

	// Encrypt userData column of MariaDB table
	function encrypt(res,mysql,context,loaded,table) {

		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM " + table + ";",
			function(err,results) {
				if (err) {
					res.redirect("./500")
				}

				var userCount = results[0].COUNT
				var encrypted = null

				for (let i=1; i<=userCount; i++) {
					mysql.pool.query("SELECT userData FROM " + table + " WHERE userId = " + i + ";",
						function(err,results) {
							if(err) {
								res.end();
							}
							userData = results[0].userData
							encrypted = createCipher(algorithm,password,salt,userData)

							// Updates MySQL table
							mysql.pool.query("UPDATE " + table + " SET userData = '" + encrypted + "' WHERE userId = " + i + ";",
								function(err,results) {
									loaded();
							})
					})
				}
		})
	}

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

	// Decrypt userData column of MariaDB table
	function decrypt(res,mysql,context,loaded,table) {

		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM " + table + ";",
			function(err,results) {
				if (err) {
					res.redirect("./500")
				}

				var userCount = results[0].COUNT

				for (let i=1; i<=userCount; i++) {
					mysql.pool.query("SELECT userData FROM " + table + " WHERE userId = " + i + ";",
						function(err,results) {
							if(err) {
								res.end();
							}
							userData = results[0].userData
							try {
								decrypted = createDecipher(algorithm,password,salt,userData)
							}
							catch (error) {
								console.log("Decrypt error!")
								context.decryptError = true
							}

							if (context.decryptError == false) {
							// Updates MySQL table
								mysql.pool.query("UPDATE " + table + " SET userData = '" + result + "' WHERE userId = " + i + ";",
									function(err,results) {
										loaded();
								})
							}
							else {
								loaded();
							}
						})
				}
			})
	}
	

	router.post("/", (req,res) => {
		var context = {
			decryptError: false
		}

			// Tracks MySQL query count
			var queries = 0;
			var mysql = req.app.get('mysql');

			if (req.body.type == "encrypt") {
				encrypt(res,mysql,context,loaded,"UsersHardened")
			} 
			else if (req.body.type == "decrypt") {
				decrypt(res,mysql,context,loaded,"UsersHardened")
			}
			
			// Checks if all SQL queries have completed before rendering page
			function loaded(){
				queries++;
				if(queries >= 5) {
					req.session.decryptError = context.decryptError
					res.redirect("./admin")
				}
			}	
	})

	return router
}();


