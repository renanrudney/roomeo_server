
<p align="center">
  <img alt="Unsplash black shoulder-mount" src="https://images.unsplash.com/photo-1543235074-4768b5c2233c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=80" />
</p>

<h3 align="center">
  Room + Video = Roomeo
</h3>

<p align="center">“A fictional video server”!</blockquote>
<p align="center">You can manage users and conference rooms.</p>

<p align="center">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/renanrudney/roomeo_server">
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/renanrudney/roomeo_server">
</p>

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the 12.x version of [NodeJS](https://nodejs.org/en/download/)
* You have a [Yarn](https://classic.yarnpkg.com/en/docs/install) 1.x version  or NPM.
* You have created psql databases: roomeo_pg, roomeo_test and update on ormconfig.json
* **or** run docker and create databases: roomeo_pg, roomeo_test
```❯ docker run --name roomeo_pg -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres```

## Installing Project

To install dependencies, run:

```
yarn install
yarn typeorm migration:run
```

## Using Project

To use, follow these steps:

```
yarn dev:server
```

Or run tests:
```
yarn test
```

### Aplication Routes

- **`GET /users`** : list all users;
- **`GET /users/:username`** : user informations;
- **`POST /users`** { `username`, `password`, `mobile_token`} : create and authenticate a user;
- **`POST /authenticate`** { `username`, `password` } : authenticate user;
- **`PUT /users`** { `mobile_token`, `password` } : update current authenticated user;
- **`DELETE /users`** : deleted current authenticated user;
- **`POST /rooms`** { `name`, `capacity` } : create and host a room;
- **`GET /rooms/:guid`** : room informations;
- **`POST /rooms/:guid/join`** : joins room and show room informations;
- **`POST /rooms/:guid/leave`** : leaves room;


## Contributing
To contribute to "roomeo_server", follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

