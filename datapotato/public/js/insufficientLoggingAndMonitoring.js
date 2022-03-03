module.exports = function() {
	var express = require("express")
	var router = express.Router()
	var handlebars = require("express-handlebars")
	var os = require('os');
	const fs = require('fs');
	var child;
	var pid;
	var global_data;
	const { exec } = require('child_process');

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
		fs.readFileSync('./logs.txt', 'utf8', (err, data) =>{
			if(err){
				console.log(err);
				return;
			}
			console.log('no error');
			console.log(data);

		});
	}

	router.get("/", async (req,res) => {
		if(os.hostname != "ip-172-31-34-32"){
			console.log("not aws instance");
			// res.redirect('http://ec2-157-175-92-30.me-south-1.compute.amazonaws.com:37773/insufficientLoggingAndMonitoring/');
		}
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			userData: req.session.userData,
			password: req.session.password,
			xss: `<script>alert(42)</script>`,
			xss_rule: `alert tcp any any -> any any (msg: "SERVER-WEBAPP XSS";content: "alert"; sid:10000002;)`,
			sqli_rule: `alert tcp any any -> any any (msg: "SERVER-WEBAPP SQLI";content: "%27"; sid:10000003;)`
		}
		
		// Start Snort upon visiting this section
		await startSnort();
		
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
				res.render("insufficientLoggingAndMonitoring",context)
				console.log("Insufficient Logging and Monitoring loaded!")
			}
		}

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/xss", (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			vuln: req.body.userInput,
			xss: `<script>alert(42)</script>`,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		console.log("user input: " + req.body.userInput);
		context.sanitized = req.body.userInput;
		res.render("insufficientLoggingAndMonitoring",context)

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	router.post("/sqli", (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password,
			vuln2: req.body.username,
			xss: `<script>alert(42)</script>`,
			vulnerable: '{{{input}}}',
			remediate: '{{input}}'
		}
		console.log("user input: " + req.body.username);
		console.log(context.vulnerable);
		res.render("insufficientLoggingAndMonitoring",context)

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

	router.post("/readfile", async (req,res) => {
		var context = {
			header: "> Insufficient Logging and Monitoring",
			insufficientLoggingAndMonitoring: true,
			darkTheme: req.session.darkTheme,
			userName: req.session.userName,
			password: req.session.password
		}
		await stopSnort();
		await new Promise(r => setTimeout(r, 1000));
		var data = await fs.readFileSync('./logs.txt', 'utf8');
		await new Promise(r => setTimeout(r, 1000));
		context.logs = data;
		res.render("insufficientLoggingAndMonitoring",context)
		console.log("Insufficient Logging and Monitoring loaded!")

		// Saves current path for light/dark theme redirect
		req.session.previousPath = req.originalUrl
	})

	return router
}();