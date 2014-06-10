(function() {

    return {
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
            var request = this.ajax('api_call', requester_email);
            request.done(this.showInfo);
            request.fail(this.showError);
        },

        showInfo: function(data) {
			if(data) {
				this.switchTo('rapportive', data);
			} else {
				this.switchTo('error');
			}
        },

        showError: function() {
            this.switchTo('error');
        }
    };

}());