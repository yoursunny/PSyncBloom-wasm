"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomFilter = void 0;
// @ts-expect-error
const openWasmModule = require("./bloom.js");
/** A Bloom filter. */
class BloomFilter {
    constructor(p, m, wire) {
        this.m = m;
        this.disposed = false;
        this.hashFunction = (resultPtr, seedPtr, inputPtr, inputSize) => {
            const seed = this.m.HEAPU32[seedPtr / 4];
            const input = this.m.HEAPU8.slice(inputPtr, inputPtr + inputSize);
            const result = this.hash(seed, input);
            this.m.HEAPU32[resultPtr / 4] = result;
        };
        Object.assign(this, p);
        m.setHashFunction(m.addFunction(this.hashFunction, "viiii"));
        if (wire) {
            this.c = m.Bloom.decode(p.projectedElementCount, p.falsePositiveProbability, wire);
        }
        else {
            this.c = m.Bloom.create(p.projectedElementCount, p.falsePositiveProbability);
        }
    }
    /**
     * Construct a Bloom filter.
     * @param p algorithm parameter.
     * @param wire decode from serialized wire encoding.
     * @returns a Promise that resolves to BloomFilter instance.
     */
    static async create(p, wire) {
        const module = await openWasmModule(undefined);
        return new BloomFilter(p, module, wire);
    }
    /** Dispose this instance to prevent memory leak. */
    dispose() {
        if (!this.disposed) {
            this.m.dispose();
            this.disposed = true;
        }
    }
    /** Clear the Bloom filter. */
    clear() {
        this.throwIfDisposed();
        this.c.clear();
    }
    /** Insert a value to the Bloom filter. */
    insert(s) {
        this.throwIfDisposed();
        this.c.insert(s);
    }
    /** Determine whether the Bloom filter probably contains a value. */
    contains(s) {
        this.throwIfDisposed();
        return this.c.contains(s);
    }
    /** Serialize the Bloom filter. */
    encode() {
        this.throwIfDisposed();
        const ptr = this.c.encode();
        const size = this.m.HEAPU32[ptr / 4];
        const b = new Uint8Array(this.m.HEAPU8.slice(ptr + 4, ptr + 4 + size));
        this.m._free(ptr);
        return b;
    }
    throwIfDisposed() {
        if (this.disposed) {
            throw new Error("invalid operation on disposed BloomFilter instance");
        }
    }
}
exports.BloomFilter = BloomFilter;
