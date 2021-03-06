// Donovan Howe
// CS 467, ONLINE CAPSTONE PROJECT

// REFERENCES
// ├── expressjs				| "Hello world example", https://expressjs.com/en/starter/hello-world.html
// ├── expressjs				| "cs340_sample_nodejs_app", https://github.com/knightsamar/cs340_sample_nodejs_app
// ├── body-parser				| "body-parser", http://expressjs.com/en/resources/middleware/body-parser.html
// ├── express-xml-bodyparser	| "express-xml-bodyparser", https://www.npmjs.com/package/express-xml-bodyparser
// ├── fast-xml-parser			| "fast-xml-parser", https://www.npmjs.com/package/fast-xml-parser
// ├── handlebars				| "Introduction", https://handlebarsjs.com/guide/
// ├── handlebars				| "Express Handlebars", https://www.npmjs.com/package/express-handlebars
// ├── handlebars				| "Hello Handlebars", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/hello-node/hello-handlebars.html
// ├── handlebars				| "app.locals", https://expressjs.com/en/api.html#app.locals
// ├── JavaScript				| "Element.classList", https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
// ├── MySQL					| "Using Node on the Engineering Servers", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/tools-and-overview/Using-Node-on-the-Engineering-Servers.html
// └── express-session			| "express-session", http://expressjs.com/en/resources/middleware/session.html
	
var express = require("express");
var app = express();
var app_name = "datapotato.js";
var port = 37773;

var handlebars = require("express-handlebars").create({
	defaultLayout:"layout",
	helpers: {
		// example function to show syntax for layout helpers
		example: function(){
			console.log("Hello!")
			}
		}
	})

// MySQL database connection
var mysql = require("./dbcon.js")
app.set("mysql",mysql)

// body-parser for parsing form submission bodies
// Using "extended" urlencoded option as prescribed in CS340
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))

// express-xml-bodyparser for parsing XML requests
var xmlparser = require("express-xml-bodyparser")
app.use(xmlparser())

// Sessions setup
var session = require("express-session")
app.use(session({
	secret: "salt"
}))

// Sessions, visit counter
app.use(function(req,res,next){
	if (!req.session.countVisit) {
		req.session.countVisit = {}
	}
	req.session.countVisit["/"] = (req.session.countVisit["/"] || 0)
	next()
})

// Sessions, darkTheme tracker
app.use(function(req,res,next){
	if (!req.session.darkTheme) {
		req.session.darkTheme = false
	}
	req.session.previousPath = req.session.previousPath || "/"
	next()
})

// Sessions, session userName, userData and password
app.use(function(req,res,next){
	if (!req.session.userName) {
		req.session.userName = null
	}
	req.session.userName = req.session.userName || null

	if (!req.session.userData) {
		req.session.userData = null
	}
	req.session.userData = req.session.userData || null

	if (!req.session.password) {
		req.session.password = null
	}
	req.session.password = req.session.password || null
	next()
})

// Sessions, decrypt error tracker (see admin page)
app.use(function(req,res,next){
	if (!req.session.decryptError) {
		req.session.decryptError = false
	}
	next()
})

app.engine("handlebars", handlebars.engine)
app.set("view engine","handlebars")

// Handlebars templates for individual pages
app.use("/", express.static("public"))
app.use("/",require("./public/js/index.js"))
app.use("/400",require("./public/js/400.js"))
app.use("/403",require("./public/js/403.js"))
app.use("/404",require("./public/js/404.js"))
app.use("/500",require("./public/js/500.js"))
app.use("/signIn",require("./public/js/signIn.js"))
app.use("/signOut",require("./public/js/signOut.js"))
app.use("/editUserData",require("./public/js/editUserData.js"))
app.use("/encryptDecrypt",require("./public/js/encryptDecrypt.js"))
app.use("/admin",require("./public/js/admin.js"))
app.use("/toggleTheme",require("./public/js/toggleTheme.js"))
app.use("/injection",require("./public/js/injection.js"))
app.use("/brokenAuthentication",require("./public/js/brokenAuthentication.js"))
app.use("/sensitiveDataExposure",require("./public/js/sensitiveDataExposure.js"))
app.use("/xmlExternalEntities",require("./public/js/xmlExternalEntities.js"))
app.use("/brokenAccessControl",require("./public/js/brokenAccessControl.js"))
app.use("/securityMisconfiguration",require("./public/js/securityMisconfiguration.js"))
app.use("/crossSiteScripting",require("./public/js/crossSiteScripting.js"))
app.use("/insecureDeserialization",require("./public/js/insecureDeserialization.js"))
app.use("/usingComponentsWithKnownVulnerabilities",require("./public/js/usingComponentsWithKnownVulnerabilities.js"))
app.use("/insufficientLoggingAndMonitoring",require("./public/js/insufficientLoggingAndMonitoring.js"))

// Error handling
app.use((req,res)=>{
	res.status(404)
	res.redirect("../404")
})

// 400 error sources include XML POST to ./xmlExternalEntities that includes an unescaped ampersand
app.use((err,req,res,next)=>{
	if (err.status == 400) {
		console.error(err.stack)
		res.status(400)
		res.redirect("../400")
	}
	else {
	console.error(err.stack)
	res.status(500)
	res.redirect("../500")
	}
})

// Console log on start
app.listen(port,() => {
	console.log("Express started " + app_name + " | port " + port);
	console.log("Press CTRL+C to end");
});


