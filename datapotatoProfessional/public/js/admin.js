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

	// Reset table to default data
	function resetDatabase(res,mysql,context,loaded) {
		mysql.pool.query(
			"DROP TABLE IF EXISTS UsersHardened; CREATE TABLE `UsersHardened` (`userId` int(8) NOT NULL AUTO_INCREMENT UNIQUE, `passwordSalt` varchar(256) NOT NULL, `passwordHash` varchar(256) NOT NULL, `userName` varchar(256) NOT NULL, `userData` varchar(256) NOT NULL); INSERT INTO `UsersHardened` VALUES (1,'edbd1e36c33becf644dfb0c099bdbd6dae0f057bf5eb1fc2c508657690d485ad','d7a07d55e77b38a73320b289ba2ae70bd5abe53faca8a547cf1afc6879caf081','user1','ba3a1edf2e99e9a1e1abf9d31862faef832af0997ed97d5ab8b925a0bd9240e3'); INSERT INTO `UsersHardened` VALUES (2,'781e9c126eb956df3e10c000478a26bb2f78fdf9e27230a2950a303db6aa9bde','81ef4b5b53df3e5e1b4eb3210135b6a8ad04816b7be809245ea693aeb55564de','user2','46f4fa2c1c253b41af8227b8230573177226ac9631e0e88407fdbb857c1cd16b'); INSERT INTO `UsersHardened` VALUES (3,'0e039d059985e6b803e2ce87cfe7c9328f3deb91cca1ee2aeaa3d68612266aec','45d64308c30007405954c12453c81edb0653a7974f7414cef7bb320c10665af6','user3','03d91aaef3780bff8efc2819746b103e04bd41f9dbcf1fd3d5b9abb681056e0a'); INSERT INTO `UsersHardened` VALUES  (4,'5724cf7d60941cfde93b5e6d642b0af1d9f1c0941597adf8b18fa1c8ac7e4535','10bf4da6c25929316e7fbe55ef59965a05101375892f195b5e16f0c480ceb6f7','admin','40cf74f464e8bb31a79eeae973b7f2bfe24955e290c40ca9fd69fdcabbbd4cf0'); INSERT INTO `UsersHardened` VALUES (5,'5a7cc46771e0679edc2b369cfde92cb1323a1ee587f7d472caad17e2c05a77bf','9fdba89f2267a9ac31065111ec1a6da98069a72d29022827405c872d2ffce8e5','superAdmin','21e674f51709de221fd8510879bab0dd334032d50acec13e3f19ed556cacd4d5');",
			function(err,results) {
				if(err){
					res.redirect("../500");
				}
				loaded();
			});
	}

	// Submit any query to database
	function submitQuery(res,mysql,context,loaded) {
		mysql.pool.query(context.query,
			function(err,results) {
				if(err) {
					return res.redirect("./admin")
				}
				loaded();
			});
	}

	// Generate a salted/hashed password
	function salt_and_hash(res,salt_length,password,context) {
		salt = crypto.randomBytes(parseInt(salt_length,10)).toString("hex")
		sha256 = crypto.createHash("sha256")
		hashed = sha256.update(password+salt).digest("hex")
		context.salt = salt
		context.salt_and_hash = hashed
	}

	// Returns user data in MariaDB
	function selectUsers(res,mysql,context,loaded,table) {
		mysql.pool.query("SELECT UsersHardened.userId, UsersHardened.passwordSalt, UsersHardened.passwordHash, UsersHardened.userName, UsersHardened.userData FROM " + table,
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
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			authorized: req.session.authorized,
			salt: req.session.salt,
			salt_and_hash: req.session.salt_and_hash,
			sqlError: req.session.sqlError,
			decryptError: req.session.decryptError
		}

		// If admin is authorized, allows access to /admin
		if ((req.session.userName == "admin" || req.session.userName == "superAdmin") && (req.session.authorized == true)) {
			// Tracks MySQL query count
			var queries = 0;
			var mysql = req.app.get('mysql');
			selectUsers(res,mysql,context,loaded,"UsersHardened");

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
				if(queries >= 2) {
					res.render("admin",context)
					console.log("ADMIN loaded!")
				}
			}
		}

		// Unauthorized users are redirected to /403
		else {
			res.redirect("./403")
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl		
	})

	router.post("/", (req,res) => {
		var context = {}
		var queries = 0;

		function loaded(){
			queries++;
			if(queries >= 1) {
				res.redirect("./admin")
			}
		}

		// If admin is authorized, allows access to /admin
		if ((req.session.userName == "admin" || req.session.userName == "superAdmin") && (req.session.authorized == true)) {

			if (req.body.type == "resetDatabase") {
				var mysql = req.app.get('mysql');
				resetDatabase(res,mysql,context,loaded);
				}

			else if (req.body.type == "submitQuery") {
				var mysql = req.app.get('mysql');
				context.query = req.body.query
				submitQuery(res,mysql,context,loaded);
			}

			else if (req.body.type == "saltAndHash") {
				salt_and_hash(res,req.body.salt_length,req.body.password,context)
				req.session.salt = context.salt
				req.session.salt_and_hash = context.salt_and_hash
				res.redirect("./admin")
			}

			else {
				res.redirect("./400")
			}
		}
		// Posts without admin authorization through sessions are rejected
		else {
			res.redirect("./403")
		}
	})

	return router
}();
