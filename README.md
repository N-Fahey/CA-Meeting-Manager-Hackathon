# Meeting Scheduler
A lightweight API to create & manage meeting requests

### Packages
* Express
* Mongoose
* Bcryptjs
* CORS
* Helmet
* jsonwebtoken
* validator
* cookie-parser

### Dev Packages
* eslint
* prettier
* jest
* supertest

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