npm run webpack

mkdir -p build

cp -r bin build
cp -r config build
cp -r public build
cp -r lib build
cp package.json ./build/

node_modules/.bin/babel app.js -o build/app.js
node_modules/.bin/babel routes -d build/routes
node_modules/.bin/babel lib -d build/lib
node_modules/.bin/babel public -d build/public

cd build
npm install --production

sed -i -e '/babel-node .\/bin\/www/d' package.json
sed -i -e 's/pro_start/start/g' package.json
rm package.json-e
