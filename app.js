(function() {

	return {	
		events: {
			'app.activated': 'load_rapportive_info'
		},

		load_rapportive_info: function() {
			var requester_email = this.ticket().requester().email();
			
			this.switchTo('load_rapportive_info', {
				username: requester_email
			});
		}
	};

}());
