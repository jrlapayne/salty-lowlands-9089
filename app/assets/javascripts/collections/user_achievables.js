Fauxble.Collections.UserAchievables = Backbone.Collection.extend({
	
	model: Fauxble.Models.UserAchievable,
	url: 'user_achievables',
	
	hasEarned: function(user, achievable) {
		if (this.where({user_id: user.get('id'), achievable_id: achievable.get('id')})[0]) {
			return true;
		} else {
			return false;
		}
	},
	
	createUserAchievable: function(user, achievable) {
		var self = this;
		
		this.create({
			user_id: user.get('id'),
			achievable_id: achievable.get('id')
		}, {
			success: function(model, response) {
				self.trigger('feed', model);
			},
			error: function(model, response) {
				
			}
		});
	}
});
