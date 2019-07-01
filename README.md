# Little Create Node App (lcna)

Quick start your npm project. we support basic node app and express app.

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
$ ? ProjectName myapp
$ ? Usage express
$ ? Tool flow, winston, jwt
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

## Quick Start With Node App

The quickest way to get started with express.
Just a few questions.

Create the express app:

```bash
$ lcna
$ ? ProjectName myapp
$ ? Usage app
$ ? Tool flow, winston
```

Install dependencies:

```bash
$ npm install
```

Start your node app.

```bash
$ npm start
```

Build your project for deploy.

```bash
$ npm run build
```
## A Few Questions
```
ProjectName:
  Your project name and used to create a folder
  
Usage: app/express
  choose you want generator project
  
tool: flow, winston, jwt
  flow: static variable type check
  winston: help you write log file
  jwt: rest api stateless authentication
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
## License

[MIT](LICENSE)
