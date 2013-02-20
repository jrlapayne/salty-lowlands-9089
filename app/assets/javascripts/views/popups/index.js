Fauxble.Views.PopupsIndex = Backbone.View.extend({
	
	initialize: function(options) {
		this.attr = options.attr;
		this.user = this.attr.users.get(this.attr.current_user.get('id'));
		this.subviews = [];
		
		//this.attr.user_achievables.on('add', this.popupAchievable, this);
	},
	
	render: function() {
		return true;
	},
	
	popupAchievable: function(model) {
		if (this.isCurrentUser(model)) {
			var view = new Fauxble.Views.PopupsAchievable({
				achievable: model
			});
			this.subviews.push(view);
			$(this.el).html(view.render().el);
		}
	},
	
	isCurrentUser: function(model) {
		if (model.get('user_id') === this.user.get('id')) {
			return true;
		} else {
			return false;
		}
	},
	
	onClose: function() {
		this.attr.user_achievables.unbind('add', this.popupAchievable);
		
		_.each(this.subviews, function(view) {
			view.remove();
			view.unbind();

			if (view.onClose) {
				view.onClose();
			}
		});
	}
});