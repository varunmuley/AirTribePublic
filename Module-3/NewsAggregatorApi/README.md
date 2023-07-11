News Aggregator API

News aggregator API is a RESTful API application which allows user to register themselves on the news aggregator, login and update news preferences. It also allows to fetch the news based on user preferences.

Following are the available endpoints.

POST /auth/register => Register as new user.
POST /auth/login => Login with email and password.
GET /news => Retrieves news based on logged-in users' news preferences or from different media houses.
GET /news/search/:keword => Retrieve news articles based on a particular key and store them in the Redis cache
GET /news/read => Retrieve news articles for logged-in user from Redis cache
PUT /preferences => Add news categories for which the user wants to see news articles.
GET /preferences => Retrieve news categories for logged-in user.