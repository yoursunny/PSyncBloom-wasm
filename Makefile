all: bloom.js

bloom.js: bloom.cpp PSync/detail/bloom-filter.cpp
	em++ \
	  -std=c++17 -Wall -Werror \
	  -s STRICT=1 -s MODULARIZE=1 \
  	-s TOTAL_STACK=262144 -s INITIAL_MEMORY=1048576 -s MALLOC=emmalloc -s FILESYSTEM=0 \
		-s ALLOW_TABLE_GROWTH=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=[addFunction] \
		--bind --no-entry -O3 -Oz \
		-o bloom.js -I. $^

clean:
	rm -f bloom.js bloom.wasm

lint:
	git ls-files -- '*.[hc]pp' -x ':!:**/bloom-filter.*' | xargs clang-format-8 -i -style=file
