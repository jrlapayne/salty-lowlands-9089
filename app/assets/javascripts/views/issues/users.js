Fauxble.Views.IssuesUsers = Backbone.View.extend({
	
	template: JST['issues/users'],
	
	events: {
		
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.issue = options.issue;
		this.user = this.attr.users.get(this.attr.current_user.get('id'));
		this.users = [];
		this.sortByFriends(this.attr.tasks.getUsers(this.attr.users, this.issue));
	},
	
	render: function() {
		var self = this;
		
		$(this.el).html(this.template());
		
		setTimeout(function() {
			for (i = 0; i < self.users.length; i++) {
				self.appendFace(self.users[i]);
			}
		}, 0);
		
		return this;
	},
	
	appendFace: function(user) {
		var is_self = false;
		
		if (this.user.get('id') === user.get('id')) {
			is_self = true;
		}
		
		var view = new Fauxble.Views.UsersFace({
			attr: this.attr,
			user: user,
			is_current_user: is_self
		});
		$(this.el).append(view.render().el);
	},
	
	sortByFriends: function(users) {
		var self = this,
			uids = [],
			friends;
		
		if (this.user.get('signed_in_fb')) {
			FB.api('/me/friends?access_token=' + self.user.get('encrypted_token'), function(response) {
				friends = response['data'];
				
				for (f = 0; f < friends.length; f++) {
					uids.push(friends[f]['id']);
				}

				users.sort(function(a, b) {
					if (uids.indexOf(a.get('uid')) && !uids.indexOf(b.get('uid'))) {
						return 1;
					}
					if (uids.indexOf(b.get('uid')) && !uids.indexOf(a.get('uid'))) {
						return -1;
					}
					return 0;
				});
				
				self.users = users;
				self.render();
			});
		} else {
			this.users = users;
		}
	}
});