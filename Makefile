NODE_BIN_DIR = ./node_modules/.bin
GENERATED_FILES = \
	lib/tnt.js \
	lib/tnt.min.js

all: $(GENERATED_FILES)

.PHONY: clean all test

test:
	$(NODE_BIN_DIR)/mocha-phantomjs --reporter spec test/test.html

lib/tnt.js: $(shell node_modules/.bin/smash --list src/index.js) package.json src/scss/tnt.scss
	@rm -f $@
	$(NODE_BIN_DIR)/smash src/index.js > $@
	sass src/scss/tnt.scss:lib/tnt.css	
	@chmod a-w $@

lib/tnt.min.js: lib/tnt.js
	@rm -f $@
	$(NODE_BIN_DIR)/uglifyjs -c -m -o $@ $<
	chmod a-w $@

reset:
	rm -rf -- $(GENERATED_FILES)
