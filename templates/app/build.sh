mkdir -p build

cp -r config build
cp -r lib build
cp package.json ./build/

node_modules/.bin/babel app.js -o build/app.js
node_modules/.bin/babel lib -d build/lib

cd build
npm install --production

sed -i -e 's/babel-node app.js/node app.js/g' package.json
[ -e package.json-e ] && rm package.json-e
