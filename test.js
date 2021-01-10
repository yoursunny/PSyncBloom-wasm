// @ts-check
const test = require("ava").default;
const murmurHash3 = require("murmurhash3js-revisited");
const { BloomFilter } = require(".");

/** @type {import(".").HashFunction} */
function hash(seed, input) {
  return murmurHash3.x86.hash32(input, seed);
}

test("simple", async (t) => {
  const bfA = await BloomFilter.create({
    hash,
    projectedElementCount: 100,
    falsePositiveProbability: 0.001,
  });
  bfA.insert("string 0");
  bfA.insert("string 1");
  bfA.insert(new Uint8Array());
  bfA.insert(Uint8Array.of(0x00, 0xBE, 0xEF));

  t.true(bfA.contains("string 0"));
  t.true(bfA.contains("string 1"));
  t.true(bfA.contains(new Uint8Array()));
  t.true(bfA.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));

  let nFalsePositives = 0;
  for (let i = 2; i < 20; ++i) {
    if (bfA.contains(`string ${i}`)) {
      ++nFalsePositives;
    }

    if (bfA.contains(Uint8Array.of(i))) {
      ++nFalsePositives;
    }
  }
  t.true(nFalsePositives < 2);

  const wireA = bfA.encode();
  const bfB = await BloomFilter.create({
    hash,
    projectedElementCount: 100,
    falsePositiveProbability: 0.001,
  }, wireA);
  t.true(bfB.contains("string 0"));
  t.true(bfB.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));
  bfB.clear();
  t.false(bfB.contains("string 0"));
  t.false(bfB.contains(Uint8Array.of(0x00, 0xBE, 0xEF)));

  const bfC = await BloomFilter.create({
    hash,
    projectedElementCount: 2000,
    falsePositiveProbability: 0.001,
  });
  t.not(bfC.encode().length, wireA.length);
});
