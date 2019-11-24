var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
	email: String,
	guests: [
		{
			name: String,
			attending: Boolean
		}
	],
	content: String,
	hasSubmitted: Boolean
});

mongoose.model("Reservation", reservationSchema);
