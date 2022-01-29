SHELL=/bin/bash

all: bloom.js web.js

bloom.js web.js: bloom.cpp PSync/detail/bloom-filter.cpp
	declare -A ENVIRONMENT=(["bloom.js"]=node ["web.js"]=web,webview,worker); \
	em++ \
		-std=c++17 -Wall -Werror -fno-exceptions \
		--pre-js pre.js --post-js post.js \
		-s STRICT=1 -s MODULARIZE=1 -s SINGLE_FILE=1 -s ENVIRONMENT=$${ENVIRONMENT[$@]} \
		-s TOTAL_STACK=262144 -s INITIAL_MEMORY=1048576 -s MALLOC=emmalloc \
		-s DYNAMIC_EXECUTION=0 -s FILESYSTEM=0 -s TEXTDECODER=2 \
		-s ALLOW_TABLE_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=[addFunction] \
		--bind --no-entry -O3 \
		-o $@ -I. $^

clean:
	rm -f bloom.js bloom.wasm web.js web.wasm

lint:
	git ls-files -- '*.[hc]pp' -x ':!:**/bloom-filter.*' | xargs clang-format-11 -i -style=file
