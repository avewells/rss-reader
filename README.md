# rss-reader
Aggregates multiple RSS feeds into a single viewer.

[Live Version on Heroku](https://shrouded-mesa-12033.herokuapp.com/)

## Running Locally
These steps assume you have MongoDB installed locally. To install [visit here](https://docs.mongodb.com/manual/administration/install-community/)

`git clone https://github.com/avewells/rss-reader.git`

`cd rss-reader`

`npm install`

In a separate terminal:

`sudo mongod`

In original terminal:

`npm start`

Then navigate to http://localhost:8080

## Tech Stack
- MongoDB for database/model
- Node.js/Express for routing/controller
- Jade for view templating
- Bootstrap for styling
- jQuery for frontend

## TODO:
- ~~Base user auth on session token instead of user name~~
- Change db layout to users, feeds, userfeeds tables
- ~~Move sorting, date formatting, dashboard logic to frontend~~
- ~~Change having to re-fetch sources so often~~
- Use cache and background runner to always update a user's feeds
- ~~Lazy loading of feed~~
- Refactor views into more-reusable components
