# Dog Adoption Platform API

A REST API for registering dogs, managing adoption records, and controlling access with user authentication. Built as a school project during Springboard’s Software Engineering Career Track.

## Features

- User registration and login with bcrypt password hashing and JWT authentication.
- Register dogs and view your own registered dogs.
- Filter registered dogs by adoption status and paginate results.
- Adopt another user’s dog with a thank-you message.
- Prevent users from adopting their own dogs or adopting a dog twice.
- Allow owners to remove their available dogs; prevent removal after adoption.
- View your own adopted dogs with pagination.
- JSON error responses and automated API tests.

## Technologies

Node.js · Express · MongoDB · Mongoose · JSON Web Tokens · bcrypt · Mocha · Chai

This is a backend API. It does not include a frontend or a public catalog of all available dogs.

## Setup

Use Node.js 22 or newer and a running MongoDB instance.

```sh
npm ci
cp .env.example .env
```

Set `MONGODB_URI` to your development database connection string and replace `JWT_SECRET` with a long random secret. Keep `.env` out of GitHub.

```sh
npm start
```

The API defaults to `http://localhost:3000`. Use `npm run dev` for automatic restarts during development.

## Endpoints

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a user | No |
| POST | `/api/auth/login` | Log in and receive a token | No |
| POST | `/api/dogs` | Register a dog | Bearer token |
| GET | `/api/dogs/registered` | List your registered dogs | Bearer token |
| GET | `/api/dogs/adopted` | List your adopted dogs | Bearer token |
| PATCH | `/api/dogs/:dogId/adopt` | Adopt another user’s dog | Bearer token |
| DELETE | `/api/dogs/:dogId` | Remove your available dog | Bearer token |

## Example requests

Register a user:

```sh
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"owner","password":"example-password"}'
```

Log in:

```sh
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"owner","password":"example-password"}'
```

Copy the returned token into `YOUR_TOKEN` in subsequent requests:

```sh
curl -X POST http://localhost:3000/api/dogs \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bella","description":"Friendly dog looking for a home"}'

curl 'http://localhost:3000/api/dogs/registered?page=1&limit=10&status=available' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

To adopt a dog, log in as a second user and send `PATCH /api/dogs/:dogId/adopt` with that user’s token and a JSON body such as `{"thankYouMessage":"Thank you for Bella!"}`.

## Tests

Set `MONGODB_TEST_URI` to a separate, disposable test database before running:

```sh
npm test
```

The tests delete user and dog records in the test database. Do not point `MONGODB_TEST_URI` at a database containing data you want to keep.

## What I practiced

REST API design, authentication, ownership-based authorization, MongoDB data modeling, pagination, business rules, and HTTP integration testing.

## Hosting

This application requires a Node.js server and MongoDB. GitHub Pages cannot run the API. A deployed API also needs `MONGODB_URI` and `JWT_SECRET` configured as environment variables on its host.
