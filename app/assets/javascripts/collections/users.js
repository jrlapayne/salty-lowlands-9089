Fauxble.Collections.Users = Backbone.Collection.extend({
	
	model: Fauxble.Models.User,
	url: 'users',
	
	authenticateUser: function(name, password, confirm, min_length) {
		if (name.length > min_length - 1) {
			if (this.isUnique(name)) {
				if (password.length > min_length - 1) {
					if (password === confirm) {
						this.createUser(name, password);
					} else {
						alert('passwords don\'t match');
					}
				} else {
					alert('password must be at least ' + min_length + ' characters long');
				}
			} else {
				alert('that user name is unavailable');
			}
		} else {
			alert('user name must be at least ' + min_length + ' characters long');
		}
	},
	
	isUnique: function(str) {
		var is_unique = true,
			users = this.toArray();
		
		for (u = 0; u < users.length; u++) {
			if (users[u].get('name').toLowerCase() === str.toLowerCase()) {
				is_unique = false;
				break;
			}
		}
		
		return is_unique;
	},
	
	createUser: function(name, password) {
		this.create({
			name: name,
			password: password,
			signed_in: true
		}, {
			success: function(model, response) {
				//set default challenges
				window.location.reload();
			},
			error: function(model, response) {
				// fail
			}
		});
	},
	
	createFromFacebook: function(user, view) {
		this.create({
			name: user['name'],
			uid: user['id'],
			provider: 'facebook'
		}, {
			success: function(model, response) {
				//end loading
				view.setChallengeUser(model);
			},
			error: function(model, response) {
				//alert error
			}
		});
	},
	
	getTopFusers: function(challenges, user) {
		var users = [],
			a_completes,
			b_completes,
			completes;
		
		this.each(function(u) {
			completes = challenges.where({is_finished: true, user_id: u.get('id')}).length + challenges.where({is_finished: true, challenger_id: u.get('id')}).length;
			if (completes > 0) {
				users.push(u);
			}
		});
		
		if (!isNaN(users.indexOf(user))) {
			users.splice(users.indexOf(user), 1);
		}
		
		users.sort(function(a, b) {
			a_completes = challenges.where({is_finished: true, user_id: a.get('id')}).length + challenges.where({is_finished: true, challenger_id: a.get('id')}).length;
			b_completes = challenges.where({is_finished: true, user_id: b.get('id')}).length + challenges.where({is_finished: true, challenger_id: b.get('id')}).length;
			
			return b_completes - a_completes;
		});
		
		return users;
	}
});
