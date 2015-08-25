include ../Makefile.inc

OUTPUT_FILES=$(PUBNUB_JS)
PLATFORM=Nodejs

.PHONY: all
all: build

.PHONY: build
build: $(PUBNUB_JS)

$(PUBNUB_JS): $(PUBNUB_COMMON_JS) $(PUBNUB_NODE_JS)
	$(ECHO) "// Version: $(VERSION)" > $(PUBNUB_JS)
	cat $(PUBNUB_COMMON_JS) $(PUBNUB_PLATFORM_JS) >> $(PUBNUB_JS)
	sed -i -e "s/\"version\"\: \".*\"/\"version\"\: \"$(VERSION)\"/g" $(PACKAGE_JSON)
	sed -i -e "s/VERSION/\'$(VERSION)\'/g" $(PUBNUB_JS)
	sed -i -e "s/PLATFORM/\'$(PLATFORM)\'/g" $(PUBNUB_JS)

.PHONY: clean
clean:
	rm -f $(OUTPUT_FILES) 

.PHONY: test
test:
	mocha -R spec tests/test.js

include ../Makefile.post
