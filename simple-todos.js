Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	// This code only runs on the client
	Template.body.helpers({
		tasks: function () {
			if(Session.get("hideCompleted")) {
				return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			}
			else {
				return Tasks.find({}, {sort: {createdAt: -1}});
			}

		},

		hideCompleted: function () {
			return Session.get("hideCompleted");
		},

		incompleteCount: function () {
			return Tasks.find({checked: {$ne: true}}).count();
		}

	});

	Template.body.events({
		"submit .new-task": function (event) {
			// Prevent default browser form submit
			event.preventDefault();
			// Get value from form element
			var text = event.target.text.value;
			// Insert a task into the collection
			Tasks.insert({
				text: text,
				createdAt: new Date(), // current time
				owner: Meteor.userId(),
				username: Meteor.user().username
			});
			// Clear form
			event.target.text.value = "";
		},

		"change .hide-completed input": function (event) {
			Session.set("hideCompleted", event.target.checked);
		},

		"click .toggle-checked": function () {
			// Set the checked property to the opposite of its current value
			Tasks.update(this._id, {
				$set: {checked: ! this.checked}
			});
		},

		"click .delete": function () {
			Tasks.remove(this._id);
		}

	});

	//Configure Accounts UI to use username instead of email address.
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}




