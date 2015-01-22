var eatz =  eatz || {};

// note View-name (HeaderView) matches name of template HeaderView.html
eatz.HeaderView = Backbone.View.extend({

    initialize: function () {
	this.render();
    },

    render: function () {
	this.$el.html(this.template());  // create DOM content for HomeView
	return this;    // support chaining
    },
  
    events:{
       'click input[type=radio]' : 'sortHandler',
       'click #signup' : 'signUp',
       'change' : "change",
       'click .btn.btn-primary.login': 'signIn',
       'click .btn.btn-primary.logout': 'signOut'
    },

    sortHandler: function(events) {
       console.log(events.currentTarget.value);
       eatz.order = events.currentTarget.value;
       eatz.pubSub.trigger('eventName', events);

    },

    change: function (event) {
        self = this;
        eatz.utils.hideNotice();   // Remove any existing alert message
        
        if (!this.model)
           this.model = new eatz.User();  // create model to hold auth credentials

           var change = {};  // object to hold input changes

           // note change event is triggered once for each changed field value
           change[event.target.name] = _.escape(event.target.value);
        
           // reflect changes in the model
           this.model.set(change);
           // run validation rule (if any) on changed item
           var check = this.model.validateItem(event.target.name);

           check.isValid ? eatz.utils.clearValidationError(event.target.id) : eatz.utils.showValidationError(event.target.id, check.message);
    },

    signUp: function(event){
        event.preventDefault();
        var self =this;
        $('#sign-up').removeClass('open');
        var un = self.$('#su-username').val();
        var em = self.$('#su-email').val();
        var pw = self.$('#su-password').val();
        var rpw = self.$('#su-repassword').val();
        var formdata = {'username': un, 'email': em, 'password':pw};
        var user = new eatz.User(formdata);
        var self = this;
        if(pw != rpw){
           eatz.utils.showNotice("Error:", "error", "please enter correct data!");
        }else{
           console.log(user);
           $.ajax({
              url: '/auth',
              type: 'post',
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(formdata),
              success: function(res){
                  if(res.error){
                      eatz.utils.showNotice('Sign up Failed:', 'error', "Failed to create account");
                  }else{
                    eatz.utils.showNotice('Signup Successful!:', 'success', 'Welcome ' + res.username);
		    // update UI to show username, show/hide logout form
		    $('#greet').html(res.username);
		    $('#logoutUser').html('<b>'+res.username+'</b>');
		    $('.btn.login').css("display","none");
		    $('.logintext').css("display","none");
		    $('.btn.logout').css("display","block");
		    $('#signup_form')[0].reset();   // clear login form
	            $('#signupdrop').removeClass('open');
                    $('.Add-memu').css("display", "block");
                    var info = {};
                    info.id = res.userid;
                    user.set(info);
                    self.model = user;
                  }
              },
              error: function(res){
                  eatz.utils.showNotice('Error:', 'error', res.responseText);
              }
           });
        }
    },

    signIn: function(event){
        event.preventDefault();
	// get value of "remember me" checkbox
        var remember = (this.$('#remember').is(':checked')) ? 1 : 0;
        var self = this;
        $.ajax({
            url: '/auth',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({'username': self.$('#username').val(),
				  'password': self.$('#password').val(),
                                  'remember': remember,
                                  'login': 1
                                  }),
            success: function(res) {
              if (res.username) { 
		// showing username in place of Sign-in.
		// display a success message in notification panel
                    eatz.utils.showNotice('Signup Successful!:', 'success', 'Welcome ' + res.username);
                    // update UI to show username, show/hide logout form
                    $('#greet').html(res.username);
                    $('#logoutUser').html('<b>'+res.username+'</b>');
                    $('.btn.login').css("display","none");
                    $('.logintext').css("display","none");
                    $('.btn.logout').css("display","block");
                    $('#login_form')[0].reset();   // clear login form
                    $('#logindrop').removeClass('open');
                    $('.Add-memu').css("display", "block");
                    self.model = new eatz.User(res);
              } else {
                eatz.utils.showNotice('Error:', 'error', res.error);
              }
            },
            error: function (err) {
                eatz.utils.showNotice('Error:', 'error', err.responseText);
            }
        });

    },

    signOut: function(event){
        event.preventDefault();
        var self = this;
        console.log(self.$('#logoutUser').val());
        $.ajax({
            url: '/auth',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({'username': self.$('#logoutUser').val()
                                  }),
            success: function(res) {
               console.log(res);
               $('#greet').html("Sign In" + "<strong class='caret'></strong>");
               $('#logoutUser').html("");
               $('.btn.login').css("display","block");
               $('.logintext').css("display","block");
               $('.btn.logout').css("display","none");
               $('#login_form')[0].reset();
               $('#logindrop').removeClass('open');
               $('.Add-memu').css("display", "none");
               self.model = new eatz.User(res);
               console.log(self.model);
               eatz.utils.hideNotice();
            },
            error: function (err) {
                eatz.utils.showNotice('Error:','error', err.responseText);
            }
        });

    },

    select: function(menuItem) {
        $('.active').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});

