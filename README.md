# PSync Bloom Filter via WebAssembly

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/yoursunny/PSyncBloom-wasm/build.yml)](https://github.com/yoursunny/PSyncBloom-wasm/actions) [![GitHub code size](https://img.shields.io/github/languages/code-size/yoursunny/PSyncBloom-wasm?style=flat&logo=GitHub)](https://github.com/yoursunny/PSyncBloom-wasm)

`@yoursunny/psync-bloom` package is the Bloom Filter library extracted from [PSync C++ library](https://github.com/named-data/PSync) and compiled to WebAssembly.
This package may be used in JavaScript projects to interact with the Partial Synchronization functionality of the PSync library.

Compiled package is automatically pushed to `build` branch.
To install this package, include the following in `package.json`:

```json
{
  "dependencies": {
    "@yoursunny/psync-bloom": "github:yoursunny/PSyncBloom-wasm#build"
  }
}
```

API documentation is available in Visual Studio Code and other editors after installation.
See [test.js](test.js) for demonstrations on how to use this library.
