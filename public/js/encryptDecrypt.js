// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")
	var crypto = require("crypto")

	// Encrypt userData column of MariaDB table
	function encrypt(input,loaded) {
		algorithm = "aes-192-cbc"
		password = "admin"
		crypto.scrypt(password,"salt",24,(err,key) => {
			crypto.randomFill(new Uint8Array(16),(err,iv) => {
				cipher = crypto.createCipheriv(algorithm,key,iv)
				let result = cipher.update(input,"utf8","hex")
				result += cipher.final("hex")
				console.log(result)
				loaded()
			})
		})
	}

	// Decrypt userData column of MariaDB table
	function decrypt(input,loaded) {
		console.log("Decrypting!")
		loaded()
	}

	router.post("/", (req,res) => {
		var context = {}
			// Tracks MySQL query count
			var queries = 0;
			var mysql = req.app.get('mysql');

			if (req.body.type == "encrypt") {
				encrypt("Zigmatic",loaded)
			} 
			else if (req.body.type == "decrypt") {
				decrypt("170d5f87115359d6335044f276cd350d",loaded)
			}
			
			// Checks if all SQL queries have completed before rendering page
			function loaded(){
				queries++;
				if(queries >= 1) {
					res.redirect("./admin")
				}
			}	
	})

	return router
}();


