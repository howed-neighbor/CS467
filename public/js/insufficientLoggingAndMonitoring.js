module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	const fs = require('fs');
	var child;
	var pid;
	const { exec } = require('child_process');

	async function startSnort(){
		/*
		 * This function will spawn a child process on the server to start snort
		 * It will output alerts to logs.txt
		 */
		console.log('starting snort on aws instance');
		var cmd = "bash startSnort.sh";
		child = await exec(cmd, (error, stdout, stderr)=> {
			if (error){
				console.error(`error: ${error.message}`);
				return;
			}
			if (stderr){
				console.error(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout:\n${stdout}`);
		});
	}

	async function stopSnort(){
		/*
		 * this function will stop snort ids
		 * this needs to be done so that we can read the contents of the logs.txt file
		 */
		console.log('stopping snort on aws instance');
		var cmd = "bash stopSnort.sh";
		child = await exec(cmd, (error, stdout, stderr)=> {
			if (error){
				console.error(`error: ${error.message}`);
				return;
			}
			if (stderr){
				console.error(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout:\n${stdout}`);
		});
	}

	function readFile(){
		fs.readFile('./logs.txt', 'utf8', function(err, data){
			if(err){
				console.log(err);
				return;
			}
			console.log(data);

		});
	}

	router.get("/", (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.get("/start", async (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		await startSnort();


		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")
		console.log(child.pid);

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.get("/stop", async (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		await stopSnort();
		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.get("/readfile", async (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		readFile();
		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();
