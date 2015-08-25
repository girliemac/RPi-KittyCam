
build: components index.js
	@component build --dev

components:
	@component install --dev

clean:
	rm -fr build components template.js

list:
	@cat index.js | grep exports | sed 's/exports.//' | cut -f 1 -d ' '

.PHONY: clean list
