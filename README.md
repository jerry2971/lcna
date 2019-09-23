# Little Create Node App (lcna)

Quick start your npm project. We support basic node app, express app and web app.

## Installation 

```
npm install -g lcna
```

## Quick Start With Express App

The quickest way to get started with express.
Just a few questions.

Create the express app:

```bash
$ lcna
? Project Name: myapp
? Template Usage: express
? Tool: flow, eslint
? Log: winston
? CI: .gitlab-ci
? JSON Web Token (JWT): No
```

Install dependencies:

```bash
$ npm install
```

Start your Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

Build your project for deploy.

```bash
$ npm run build
```

## A Few Questions
```
? Project Name:
  Your project name and used to create a folder
  
? Template Usage: app/express/web
  choose you want generator project
  
? Tool: eslint, flow
  flow: static variable type check
  eslint: Help you improve code quality

? Log: winston, winston+rollbar
  winston: help you write log file
  rollbar: rollbar log repository

? CI: .gitlab-ci
  .gitlab-ci: use gitlab ci

? JSON Web Token (JWT): Yes/no
  request way.

```

## Project Script

```
"scripts": {
    "start": start your app on development environment
    "pro_start": start your app on production environment
    "test": jest test
    "build": build project for deploy
    "flow": flow all file.
    "lint": eslint a file that you choose.
    "eslint": eslint all file.
}
```
After build project. command `pro_start` will replace `start`

## Note
You need add flow typed to resolve test file, if you use flow.

```
npm i --save-dev flow-typed
./node_modules/.bin/flow-typed install jest
```
## License

[MIT](LICENSE)
