# AirTribePublic
News Aggregator API

News aggregator API is a RESTful API application which allows user to register themselves on the news aggregator, login and update news preferences. It also allows to fetch the news based on user preferences.

Following are the supported endpoints.

    POST /register => Register as new user.

    POST /login => Login with email and password.

    GET /news => Retrieves news based on logged-in users' news preferences or from different media houses.

    PUT /preferences => Add news categories for which the user wants to see news articles.

    GET /preferences => Retrieve news categories for logged-in user.

