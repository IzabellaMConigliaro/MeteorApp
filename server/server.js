;(function () {

  "use strict";


////////////////////////////////////////////////////////////////////
// Patches
//

if (!console || !console.log) {
  // stub for IE
  console = { 
    log: function (msg) {
      $('#log').append(msg)
    } 
  };
}


////////////////////////////////////////////////////////////////////
// Startup
//

Meteor.startup(function () {

  ////////////////////////////////////////////////////////////////////
  // Create Test Secrets
  //
    
  if (Meteor.add.find().fetch().length === 0) {
    Meteor.add.insert({secret:"<p>teste</p>"});
    Meteor.add.insert({secret:"<br>blabla</br>"});
  }


  ////////////////////////////////////////////////////////////////////
  // Create Test Users
  //

  if (Meteor.users.find().fetch().length === 0) {

    console.log('Creating users: ');

    var users = [
        {name:"Normal User",email:"normal@love146.com",roles:[]},
        {name:"Facilitator User",email:"facilitator@love146.com",roles:['facilitator']},
        {name:"Agency User",email:"agency@love146.com",roles:['agency']},
        {name:"Staff User",email:"staff@love146.com",roles:['staff']}
      ];

    _.each(users, function (userData) {
      var id,
          user;
      
      console.log(userData);

      id = Accounts.createUser({
        email: userData.email,
        password: "test123",
        profile: { name: userData.name }
      });

      // email verification
      Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});

      Roles.addUsersToRoles(id, userData.roles);
    
    });
  }



  ////////////////////////////////////////////////////////////////////
  // Prevent non-authorized users from creating new users
  //

  Accounts.validateNewUser(function (user) {
    var loggedInUser = Meteor.user();

    if (Roles.userIsInRole(loggedInUser, ['staff','agency'])) {
      return true;
    }

    throw new Meteor.Error(403, "Not authorized to create new users");
  });

});


////////////////////////////////////////////////////////////////////
// Publish
//


// Authorized users can view secrets
Meteor.publish("add", function () {
  var user = Meteor.users.findOne({_id:this.userId});

  if (Roles.userIsInRole(user, ["staff","agency"])) {
    return Meteor.add.find();
  }

  this.stop();
  return;
});

// Authorized users can manage user accounts
Meteor.publish("users", function () {
  var user = Meteor.users.findOne({_id:this.userId});

  if (Roles.userIsInRole(user, ["staff"])) {
   // var users = Roles.getUsersInRole(["staff"]);
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}});
  } 

  if (Roles.userIsInRole(user, ["agency"])) {
   // var users = Roles.getUsersInRole(["staff"]);
    return Meteor.users.find({"roles" : ["facilitator"], "profile.createdBy" : user._id}, {fields: {emails: 1, profile: 1, roles: 1}});
  } 
  this.stop();
  return;
});

Meteor.methods({

  createNewAgency: function(name,email,password,roles){
  var CurrentUser = Meteor.users.findOne({_id:this.userId});
   var users = [{name:name,email:email,roles:[roles]},
               ];
_.each(users, function (user) {
 var id;
id = Accounts.createUser({
  name:user.name,
 email: user.email,
 password: password,
 profile: { name: user.name, createdBy: CurrentUser._id }
 });
if (user.roles.length > 0) {
      Roles.addUsersToRoles(id, user.roles);
     }
    });
},
 createNewUser: function(first_name,last_name,email,password,roles){
  var CurrentUser = Meteor.users.findOne({_id:this.userId});
   var users = [{first_name:first_name,last_name:last_name,email:email,roles:[roles]},
               ];
_.each(users, function (user) {
 var id;
id = Accounts.createUser({
  first_name: user.first_name,
  last_name:user.last_name,
 email: user.email,
 password: password,

 profile: { first_name: user.first_name, last_name: last_name,  createdBy: CurrentUser._id }
 });
if (user.roles.length > 0) {
      Roles.addUsersToRoles(id, user.roles);
     }
    });
},
   deleteUser : function(id){       
  return Meteor.users.remove(id);
  }

});
}());
