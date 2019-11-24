var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');

router.use(function(req, res, next){
	if(req.method === "GET") return next();

	return next();
});

router.route("/reservations/:id")
	.get(function(req, res){
		//Get specific reservation by ID
		Reservation.findById(req.params.id, function(err, data){
			if(err) res.send(500, {message: "Database Error."});
			if(!data) res.send(204, {message: "No Reservation Found."});
			console.log(`Served request for reservation | Email: ${data.email}`);
			return res.send(data);
		});
	})

	.put(function(req, res){
		//Update specific reservation by ID
		Reservation.findById(req.params.id, function(err, reservation){
			if(!req.body.gobbledygook){
				if(err) return res.send(err);
				if(!reservation) return res.send(404, {message: "Entry Not Found."});
				if(reservation.hasSubmitted) return res.send(204, {message: "RSVP already submitted."});
	
				reservation.guests = req.body.guests;
				reservation.content = req.body.content;
				reservation.hasSubmitted = true;
	
				reservation.save(function(err, reservation){
					if(err) return res.send(err);
					console.log(`Updated reservation | Email: ${reservation.email}`);
					return res.json(reservation);
				});
			} else {
				if(err) return res.send(err);
				if(!reservation) return res.send(404, {message: "Entry Not Found."});
				
				reservation.email = req.body.email;
				reservation.guests = req.body.guests;
				reservation.content = req.body.content;
				reservation.hasSubmitted = req.body.hasSubmitted;
	
				reservation.save(function(err, reservation){
					if(err) return res.send(err);
					console.log(`Updated reservation | Email: ${reservation.email}`);
					return res.json(reservation);
				});
			}

		});

	});

router.route("/reservations")
	.post(function(req, res){
		if(!req.body.gobbledygook) return res.send(404, {message: "Not Found"});
		Reservation.find(function(err, data){
			if(err) return res.send(500, {message: "Database Error."});
			console.log(`Served request for all reservations`);
			return res.send(data);
		});

	});

router.route("/reservations/new")
	.post(function(req, res){
		if(!req.body.gobbledygook) return res.send(404, {message: "Not Found"});
		
		let reservation = new Reservation();
		reservation.email = req.body.email;
		reservation.guests = req.body.guests;
		reservation.content = req.body.content;
		reservation.hasSubmitted = req.body.hasSubmitted;

		reservation.save(function(err, reservation) {
			if (err){
				return res.send(500, {message: "Database Error."});
			}
			return res.json(reservation);
		});

	});

module.exports = router;