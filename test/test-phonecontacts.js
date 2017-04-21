var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('findOnPhones', function() {
	it('should return error on invalid JSON /findOnPhones POST');
	it('should return error on invalid empty JSON /findOnPhones POST');
	it('should return error on invalid JSON structure /findOnPhones POST');
	it('should return no matching entries phones on empty phones array /findOnPhones POST');
	it('should return matching entries phones on phone array with no matching /findOnPhones POST');
	it('should return matching entries phones on phone array with matching /findOnPhones POST');
});

it('should return error on invalid JSON /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send()
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

it('should return error on invalid empty JSON /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send({})
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

it('should return error on invalid JSON structure /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send({"phones": "error"})
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

it('should return no matching entries phones on empty phones array /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send({ "phones": [] })
		.end(function (err, res) {
			res.should.have.status(200);
			res.type.should.equal('application/json');
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.lengthOf(0);
			done();
		});
});

it('should return matching entries phones on phone array with no matching /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send({ "phones": ["1179357618"] })
		.end(function (err, res) {
			res.should.have.status(200);
			res.type.should.equal('application/json');
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.lengthOf(0);
			done();
		});
});

it('should return matching entries phones on phone array with matching /findOnPhones POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnPhones')
		.send({ "phones": ["3316836919","4285557758","4069428091","5602706008","2457658336","5339354993","9148266538"]
 })
		.end(function (err, res) {
			res.should.have.status(200);
			res.type.should.equal('application/json');
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.lengthOf(7);

			res.body[0].should.have.property('id');
			res.body[0].should.have.property('name');
			res.body[0].should.have.property('phone');

			// testing for order

			res.body[0].id.should.equal(1111);
			res.body[0].name.should.equal('Skyla Grimes');
			res.body[0].phone.should.equal('3316836919');

			res.body[6].id.should.equal(1119);
			res.body[6].name.should.equal('Florine Towne');
			res.body[6].phone.should.equal('9148266538');

			done();
		});
});

describe('findOnContacts', function() {
	this.timeout(15000);
	it('should return error on invalid JSON /findOnContacts POST');
	it('should return error on invalid empty JSON /findOnContacts POST');
	// it('should return error on invalid JSON structure /findOnContacts POST');
	it('should return matching entries with id and the rest with just names /findOnContacts POST');
});

it('should return error on invalid JSON /findOnContacts POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnContacts')
		.send()
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

it('should return error on invalid empty JSON /findOnContacts POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnContacts')
		.send({})
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

it('should return error on invalid JSON structure /findOnContacts POST', function(done) {
	chai.request(server)
		.post('/routes/phonecontacts/findOnContacts')
		.send([{"name_error": "Matt Vandervort MD", "phones_error": ["1-939-021-3816"]}])
		.end(function (err, res) {
			res.should.have.status(400);
			done();
		});
});

var fs = require('fs');

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

it('should return matching entries with id and the rest with just names /findOnContacts POST', function(done) {
	this.timeout(15000);
	setTimeout(done, 15000);

	fs.readFileAsync('./data/contacts.json', 'utf8').
	then(function (data) {

		chai.request(server)
			.post('/routes/phonecontacts/findOnContacts')
			.send(JSON.parse(data))
			.end(function (err, res) {

				res.should.have.status(200);

				res.body[0].should.have.property('id');
				res.body[0].should.have.property('name');
				res.body[0].should.have.property('phone');

				res.body[0].id.should.equal(1);
				res.body[0].name.should.equal('Aditya Treutel');

				var i = 0;
				var lastId = -1;

				// checking for order

				while(res.body[i].id) {
					res.body[i].id.should.be.above(lastId);
					i++;
				}

				var lastName = "";

				while(res.body[i]) {
					res.body[i].name.should.be.above(lastName);
					i++;
				}

				res.body[res.body.length - 1].name.should.equal('Zora Herzog');
				done();
			});

	});


});

