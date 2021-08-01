CYAN=`tput bold && tput setaf 6`
RESET=`tput sgr0`
TEST_FILES ?= src/**/__tests__/*.ts \
	src/**/__tests__/**/*.ts \
	src/**/__tests__/*.tsx \
	src/**/__tests__/**/*.tsx --reporter spec

### Main tasks

# Development mode
.PHONY: development
development dev d: prebuild
	$(MAKE) --jobs build-dev-client build-dev-server watch-ts-errors start-dev-server

# Production mode
.PHONY: production
production prod p: prebuild
	$(MAKE) --jobs build-prod-client build-prod-server

# Fetch info about new versions of used npm-packages
.PHONY: npm-check-update
npm-check-update:
	npm-check --skip-unused

# Start all tests with coverage
.PHONY: tests
tests test t: lint prettier tsc unit-coverage

# Start simple nodeJS server
.PHONY: start
start:
	NODE_ENV=DEBUG node ./build/server

# Start nodeJS server in prod mode
.PHONY: start-prod
start-prod:
	NODE_ENV=production node --max-old-space-size=512 ./build/server

### Tasks

# Prebuild phase
.PHONY: prebuild
prebuild: clean create-build-dir create-serverjs copy-public


### Subtasks

# Clean last build
.PHONY: clean
clean:
	rm -rf ./build

# Create dir for new build
.PHONY: create-build-dir
create-build-dir:
	mkdir build

# Create empty server.js file for nodemon
.PHONY: create-serverjs
create-serverjs:
	touch ./build/server.js

# Copy public files to build dir
.PHONY: copy-public
copy-public:
	cp -r public build

# Start nodemon
.PHONY: start-dev-server
start-dev-server:
	node_modules/.bin/nodemon --delay 0.1 --inspect -e js,json -w ./build/ ./build/server.js

# Make dev build for client with changes watching
.PHONY: build-dev-client
build-dev-client:
	NODE_ENV=development node_modules/.bin/webpack-cli --config ./webpack/client.ts --watch

# Make dev build for client with changes watching
.PHONY: build-client-stats
build-client-stats:
	NODE_ENV=production node_modules/.bin/webpack --config ./webpack/client.ts --json > build/stats_full.json

# Make dev build for server with changes watching
.PHONY: build-dev-server
build-dev-server:
	NODE_ENV=development node_modules/.bin/webpack-cli --config ./webpack/server.ts --watch

# Separate process to watch typescript errors
.PHONY: watch-ts-errors
watch-ts-errors:
	NODE_ENV=development node_modules/.bin/tsc --incremental --outDir ./.tsc_incremental_output -w | sed -e "s/\(error.*\)/`tput setaf 9`\1`tput op`/g"

# Make production build for client
.PHONY: build-prod-client
build-prod-client:
	NODE_ENV=production node_modules/.bin/webpack --config webpack/client.ts --bail

# Make production build for server
.PHONY: build-prod-server
build-prod-server:
	NODE_ENV=production node_modules/.bin/webpack --config webpack/server.ts --bail

## Tests, checks on push

# pass paths as env var
# Start unit and dom tests without coverage
.PHONY: unit
unit:
	@echo "\n${CYAN}Start unit and dom tests without coverage ${RESET}\n" && RTL_SKIP_AUTO_CLEANUP=true TS_NODE_TRANSPILE_ONLY=true NODE_ENV=test NODE_PATH=./src \
	node_modules/.bin/mocha \
		--require ts-node/register \
		--require ./tools/setupChaiDomAsserions.js \
		--require ./src/infrastructure/tests/hooks/beforeAndAfterEach.ts \
		--require source-map-support/register \
		--bail \
		--recursive \
		${TEST_FILES} \
		--enable-source-maps \
		--reporter nyan


# Start unit and dom tests with coverage
.PHONY: unit-coverage
unit-coverage:
	@echo "\n${CYAN}Start unit and dom tests with coverage ${RESET}\n" && RTL_SKIP_AUTO_CLEANUP=true  TS_NODE_TRANSPILE_ONLY=true NODE_ENV=test NODE_PATH=./src \
	node_modules/.bin/nyc \
	node_modules/.bin/mocha \
		--require ts-node/register \
		--require ./tools/setupChaiDomAsserions.js \
		--require ./src/infrastructure/tests/hooks/beforeAndAfterEach.ts \
		--require source-map-support/register \
		--bail \
		--recursive \
		${TEST_FILES} \
		--reporter progress

# Start integration tests (services —» actions —» reducers)
.PHONY: integration
integration:
	@echo "\n${CYAN}Start integration tests${RESET}\n" && TS_NODE_TRANSPILE_ONLY=true NODE_ENV=test NODE_PATH=./src node_modules/.bin/mocha --opts src/tests/integration/mocha.opts --reporter nyan

# Start eslint
.PHONY: lint
lint:
	@echo "\n${CYAN}Start eslint${RESET}\n" && node_modules/.bin/eslint "./src/**/*.ts" "./src/**/*.tsx" --cache --cache-location ".cache"

# Start eslint-without-cache
.PHONY: lint-without-cache
lint-without-cache:
	@echo "\n${CYAN}Start eslint without cache${RESET}\n" && node_modules/.bin/eslint "./src/**/*.ts" "./src/**/*.tsx"

# Start prettier with only error logs
.PHONY: prettier
prettier:
	@echo "\n${CYAN}Start prettier${RESET}\n" && node_modules/.bin/prettier --list-different "src/**/*.tsx" "src/**/*.ts"

# Start tsc checks (typings and etc)
.PHONY: tsc
tsc:
	@echo "\n${CYAN}Start typescript checker${RESET}\n" && node_modules/.bin/tsc --incremental --outDir ./.tsc_incremental_output
