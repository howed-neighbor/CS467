// Routing and response functions based on code from knightsamar/cs340_sample_nodejs_app, "https://github.com/knightsamar/cs340_sample_nodejs_app"

module.exports = function() {
	var express = require("express")
	var handlebars = require("express-handlebars")
	var router = express.Router()
	var session = require("express-session")

	// MySQL query functions
	// Returns count of rows in table
	function countTable(res,mysql,context,loaded,table) {
		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM " + table,
			function(err,results) {
				if(err){
					res.end();
				}
				context.countTable = results[0].COUNT;
				loaded();
			});
	}

	// Routes
	router.get("/", (req,res) => {
		// Increments session counter
		req.session.countVisit["/"] += 1

		var context = {
			header: "> Index",
			index: true,
			countVisit: req.session.countVisit["/"],
			darkTheme: req.session.darkTheme
		}

		// Tracks MySQL query count
		var queries = 0;
		var mysql = req.app.get('mysql');
		countTable(res,mysql,context,loaded,"Users");

		// Increments Sessions counter
		req.session.views += 1

		// Checks if all SQL queries have completed before rendering page
		function loaded(){
			queries++;
			if(queries >= 1) {
				res.render("index",context)
				console.log("Index loaded!")
			}
		}
	})

	return router
}();
