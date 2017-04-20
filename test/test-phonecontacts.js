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
		.send({ "phones": ["7225896552","6982156679","0832001534","3199587230","1504503155","6512794652","8735866127","8554545211","9370983832"] })
		.end(function (err, res) {
			res.should.have.status(200);
			res.type.should.equal('application/json');
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.lengthOf(9);

			res.body[0].should.have.property('id');
			res.body[0].should.have.property('name');
			res.body[0].should.have.property('phone');

			// testing for order

			res.body[0].id.should.equal(1111);
			res.body[0].name.should.equal('Tia Rau');
			res.body[0].phone.should.equal('7225896552');

			res.body[8].id.should.equal(1119);
			res.body[8].name.should.equal('Jovani Ullrich');
			res.body[8].phone.should.equal('9370983832');

			done();
		});
});

describe('findOnContacts', function() {
	it('should return error on invalid JSON /findOnPhones POST');
});
