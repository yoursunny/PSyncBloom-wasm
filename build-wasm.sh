#!/bin/bash
set -euo pipefail

build_wasm() {
  em++ \
    -s ALLOW_TABLE_GROWTH=1 \
    -s EMBIND_STD_STRING_IS_UTF8=0 \
    -s EXPORT_ES6=1 \
    -s EXPORTED_FUNCTIONS='["_free"]' \
    -s EXPORTED_RUNTIME_METHODS='["addFunction"]' \
    -s FILESYSTEM=0 \
    -s INITIAL_MEMORY=$((1024 * 1024)) \
    -s MALLOC=emmalloc \
    -s MODULARIZE=1 \
    -s SAFE_HEAP=1 \
    -s STACK_OVERFLOW_CHECK=1 \
    -s STACK_SIZE=$((256 * 1024)) \
    -s STRICT=1 \
    -s USE_BOOST_HEADERS=1 \
    -s WASM_BIGINT=1 \
    -std=c++17 -O3 -Wall \
    --no-entry --bind -I. bloom.cpp PSync/detail/bloom-filter.cpp \
    "$@"
}

build_wasm -s ENVIRONMENT=node -o bloom.js
build_wasm -s ENVIRONMENT=web,webview,worker -o web.js
