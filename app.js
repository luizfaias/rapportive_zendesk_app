(function() {

	return {
		events: {
			'app.activated': 'load_rapportive_info'
		},

		load_rapportive_info: function() {
			var currentUser = this.currentUser().name();
			this.switchTo('load_rapportive_info', {
				username: currentUser
			});
		}
	};

}());
