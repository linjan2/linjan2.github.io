# Build webapps

```sh
# install nodejs
sudo dnf install nodejs jq
mkdir ~/.local/npm
npm config set prefix '~/.local/npm'
npm root --global # ~/.local/npm/lib/node_modules

# update package.json
npm install --global npm-check-updates
npx npm-check-updates # show updates
npx npm-check-updates --upgrade

# adding package dependencies
npm install --save-dev eslint-plugin-jsdoc
```

```sh
mkdir build
cd build

shopt -s dotglob
cp --verbose ../rollup/* ./
cp --verbose ../$app/* ./
jq --slurp ".[0] * .[1]" ../$app/package.json ../rollup/package.json > package.json

npm install
npm run pre
npm run build -- --input index.js --file output.min.js
```

```sh
rm -rf node_modules/.cache
npm cache clean --force
```
