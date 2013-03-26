Fauxble.Views.MfcLike = Backbone.View.extend({
	
	template: JST['mfc/like'],
	
	events: {
		'click #continue' : 'closePopup',
		'click .like-button' : 'gaEvent'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.parent_element = options.element;
		this.background_element = options.background;
	},
	
	render: function() {
		$(this.background_element).addClass('mfc-popup-background');
		$(this.el).addClass('mfc-popup');

		$(this.el).html(this.template());
		
		return this;
	},
	
	closePopup: function(event) {
		var parent = this.parent_element,
			background = this.background_element;
		
		this.attr.users.trigger('continue', {user: this.attr.users.get(this.attr.current_user.get('id')), view: this});
		$(background).removeClass('mfc-popup-background');
		$(parent).empty();
	},
	
	fbLogin: function() {
		console.log('ga event');
		ga('send', 'event', 'login', 'facebook', 'mfc like', 1);
		
		//window.location = "http://localhost:3000/auth/facebook";
		window.location = "http://salty-lowlands-9089.herokuapp.com/auth/facebook";
		//window.location = "http://fusegap.org/auth/facebook";
	},
	
	gaEvent: function() {
		console.log('ga event');
		ga('send', 'event', 'liked', 'potential', 'mfc like', 1);
	}
});