var express = require("express")
var router = express.Router()
var fs = require('fs')

var mysql = require("promise-mysql");

var dbOptions = 	{
						host	 : "localhost",
						user	 : "root",
						database : "vidao"
					}

var digitRegex = /.*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d)$/;
var digitReplace = "$1$2$3$4$5$6$7$8$9$10";


router.post("/findOnPhones", function (req, res) {
	var connection;

	mysql.createConnection(dbOptions).then(function (conn) {

		connection = conn;

		if (!req.body.phones || !Array.isArray(req.body.phones)) {

			res.status(400).send("Invalid request body");

		} else if (req.body.phones.length == 0) {

			res.status(200).send([]);

		} else {
			var phones = req.body.phones.join("','");
			phones = "('" + phones;
			phones = phones + "')";

			var query = "select * from user where phone in " + phones + " order by id, name;";

			connection.query(query)
			.then(function (results) {

				connection.end();

				res.status(200).send(results);	

			}).catch(function (error) {

				try {
					connection.end();
				} catch(e) {
					console.log("Connection was never started");
				}

				console.log(error);

				res.status(400).send(error);

			});

		}

	});






});

var dropTempTable 	= "DROP TABLE IF EXISTS temp_user;"
var tempTable 		= "CREATE TABLE `temp_user` ("
					+ "`name` mediumtext,"
					+ "`phone` varchar(10)"
					+ ")";

router.post("/findOnContacts", function (req, res) {

	var connection;
	var query;

	mysql.createConnection(dbOptions).then(function(conn) {

		connection = conn;

		return connection.query(dropTempTable);

	}).then(function () {

		return connection.query(tempTable);

	}).then(function () {

		var contacts = req.body;
		var len = contacts.length

		var valueArray = [];

		for(let i = 0; i < len; i++) {

			var contact = contacts[i];
			
			for(let j = 0; j < contact.phones.length; j++) {
				var phoneStr = contact.phones[j].replace(digitRegex, digitReplace);
				var value = "(" + "'" + contact.name.replace("'", "\\'") + "','" + phoneStr + "')";
				valueArray.push(value);
			}

		}

		query = "INSERT INTO `temp_user` values ";

		return connection.query(query + valueArray.join(","));

	}).then(function () {

		query = 	"SELECT user.id, user.name, user.phone FROM"
					+ " user, temp_user"
					+ " where user.name = temp_user.name"
					+ " and user.phone = temp_user.phone"
					+ " order by user.id, user.name";

		return connection.query(query);

	}).then(function (results) {

		// connection.query(dropTempTable);

		connection.end();

		res.status(200).send(results);

	}).catch(function (error) {

		try {
			connection.end();
		} catch(e) {
			console.log("Connection was never started");
		}

		console.log(error);

		res.status(400).send(error);

	});

});

fs.readFileAsync = function (filename) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, function(err, data){
			if (err) 
				reject(err); 
			else 
				resolve(data);
		});
	});
};

var dropNewUserTable 	= "DROP TABLE IF EXISTS user;"
var newUserTable 		= "CREATE TABLE user ("
						+ " `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,"
						+ " `name` mediumtext,"
						+ " `phone` varchar(10) DEFAULT NULL, "
						+ " PRIMARY KEY (`id`)"
						+ " ) AUTO_INCREMENT=1199"

router.get("/upload", function (req, res) {

	var connection;
	var query;

	mysql.createConnection(dbOptions).then(function(conn) {

		connection = conn;

		return connection.query(dropNewUserTable);

	}).then(function () {

		return connection.query(newUserTable);

	}).then(function () {

		return fs.readFileAsync('./data/answer_id.json', 'utf8')

	}).then(function (data) {

		var contacts = JSON.parse(data);
		var len = contacts.length

		var valueArray = [];

		for(let i = 0; i < len; i++) {

				var contact = contacts[i];

				var randomIndex = Math.round(Math.random() * (contact.phones.length - 1));

				var id = contact.id;
				var phoneStr = contact.phones[randomIndex].replace(digitRegex, digitReplace);
				var value = "(" + id + "," + "'" + contact.name.replace("'", "\\'") + "','" + phoneStr + "')";
				valueArray.push(value);
		}

		query = "INSERT INTO `user` values ";

		return connection.query(query + valueArray.join(","));

	}).then(function () {

		connection.end();

		res.sendStatus(200);

	}).catch(function (error) {

		try {
			connection.end();
		} catch(e) {
			console.log("Connection was never started");
		}

		console.log(error);

		res.status(400).send(error);

	});

});


module.exports = router