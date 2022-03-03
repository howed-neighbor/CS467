// REFERENCES
// └── "Using Node on the Engineering Servers", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/tools-and-overview/Using-Node-on-the-Engineering-Servers.html

var mysql = require("mysql");
var pool = mysql.createPool({
	connectionLimit : 5,
	host			: "classmysql.engr.oregonstate.edu",
	user			: "capstone_2021_wsrp",
	password		: "TgYd)DTPNWfv.6eD1",
	database		: "capstone_2021_wsrp",
	multipleStatements	: "true"
});

module.exports.pool = pool;