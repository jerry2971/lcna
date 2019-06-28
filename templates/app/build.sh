mkdir -p build

cp -r config build
cp -r ec_modules build
cp package.json ./build/

node_modules/.bin/babel app.js -o build/app.js
node_modules/.bin/babel ec_modules -d build/ec_modules

cd build
npm install --production