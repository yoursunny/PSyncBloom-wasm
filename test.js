// @ts-check
import assert from "node:assert/strict";
import { test } from "node:test";

import murmurHash3 from "murmurhash3js-revisited";

import { BloomFilter } from "./main.js";

/** @type {import(".").HashFunction} */
function hash(seed, input) {
  return murmurHash3.x86.hash32(input, seed);
}

test("simple", async () => {
  const bfA = await BloomFilter.create({
    hash,
    projectedElementCount: 100,
    falsePositiveProbability: 0.001,
  });
  bfA.insert("string 0");
  bfA.insert("string 1");
  bfA.insert(new Uint8Array());
  bfA.insert(Uint8Array.of(0x00, 0xBE, 0xEF));

  assert(bfA.contains("string 0"));
  assert(bfA.contains("string 1"));
  assert(bfA.contains(new Uint8Array()));
  assert(bfA.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));

  let nFalsePositives = 0;
  for (let i = 2; i < 20; ++i) {
    if (bfA.contains(`string ${i}`)) {
      ++nFalsePositives;
    }

    if (bfA.contains(Uint8Array.of(i))) {
      ++nFalsePositives;
    }
  }
  assert(nFalsePositives < 2);

  const wireA = bfA.encode();
  const bfB = await BloomFilter.create({
    hash,
    projectedElementCount: 100,
    falsePositiveProbability: 0.001,
  }, wireA);
  assert(bfB.contains("string 0"));
  assert(bfB.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));
  bfB.clear();
  assert(!bfB.contains("string 0"));
  assert(!bfB.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));

  const bfC = await BloomFilter.create({
    hash,
    projectedElementCount: 2000,
    falsePositiveProbability: 0.001,
  });
  assert.notEqual(bfC.encode().length, wireA.length);
});
