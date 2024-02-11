// @ts-expect-error emscripten build output has no typing
import Module from "./bloom.js";
/** A Bloom filter. */
export class BloomFilter {
    m;
    /**
     * Construct a Bloom filter.
     * @param p - Algorithm parameter.
     * @param wire - Decode from serialized wire encoding.
     * @returns Promise that resolves to BloomFilter instance.
     */
    static async create(p, wire) {
        const module = await Module(undefined);
        return new BloomFilter(p, module, wire);
    }
    /** @deprecated No longer needed. */
    dispose() {
        //
    }
    /** Clear the Bloom filter. */
    clear() {
        this.c.clear();
    }
    /** Insert a value to the Bloom filter. */
    insert(s) {
        this.c.insert(s);
    }
    /** Determine whether the Bloom filter probably contains a value. */
    contains(s) {
        return this.c.contains(s);
    }
    /** Serialize the Bloom filter. */
    encode() {
        const ptr = this.c.encode();
        const size = this.m.HEAPU32[ptr / 4];
        const b = this.m.HEAPU8.slice(ptr + 4, ptr + 4 + size);
        this.m._free(ptr);
        return b;
    }
    constructor(p, m, wire) {
        this.m = m;
        Object.assign(this, p);
        m.setHashFunction(m.addFunction(this.hashFunction, "viiii"));
        if (wire) {
            this.c = m.Bloom.decode(p.projectedElementCount, p.falsePositiveProbability, wire);
        }
        else {
            this.c = m.Bloom.create(p.projectedElementCount, p.falsePositiveProbability);
        }
    }
    c;
    hashFunction = (resultPtr, seedPtr, inputPtr, inputSize) => {
        const seed = this.m.HEAPU32[seedPtr / 4];
        const input = this.m.HEAPU8.slice(inputPtr, inputPtr + inputSize);
        const result = this.hash(seed, input);
        this.m.HEAPU32[resultPtr / 4] = result;
    };
}
