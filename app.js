(function() {

    return {
		defaultState: 'loading',
		
        events: {
          'app.created':'load_rapportive_info'
        },

        requests: {
            api_call: function(email) {
                return {
                    url: 'http://rapportive-api-sinatra.herokuapp.com/api/v1/rapportive/' + email,
                    type:'GET',
                    dataType: 'json',
					contentType: 'application/json'
                };
            }
        },

        load_rapportive_info: function() {	
            var requester_email = this.ticket().requester().email();
			
			if(requester_email == null) {
				this.switchTo('not_found');
			} else {
				var request = this.ajax('api_call', requester_email);
				request.done(this.render_info);
				request.fail(this.render_error_page);
			}
        },

        render_info: function(data) {

			if(data) {
				var social_media = data.memberships;
				social_media = _.reject(social_media, function(el) { return el.site_name === "Twitter"; });
				
				this.switchTo('rapportive', {
					full_name: data.name,
					twitter_username: data.twitter_username,
					occupations: data.occupations,
					image_url: data.image_url_raw,
					social_media: social_media
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