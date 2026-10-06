# Dog Adoption API

A backend project I built during Springboard’s Software Engineering Career Track. Users can create an account, register dogs, and adopt dogs registered by other users.

## Features

- Create an account and log in.
- Register a dog with a name and description.
- View your registered and adopted dogs.
- Filter your registered dogs by adoption status.
- Adopt another user’s dog and leave a thank-you message.
- Remove dogs you registered, as long as they haven’t been adopted.

Users cannot adopt their own dogs or adopt a dog that has already been adopted.

## Built with

Node.js, Express, MongoDB, Mongoose, JWT, and bcrypt.

Tests use Mocha and Chai.

## Run the project

You’ll need Node.js 22 or newer and MongoDB.

1. Download or clone the project.
2. Install the packages:

```sh
npm ci
```

3. Copy `.env.example` to a new file named `.env`. Add your MongoDB connection string as `MONGODB_URI` and choose a long random value for `JWT_SECRET`. Keep `.env` private.
4. Start the server:

```sh
npm start
```

The API runs at `http://localhost:3000`. It returns data rather than displaying a website.

## Run the tests

Set `MONGODB_TEST_URI` in `.env` to a separate test database, then run:

```sh
npm test
```

The tests delete records in that database, so use one that contains only test data.

## What I learned

I practiced building API routes, saving data in MongoDB, handling user login, checking who can adopt or remove a dog, and testing requests.
