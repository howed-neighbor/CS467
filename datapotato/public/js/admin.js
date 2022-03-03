// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")
	var crypto = require("crypto")

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

	// Reset table to default data
	function resetDatabase(res,mysql,context,loaded) {
		mysql.pool.query(
			"DROP TABLE IF EXISTS Users; CREATE TABLE `Users` (`userId` int(8) NOT NULL AUTO_INCREMENT UNIQUE, `passwordSalt` varchar(256) NOT NULL, `passwordHash` varchar(256) NOT NULL, `userName` varchar(256) NOT NULL, `userData` varchar(256) NOT NULL); INSERT INTO `Users` VALUES (1,'d635eff0cff68572ac16b4bd829205986687294b155940cb378f43f3e2d4d60d','6546127242774177792eb33bcb9ab606fcfa0c03ded30d99dd75a5a962071e7f','user1','Likes blueberry muffins'); INSERT INTO `Users` VALUES (2,'72be810b9c187768a516047bdc00f6edbc841990015867934d88bb8bd6e808ff','1f7779fda99bb753c26de79e70923431bcca0eb8bc9dee388dfc194176c61b0b','user2','Allergic to isoceles triangles'); INSERT INTO `Users` VALUES (3,'d45b295f5e788316d4609d1418eebc92dc231a326d2285b449f560aa773d4b77','d12d79c36484bf58da4fd4099e8df5041cdcb2405e643f0747be3ff2d08e320c','user3','Located in Spuds, FL'); INSERT INTO `Users` VALUES  (4,'0e6e2e53f3a916789966edbc4c853634c8b8b5b53547563af570d9c6f69d4af0','a39309a2c256e504532946e5803164b4ea54006088485145b947a54049b6b686','admin','The best admin on the planet'); INSERT INTO `Users` VALUES (5,'5a7cc46771e0679edc2b369cfde92cb1323a1ee587f7d472caad17e2c05a77bf','9fdba89f2267a9ac31065111ec1a6da98069a72d29022827405c872d2ffce8e5','superAdmin','Now with improved password');",
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
			selectUsers(res,mysql,context,loaded,"Users");

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
		var context = {
		}
		var queries = 0;

		function loaded(){
			queries++;
			if(queries >= 1) {
				res.redirect("./admin")
			}
		}

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
	})

	return router
}();
