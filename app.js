(function() {

	var requester_id;
	var requester_email;
	var has_twitter_profile;
	var API_endpoint;

	return {
		defaultState: 'loading',

		events: {
			'app.created': 'init',

			'click .update_twitter_btn': 'update_twitter_handle'
		},

		requests: {
			get_user_identities: function() {
				return {
					url: '/api/v2/users/' + requester_id + '/identities.json',
					type: 'GET'
				};
			},
			rapportive_api_call: function() {
				return {
					url: API_endpoint + '/api/v1/rapportive/' + requester_email,
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json'
				};
			},
			add_user_identity: function(twitter_handle) {
				return {
					url: '/api/v2/users/' + requester_id + '/identities.json',
					type: 'POST',
					data: {
						"identity": {
							"type": "twitter",
							"value": twitter_handle
						}
					}
				};
			}
		},

		init: function() {
			API_endpoint = this.setting('api_endpoint');
			requester_id = this.ticket().requester().id();
			requester_email = this.ticket().requester().email();

			this.has_twitter_profile();
			this.load_rapportive_info();
		},

		has_twitter_profile: function() {
			var request = this.ajax('get_user_identities', requester_id).done(function(data) {
				has_twitter_profile = _.pluck(data.identities, "type").contains("twitter");
			});
		},

		load_rapportive_info: function() {
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
		},

		update_twitter_handle: function() {
			var twitter_handle = this.$("#twitter_handle").val();

			var request = this.ajax('add_user_identity', twitter_handle);

			request.done(function() {
				services.notify(this.I18n.t('user.updated'));
				this.$('.update_twitter_btn').hide();
			});

			request.fail(function(data) {
				var error_message = data.responseJSON.details.value[0].description;
				services.notify(error_message, 'error');
			});
		}
	};

}());
