Fauxble.Views.QuestionsResult = Backbone.View.extend({
	
	template: JST['questions/result'],
	
	events: {
		'click #goto_source' : 'source'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.challenge = options.challenge;
		this.question = options.question;
		this.user = this.attr.users.get(this.attr.current_user.get('id'));
		this.subviews = [];
		
		this.setRoundSpecifics();
	},
	
	setRoundSpecifics: function() {
		if (this.user.get('id') === this.challenge.get('challenger_id')) {
			this.users = {
				current: this.user,
				opponent: this.attr.users.get(this.challenge.get('user_id'))
			};
			this.task = null;
		} else {
			this.users = {
				opponent: this.attr.users.get(this.challenge.get('challenger_id')),
				current: this.user
			};
		}
		
		if (this.question.get('is_slider')) {
			this.correct = this.attr.sliders.where({question_id: this.question.get('id')})[0].getDisplayable().correct;
		} else {
			this.correct = this.attr.answers.where({question_id: this.question.get('id'), is_correct: true})[0].get('title');
		}
	},
	
	render: function() {
		var self = this;
		$(this.el).attr('id', this.question.get('id'));
		$(this.el).addClass('question result');
		$(this.el).html(this.template({
			question: this.question,
			correct: this.correct
		}));
		
		setTimeout(function() {
			self.renderUser(self.users.current, $(self.el).find('#user_right'), true);
			self.renderUser(self.users.opponent, $(self.el).find('#user_left'), false);
		}, 0);
		
		return this;
	},
	
	renderUser: function(user, element, is_right) {
		var view = new Fauxble.Views.UsersResult({
			attr: this.attr,
			challenge: this.challenge,
			question: this.question,
			user: user,
			is_right: is_right
		});
		this.subviews.push(view);
		$(element).html(view.render().el);
	},
	
	source: function(event) {
		var source = this.attr.sources.where({question_id: this.question.get('id')})[0];
		
		gaEvent('Source', 'Results', String(this.question.get('id')), null);
		window.open(source.get('url'), '_blank');
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