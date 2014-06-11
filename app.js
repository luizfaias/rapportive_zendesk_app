(function() {
	
	var has_twitter_profile;

	return {
		defaultState: 'loading',

		events: {
			'app.created': 'init'
		},

		requests: {
			user_identities: function(id) {
				return {
					url: '/api/v2/users/' + id + '/identities.json',
					type: 'GET'
				};
			},
			rapportive_api_call: function(email) {
				return {
					url: 'http://rapportive-api-sinatra.herokuapp.com/api/v1/rapportive/' + email,
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json'
				};
			}
		},
		
		init: function() {
			this.has_twitter_profile();
			this.load_rapportive_info();
		},

		has_twitter_profile: function() {
			var requester_id = this.ticket().requester().id();				
			var request = this.ajax('user_identities', requester_id).done(function(data) {
				has_twitter_profile = _.pluck(data.identities, "type").contains("twitter");
			});
		},

		load_rapportive_info: function() {
			var requester_email = this.ticket().requester().email();

			if (requester_email == null) {
				this.switchTo('not_found');
			} else {			
				var request = this.ajax('rapportive_api_call', requester_email);
				request.done(this.render_info);
				request.fail(this.render_error_page);
			}
		},

		render_info: function(data) {

			if (data) {
				var social_media = data.memberships;
				social_media = _.reject(social_media, function(el) {
					return el.site_name === "Twitter";
				});

				this.switchTo('rapportive', {
					full_name: data.name,
					twitter_username: data.twitter_username,
					occupations: data.occupations,
					image_url: data.image_url_raw,
					social_media: social_media,
					has_twitter_profile: has_twitter_profile
				});
			} else {
				this.render_error_page();
			}
		},

		render_error_page: function() {
			this.switchTo('error');
		}
	};

}());
