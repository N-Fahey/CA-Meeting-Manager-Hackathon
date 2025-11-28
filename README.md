# Meeting Scheduler

### Packages
* Express
* Mongoose
* Bcryptjs
* CORS
* Helmet
* jsonwebtoken
* validator - email

### Dev Packages
* eslint
* prettier


### Models
* Users
	* FName
	* LName
	* Email
	* PWD
* Meetings
	* Start time
	* End time
	* Title
	* Description
	* Host (User)
	* Attendees({User: _id, status: accepted/declined})

### Endpoints
* Auth
	* Register
	* Login
* Meeting
	* Create
	* Invite (host can post to invite a user or list of users to existing mtg)
	* Respond (invitee can respond to a meeting, accept/decline)
	* Update (change meeting name, description)
	* Cancel
	