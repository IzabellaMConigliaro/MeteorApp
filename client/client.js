;(function () {

  "use strict";


////////////////////////////////////////////////////////////////////
// Routing stub
//
// Separate routing package details from general app code.
Meteor.navigateTo = function (path) {
  // ...over-ridden in routing.js
};




////////////////////////////////////////////////////////////////////
// App.signout
//
App.signout = function () {
  console.log('logging out...');
  Meteor.logout(function () {
    console.log('...done');
    Meteor.navigateTo('/');
  });
};




////////////////////////////////////////////////////////////////////
// Patches
//

// stubs for IE
if (!window.console) {
  window.console = {}
}
if (!window.console.log) {
  window.console.log = function (msg) {
    $('#log').append('<br /><p>' + msg + '</p>')
  };
}

// fix bootstrap dropdown unclickable issue on iOS
// https://github.com/twitter/bootstrap/issues/4550
$(document).on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) {
    e.stopPropagation();
});




////////////////////////////////////////////////////////////////////
// Subscriptions
//

Deps.autorun(function () {
  // register dependency on user so subscriptions
  // will update once user has logged in
  var user = Meteor.user();

  // add
  Meteor.subscribe('add');

  Meteor.subscribe('addStaff');

  // users, for manage-users page
  Meteor.subscribe('users');
});




////////////////////////////////////////////////////////////////////
// Templates
//

Template.signin.rendered = function () {
  // auto-trigger accounts-ui login form dropdown
  Accounts._loginButtonsSession.set('dropdownVisible', true);
};

Template.header.events({
  // template data, if any, is available in 'this'
  'click .btn-navbar' : openCloseNav
});
Template.header.helpers({
  displayName: function () {
    return displayName();
  }
});

Template.add.helpers({
  add: function () {
    return Meteor.add.find();
  }
});

Template.addStaff.helpers({
  add: function () {
    return Meteor.addStaff.find();
  }
});

Template.noteOfTheDay.helpers({
  note: function () {
    return "Welcome, " + displayName() + ".";
  }
});

Template.manageAgency.helpers({
  users: function () {
    return Meteor.users.find({"roles" : ["agency"]}, {fields: {emails: 1, profile: 1, roles: 1}});
  },
  name: function () {
    return this.profile.name;
  },
  email: function () {
    return this.emails[0].address;
  }
});

Template.manageAgency.events({
  'click a': function(){
    console.log("You clicked an li element" + this._id);
}
});

Template.manageFacilitator.helpers({
  users: function () {
    return Meteor.users.find({"roles" : ["facilitator"]}, {fields: {emails: 1, profile: 1, roles: 1}});
  },
  first_name: function () {
    return this.profile.first_name;
  },
  last_name: function () {
    return this.profile.last_name;
  },
  email: function () {
    return this.emails[0].address;
  }
});

Template.manageStaff.helpers({
  users: function () {
    return Meteor.users.find({"roles" : ["staff"]}, {fields: {emails: 1, profile: 1, roles: 1}});
  },
  first_name: function () {
    return this.profile.first_name;
  },
  last_name: function () {
    return this.profile.last_name;
  },
  email: function () {
    return this.emails[0].address;
  }
});

Template.newAgency.events({
        'submit #newAgencyForm': function(e, t) {
            e.preventDefault();
            var newAgencyForm = $(e.currentTarget),
                name = trimInput(newAgencyForm.find(
                    '#agencyName').val().toLowerCase()),
                email = trimInput(newAgencyForm.find('#agencyEmail').val()
                    .toLowerCase()),
                emailConfirm = trimInput(newAgencyForm.find(
                    '#agencyEmailConfirm').val().toLowerCase()),
                password = newAgencyForm.find('#agencyPassword').val(),
                passwordConfirm = newAgencyForm.find(
                    '#agencyPasswordConfirm').val();
            if (isNotEmpty(name) && isNotEmpty(email) &&
                isNotEmpty(emailConfirm) && isNotEmpty(password) &&
                isEmail(email) && areValidEmails(email,
                    emailConfirm) && areValidPasswords(password,
                    passwordConfirm)) {

          Meteor.call("createNewAgency", name, email, password, 'agency'), function(err) {
                    if (err) {
                        if (err.message ===
                            'Email already exists. [403]') {
                          alert('We are sorry but this email is already used.');
                            console.log(
                                'We are sorry but this email is already used.'
                            );
                        } else {
                          alert('We are sorry but something went wrong.');
                            console.log(
                                'We are sorry but something went wrong.'
                            );
                        }
                    } else {
                        console.log(
                            'Congrats, you\'re in!'
                        );
                    }
                };
            }
            return false;
        }
    });

