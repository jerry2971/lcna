#!/usr/bin/env node
var latestVersion = require('latest-version');
var program = require('commander');
var inquirer = require('inquirer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var ejs = require('ejs');
var path = require('path');
var MODE_0666 = parseInt('0666', 8);
var MODE_0755 = parseInt('0755', 8);

var VERSION = require('../package').version;

/* 
program
	.version(VERSION, '-v, --version')
	.arguments('<dir>')
	.option('-f, --flow', 'add flow')
	.option('-w, --winston', 'add winston log')
	.action((dir, cmd) => 
	{
		console.log(dir, cmd);
	})
program.parse(process.argv);

console.log('down');
*/


const questions = [{
    type: 'input',
    name: 'name',
    message: 'ProjectName',
    default: 'myapp',
},{
    type: 'list',
    name: 'usage',
    message: 'Usage',
    choices:['app','express'],
},{
    type: 'checkbox',
    name: 'tool',
    message: 'Tool',
    choices:['flow','winston','jwt'],
}]

inquirer.prompt(questions).then(function (answers){
	var homeDir = answers.name;
	var depen = [];
	var devDepen = [];
	var option = {
		depen: [],
		devDepen: [],
		name: homeDir,
		flow: answers.tool.includes('flow'),
		winston: answers.tool.includes('winston'),
		jwt: answers.tool.includes('jwt')
	}

	switch(answers.usage){
		case 'app':
			depen = [];
			devDepen = [ "@babel/cli","@babel/core","@babel/node",
			"babel-eslint","eslint","eslint-config-airbnb-base",
			"eslint-plugin-import","eslint-plugin-react","jest" ];

			option.flow && (devDepen = devDepen.concat(["@babel/preset-flow","eslint-plugin-flowtype","flow-bin"]));
			option.winston && (depen = depen.concat(["winston","winston-transport-rollbar-3"]));
			break;
		case 'express':
			depen = [ "cookie-parser","debug","express",
				"express-queue","helmet"];
			devDepen = [ "@babel/cli","@babel/core","@babel/node",
				"babel-eslint","eslint","eslint-config-airbnb-base",
				"eslint-plugin-import","eslint-plugin-react","jest","supertest" ];

			option.flow && (devDepen = devDepen.concat(["@babel/preset-flow","eslint-plugin-flowtype","flow-bin"]));
			option.jwt && depen.push('jsonwebtoken');
			option.winston && (depen = depen.concat(["morgan","winston","winston-transport-rollbar-3"]));

			break;
	}

	versions(depen).then(function(depenJson){
		versions(devDepen).then(function(devDepenJson){
			option.depen = depenJson;
			option.devDepen = devDepenJson;
			console.log(option);
			mkdir(homeDir,'');
			var sourcePath = path.join(__dirname, '..', 'templates', answers.usage);
			var targetPath = path.join(__dirname, '..',homeDir);
			var configPath = path.join(targetPath, 'config');
			var libPath = path.join(targetPath, 'lib');

			copyFolder(sourcePath, targetPath, option);
			mkdir(configPath,'');
			mkdir(libPath,'');
			copyFolder(path.join(sourcePath, '..','config'), configPath, option);
			copyFolder(path.join(sourcePath, '..','lib'), libPath, option);
			copyFolder(path.join(sourcePath, '..','hide'), targetPath, option);
		});
	});
})


function mkdir (base, dir) {
	var loc = path.join(base, dir)
	console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
	mkdirp.sync(loc, MODE_0755)
}

function write (file, str, mode) {
	fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
	console.log('   \x1b[36mcreate\x1b[0m : ' + file)
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
			write(targetItem.replace('.ejs', ''), file, targetItem.includes('build.sh')? MODE_0755 : MODE_0666);
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









