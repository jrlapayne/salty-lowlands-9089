Fauxble.Views.PagesHeader = Backbone.View.extend({
	
	template: JST['pages/header'],
	
	events: {
		'click #home' : 'homePage',
		'click #about' : 'aboutPage',
		'click #mfc' : 'mfcPage',
		'click #signin' : 'toggleSignin',
		'click #fb_login_header' : 'fbLogin',
		'focus input' : 'focusInput',
		'blur input' : 'blurInput',
		'submit #signin_form' : 'signin'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.user = this.attr.users.get(this.attr.current_user.get('id'));
	},
	
	render: function() {
		var self = this;
		
		$(this.el).addClass('wrapper');
		$(this.el).html(this.template());
		
		setTimeout(function() {
			if (self.user) {
				$(self.el).find('#profile').addClass('black');
				self.renderProfile();
			} else {
				$(self.el).find('#profile').addClass('blue');
				self.renderSignIn();
			}
		}, 0);
		
		return this;
	},
	
	renderProfile: function() {
		var view = new Fauxble.Views.UsersShow({
			attr: this.attr,
			user: this.user,
			is_sidebar: true
		});
		$(this.el).find('#profile').html(view.render().el);
	},
	
	renderSignIn: function() {
		var view = new Fauxble.Views.PagesSignin({
			attr: this.attr
		});
		$(this.el).find('#profile').html(view.render().el);
	},
	
	toggleSignin: function() {
		var element = $(this.el).find('.signin.panel'),
			button = $(this.el).find('#profile');

		if ($(element).hasClass('hide')) {
			$(element).removeClass('hide');
			$(button).addClass('active');
		} else {
			$(element).addClass('hide');
			$(button).removeClass('active');
		}
	},
	
	fbLogin: function() {
		gaEvent('Login', 'Facebook', 'Header', null);
		
		//window.location = "http://localhost:3000/auth/facebook";
		window.location = "http://salty-lowlands-9089.herokuapp.com/auth/facebook";
		//window.location = "http://fusegap.org/auth/facebook";	
	},
	
	focusInput: function(event) {
		var element = $(event.target).closest('input');
		
		if ($(element).attr('id') === 'Email') {
			if ($(element).val() === 'Email') {
				$(element).val('');
			}
		} else {
			if ($(element).attr('type') !== 'password') {
				$(element).val('');
				$(element).attr('type', 'password');
			}
		}
	},
	
	blurInput: function(event) {
		var element = $(event.target).closest('input');
		
		if ($(element).attr('id') === 'Email') {
			if ($(element).val() === '') {
				$(element).val('Email');
			}
		} else {
			if ($(element).val() === '') {
				$(element).val($(element).attr('id'));
				$(element).attr('type', 'text');
			}	
		}
	},
	
	signin: function(event) {
		event.preventDefault();
		
		var email = $(this.el).find('#Email').val(),
			password = $(this.el).find('#Password').val(),
			user;
		
		//start loading 'waiting for authentication'
		// find user by name and use save to hit update in controller
		
		user = this.attr.users.where({encrypted_email: email})[0];
		
		if (user) {
			if (user.authenticate(password)) {
				gaEvent('Login', 'Email', 'Header', null);
				user.save({}, {
					success: function(model, response) {
						window.location.reload();
					},
					error: function(model, response) {
						window.location.reload();
					}
				});
			} else {
				alert('password incorrect');
			}
		} else {
			alert('no user found');
		}
		
	},
	
	homePage: function() {
		Backbone.history.navigate('', true);
	},
	
	aboutPage: function() {
		Backbone.history.navigate('about', true);
	},
	
	mfcPage: function() {
		Backbone.history.navigate('mfc', true);
	}
});
//header