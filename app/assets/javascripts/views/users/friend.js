Fauxble.Views.UsersFriend = Backbone.View.extend({
	
	template: JST['users/friend'],
	
	events: {
		
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.friend = options.friend;
		this.loc = options.loc;
		this.subviews = [];
	},
	
	render: function() {
		var self = this;
		
		$(this.el).addClass('user friend');
		$(this.el).attr('id', this.loc);
		if (this.loc % 2 === 0) {
			$(this.el).addClass('dark');
		} else {
			$(this.el).addClass('light');
		}
		$(this.el).html(this.template({
			friend: this.friend
		}));
		
		setTimeout(function() {
			self.renderGlobalRank();
		}, 0);
		
		return this;
	},
	
	renderGlobalRank: function() {
		var view = new Fauxble.Views.RanksGlobal({
			attr: this.attr,
			user: this.attr.users.where({uid: this.friend['id']})[0]
		});
		this.subviews.push(view);
		$(this.el).find('#rank').html(view.render().el);
	},
	
	onClose: function() {
		var views = this.subviews;	
			
		for (var v = views.length; v > 0; v--) {
			var view = views[v - 1];

			view.remove();
			view.unbind();

			if (view.onClose) {
				view.onClose();
			}
		}
	}
});