// REFERENCES
// └── "Using Node on the Engineering Servers", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/tools-and-overview/Using-Node-on-the-Engineering-Servers.html

var mysql = require("mysql");
var pool = mysql.createPool({
	connectionLimit : 5,
	host			: "REDACTED",
	user			: "REDACTED",
	password		: "REDACTED",
	database		: "REDACTED",
	multipleStatements	: "true"
});

module.exports.pool = pool;