var express = require("express")
var router = express.Router()
var fs = require('fs')

var mysql      = require("mysql");
var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	database : "vidao"
});
 
// .*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d)$

router.post("/findOnPhones", function (req, res) {

	connection.connect();

	var phones = req.body.phones.join("','");
	phones = "('" + phones;
	phones = phones + "')";

	var query = "select * from user where phone in " + phones + " order by id;";
	console.log(query);

	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		res.send(results);
	});

	connection.end();

});

var dropTempTable 	= "DROP TABLE IF EXISTS temp_user;"
var tempTable 		= "CREATE TABLE `temp_user` ("
					+ "`name` mediumtext,"
					+ "`phone` varchar(10)"
					+ ")";

router.post("/findOnContacts", function (req, res) {

	connection.query(dropTempTable, function (error, results, fields) {
		if (error) throw error;
	});

	connection.query(tempTable, function (error, results, fields) {
		if (error) throw error;
	});

	var contacts = req.body;
	var len = contacts.length

	var valueArray = [];

	for(let i = 0; i < len; i++) {
		var contact = contacts[i];
		for(let j = 0; j < contact.phones.length; j++) {
			var phoneStr = contact.phones[j].replace(/.*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d)$/, "$1$2$3$4$5$6$7$8$9$10");
			var value = "(" + "'" + contact.name.replace("'", "\\'") + "','" + phoneStr + "')";
			valueArray.push(value);
		}
	}

	var query = "INSERT INTO `temp_user` values "

	connection.query(query + valueArray.join(","), function (error, results, fields) {
		if (error) throw error;
	});

	query = 	"SELECT user.id, user.name, user.phone FROM"
				+ " user, temp_user"
				+ " where user.name = temp_user.name"
				+ " and user.phone = temp_user.phone"
				+ " order by user.id"

	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		res.status(200).send(results);
	});


	connection.end();

});


router.get("/upload", function (req, res) {

	var query = 'select count(*) from user'

	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		var count = results[0]["count(*)"]
		if(count > 1200) {
			res.sendStatus(304);
			return;
		}

		fs.readFile('./data/contacts.json', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var contacts = JSON.parse(data);
			var len = contacts.length

			var valueArray = [];

			for(let i = 0; i < len; i++) {
				var contact = contacts[i];

				var randomIndex = Math.round(Math.random() * (contact.phones.length - 1));

				var phoneStr = contact.phones[randomIndex].replace(/.*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d).*(\d)$/, "$1$2$3$4$5$6$7$8$9$10");
				var value = "(null," + "'" + contact.name.replace("'", "\\'") + "','" + phoneStr + "')";
				valueArray.push(value);

			}

			query = "INSERT INTO `user` values "

			connection.query(query + valueArray.join(","), function (error, results, fields) {
				if (error) throw error;
			});

			res.sendStatus(200);

			connection.end();
		});
	});
	
});

module.exports = router