Template.newFacilitator.events({
        'submit #newFacilitatorForm': function(e, t) {
            e.preventDefault();
            var newFacilitatorForm = $(e.currentTarget),
                first_name = trimInput(newFacilitatorForm.find(
                    '#facilitatorFirstName').val().toLowerCase()),
                last_name = trimInput(newFacilitatorForm.find(
                    '#facilitatorLastName').val().toLowerCase()),
                email = trimInput(newFacilitatorForm.find('#facilitatorEmail').val()
                    .toLowerCase()),
                emailConfirm = trimInput(newFacilitatorForm.find(
                    '#facilitatorEmailConfirm').val().toLowerCase()),
                password = newFacilitatorForm.find('#facilitatorPassword').val(),
                passwordConfirm = newFacilitatorForm.find(
                    '#facilitatorPasswordConfirm').val();
            if (isNotEmpty(first_name) &&  isNotEmpty(last_name) &&isNotEmpty(email) &&
                isNotEmpty(emailConfirm) && isNotEmpty(password) &&
                isEmail(email) && areValidEmails(email,
                    emailConfirm) && areValidPasswords(password,
                    passwordConfirm)) {

          Meteor.call("createNewUser", first_name, last_name, email, password, 'facilitator'), function(err) {
                    if (err) {
                        if (err.message ===
                            'Email already exists. [403]') {
                          alert('We are sorry but this email is already used.');
                            console.log(
                                'We are sorry but this email is already used.'
                            );
                        } else {
                          alert('We are sorry but something went wrong.');
                            console.log(
                                'We are sorry but something went wrong.'
                            );
                        }
                    } else {
                        console.log(
                            'Congrats, you\'re in!'
                        );
                    }
                };
            }
            return false;
        }
    });

Template.newStaff.events({
        'submit #newStaffForm': function(e, t) {
            e.preventDefault();
            var newStaffForm = $(e.currentTarget),
                first_name = trimInput(newStaffForm.find(
                    '#staffFirstName').val().toLowerCase()),
                last_name = trimInput(newStaffForm.find(
                    '#staffLastName').val().toLowerCase()),
                email = trimInput(newStaffForm.find('#staffEmail').val()
                    .toLowerCase()),
                emailConfirm = trimInput(newStaffForm.find(
                    '#staffEmailConfirm').val().toLowerCase()),
                password = newStaffForm.find('#staffPassword').val(),
                passwordConfirm = newStaffForm.find(
                    '#staffPasswordConfirm').val();
            if (isNotEmpty(first_name) &&  isNotEmpty(last_name) &&isNotEmpty(email) &&
                isNotEmpty(emailConfirm) && isNotEmpty(password) &&
                isEmail(email) && areValidEmails(email,
                    emailConfirm) && areValidPasswords(password,
                    passwordConfirm)) {

          Meteor.call("createNewUser", first_name, last_name, email, password, 'staff'), function(err) {
                    if (err) {
                        if (err.message ===
                            'Email already exists. [403]') {
                            console.log(
                                'We are sorry but this email is already used.'
                            );
                          alert('We are sorry but this email is already used.');
                        } else {
                            console.log(
                                'We are sorry but something went wrong.'
                            );
                            alert('We are sorry but something went wrong.');
                        }
                    } else {
                        console.log(
                            'Congrats, you\'re in!'
                        );
                    }
                };
            }
            return false;
        }
    });





////////////////////////////////////////////////////////////////////
// Misc helper functions
//

function displayName (user) {
  var name;

  if (!user) {
    user = Meteor.user();
  }

  if (!user) return "<missing user>";

  if (user.profile) {
    name = user.profile.name;
  }

  if ('string' === typeof name) {
    name = name.trim();
  } else {
    name = null;
  }

  if (!name && user.emails && user.emails.length > 0) {
    name = user.emails[0].address;
  }

  return name || "<missing name>";
}


// insta-open/close nav rather than animate collapse.
// this improves UX on mobile devices
function openCloseNav (e) {
  // Select .nav-collapse within same .navbar as current button
  var nav = $(e.target).closest('.navbar').find('.nav-collapse');

  if (nav.height() != 0) {
    // If it has a height, hide it
    nav.height(0);
  } else {
    // If it's collapsed, show it
    nav.height('auto');
  }
}

}());



trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
};
isNotEmpty = function(value) {
    if (value && value !== '') {
        return true;
    }
    alert('Please fill in all required fields.');
    console.log('Please fill in all required fields.');
    return false;
};
isEmail = function(value) {
    var filter =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    alert('Please enter a valid email address.');
    console.log('Please enter a valid email address.');
    return false;
};
isValidPassword = function(password) {
    if (password.length < 6) {
      alert('Your password should be 6 characters or longer.');
        console.log('Your password should be 6 characters or longer.');
        return false;
    }
    return true;
};
areValidEmails = function(email, confirm) {
    if (!isEmail(email)) {
        return false;
    }
    if (email !== confirm) {
      alert('Your two emails are not equivalent.');
        console.log('Your two emails are not equivalent.');
        return false;
    }
    return true;
};
areValidPasswords = function(password, confirm) {
    if (!isValidPassword(password)) {
        return false;
    }
    if (password !== confirm) {
      alert('Your two passwords are not equivalent.');
        console.log('Your two passwords are not equivalent.');
        return false;
    }
    return true;
};
