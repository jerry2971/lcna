#!/usr/bin/env node
const ejs = require('ejs');
const fs = require('fs');
const inquirer = require('inquirer');
const latestVersion = require('latest-version');
const mkdirp = require('mkdirp');
const path = require('path');

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

const dependence = {
	flow: {
		depen: [],
		devDepen: ['@babel/preset-flow', 'eslint-plugin-flowtype', 'flow-bin'],
		file: ['.flowconfig']
	},
	eslint: {
		depen: [],
		devDepen: [
			'babel-eslint',
			'eslint',
			'eslint-config-airbnb-base',
			'eslint-plugin-import',
			'eslint-plugin-react'
		],
		file: ['.eslintrc']
	},
	winston: {
		depen: ['winston'],
		devDepen: [],
		file: ['winston.js', 'log.json']
	},
	rollbar: {
		depen: ['winston-transport-rollbar-3'],
		devDepen: [],
		file: []
	},
	jwt: {
		depen: ['jsonwebtoken'],
		devDepen: [],
		file: ['jwt.js']
	},
	ci: {
		depen: [],
		devDepen: [],
		file: ['.gitlab-ci.yml']
	}
};

const questions = [{
	type: 'input',
	name: 'name',
	message: 'Project Name',
	default: 'myapp'
},{
	type: 'list',
	name: 'usage',
	message: 'Template Usage',
	choices:['app', 'express', 'web']
},{
	type: 'checkbox',
	name: 'tool',
	message: 'Tool',
	choices:['flow', 'eslint']
},{
	type: 'checkbox',
	name: 'log',
	message: 'Log',
	choices:['winston', 'winston+rollbar']
},{
	type: 'checkbox',
	name: 'ci',
	message: 'CI',
	choices:['.gitlab-ci']
}];

inquirer.prompt(questions).then((answers) => {
	if (answers.usage !== 'app') {
		const questions2 = [{
			type: 'confirm',
			name: 'sRequest',
			message: 'JSON Web Token (JWT)'
		}];
		inquirer.prompt(questions2).then((answers2) => {
			main(Object.assign({}, answers, answers2));
		});
	} else {
		main(answers)
	}
});

const main = (args) => {
	const depen = [];
	const devDepen = ["@babel/cli", "@babel/core", "@babel/node", "jest"];
	const homeDir = args.name;
	const option = {
		name: homeDir,
		flow: args.tool.includes('flow'),
		eslint: args.tool.includes('eslint'),
		winston: args.log.includes('winston') || args.log.includes('winston+rollbar'),
		rollbar: args.log.includes('winston+rollbar'),
		ci: args.ci.includes('.gitlab-ci'),
		jwt: !!args.sRequest
	}
	console.log(option);
	Object.keys(dependence).forEach((key) => {
		if (option[key]) {
			console.log('key=', key);
			depen.concat(dependence[key].depen);
			devDepen.concat(dependence[key].devDepen);
		}
	});

	switch (args.usage) {
		case 'web':
			depen.concat([]);
			devDepen.push();
			// break; // it contain express module.
		case 'express':
			depen.concat([ "cookie-parser", "debug", "express", "express-queue", "helmet", "morgan"]);
			devDepen.push('supertest');
			break;
	}

	versions(depen).then(function(depenJson){
		versions(devDepen).then(function(devDepenJson){
			option.depen = depenJson;
			option.devDepen = devDepenJson;
			mkdir(homeDir,'');
			const sourcePath = path.join(__dirname, '..', 'templates', args.usage);
			const targetPath = path.join(process.cwd(), homeDir);
			const configPath = path.join(targetPath, 'config');
			const libPath = path.join(targetPath, 'lib');

			copyFolder(sourcePath, targetPath, option);
			mkdir(configPath,'');
			mkdir(libPath,'');
			copyFolder(path.join(sourcePath, '..','config'), configPath, option);
			copyFolder(path.join(sourcePath, '..','lib'), libPath, option);
			copyFolder(path.join(sourcePath, '..','hide'), targetPath, option);
		});
	});
};

function mkdir (base, dir) {
	var loc = path.join(base, dir)
	console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
	mkdirp.sync(loc, MODE_0755)
}

function write (file, str, mode) {
	fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
	console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}

function copyCheck(targetItem, option) {
	let result = true;
	Object.keys(dependence).forEach((key) => {
		if (option[key] === false && dependence[key].file.length > 0 && dependence[key].file.every((f) => { return targetItem.includes(f); })) {
			console.log('key:', key, 'targetItem', targetItem);
			console.log('reject file:', targetItem);
			result = false;
		}
	});
	return result;
}

function copyFolder(source, target, option){
	fs.readdirSync(source).forEach(function(item){
		var sourceItem = path.join(source,item);
		var targetItem = path.join(target,item);
		if(fs.statSync(sourceItem).isFile()){
			// need rendor?
			var file = fs.readFileSync(sourceItem,'utf8');
			if(sourceItem.indexOf('.ejs') !== -1){
				file = ejs.compile(file)(option);
			}
			if (copyCheck(targetItem, option)) {
				write(targetItem.replace('.ejs', ''), file, targetItem.includes('build.sh')? MODE_0755 : MODE_0666);
			}
		}else{
			mkdir(targetItem,'');
			copyFolder(sourceItem, targetItem, option);
		}
	});
}

async function versions(array) {
	return await Promise.all(array.map(async function(a){
		return {pkg:a,version:(await latestVersion(a))};
	}));
}
