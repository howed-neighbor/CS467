// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

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

	// Encrypts user's data entry and updates table
	function editUserData(res,mysql,context,loaded,table) {
		var sql = "UPDATE " + table + " SET userData = ? WHERE userName = ?;"
		var encryptedUserData = createCipher(algorithm,password,salt,context.userData)
		var values = [encryptedUserData, context.userName]
		mysql.pool.query(sql,values,
			function(err,results) {
				if(err) {
					console.log("mysql error!", context.userData, context.userName)
					res.redirect("../500");
				}
				else {
					loaded();
				}
			})
	};

	router.post("/", (req,res) => {
		var context = {}
			// Tracks MySQL query count
			var queries = 0;
			var mysql = req.app.get('mysql');
			context.userName = req.body.userName;
			context.userData = req.body.updatedUserData
			editUserData(res,mysql,context,loaded,"UsersHardened");

			// Checks if all SQL queries have completed before rendering page
			function loaded(){
				queries++;
				if(queries >= 1) {
					req.session.userData = context.userData
					path = req.session.previousPath
				}
				console.log("Redirecting to",path)
				res.redirect(path)
				}
			});	
	return router
}();


