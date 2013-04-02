Fauxble.Views.MfcRight = Backbone.View.extend({
	
	template: JST['mfc/right'],
	
	events: {
		'click #fb_login' : 'fbLogin',
		'click #email_signup' : 'toggleForm',
		'focus input' : 'focusInput',
		'blur input' : 'blurInput',
		'submit #signup' : 'createUser'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.router = options.router;
		this.answered = false;
	},
	
	render: function() {
		var self = this;
		
		$(this.el).html(this.template());
		
		setTimeout(function() {
			self.checkSignedIn();
		}, 0);
		
		return this;
	},
	
	checkSignedIn: function() {
		var user = this.attr.users.get(this.attr.current_user.get('id')),
			element = $(this.el).find('.MFC_signin_container');
		
		if (user) {
			if (user.get('signed_in') || user.get('signed_in_fb')) {
				$(element).addClass('hide');
			} else {
				if (!window.facts_question) {
					window.facts_question = true;
					this.router.mfcQuestion();
				}
			}
		} else {
			if (!window.facts_question) {
				window.facts_question = true;
				this.router.mfcQuestion();
			}
		}
	},
	
	fbLogin: function() {
		var self = this;
		
		$(window).scrollTop(0);
		FB.api('/me/likes/471887209511817',function(response) {
			if(response.data) {
				if(response.data[0]) {
					self.fbSignIn();
				} else {
					self.fbLikePopup();	
				}
			} else {
				self.fbSignIn();
			}
		});
	},
	
	fbSignIn: function() {
		gaEvent('Login', 'Facebook', 'MFC Right', null);
		fbLogin();
	},
	
	fbLikePopup: function() {
		this.router.mfcLike();
	},
	
	toggleForm: function() {
		var element = $(this.el).find('#signup_form');
		if ($(element).hasClass('hide')) {
			$(element).removeClass('hide');
			$(window).scrollTop($(window).scrollTop() + 250);
		} else {
			$(element).addClass('hide');
		}
	},
	
	focusInput: function(event) {
		var element = $(event.target).closest('input');
		
		if ($(element).val() === $(element).attr('id').replace('_', ' ')) {
			$(element).val('');
			
			if ($(element).attr('id').split('Password').length > 1) {
				$(element).attr('type', 'password');
			}
		}
	},
	
	blurInput: function(event) {
		var element = $(event.target).closest('input');
		
		if ($(element).val() === '') {
			$(element).val($(element).attr('id').replace('_', ' '));
			if ($(element).attr('type', 'password')) {
				$(element).attr('type', 'text');
			}
		}
	},
	
	createUser: function(event) {
		event.preventDefault();
		
		var name = $(this.el).find('#User_Name').val(),
			email = $(this.el).find('#Email').val(),
			password = $(this.el).find('#Password').val(),
			confirm = $(this.el).find('#Confirm_Password').val();
		
		//start loading 'waiting for authentication'	
		this.attr.users.authenticateUser(name, email, password, confirm, 6);
	}
});