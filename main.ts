// @ts-expect-error emscripten build output has no typing
import openWasmModule = require("./bloom.js"); // eslint-disable-line @typescript-eslint/no-require-imports

/** 32-bit hash function. */
export type HashFunction = (seed: number, input: Uint8Array) => number;

/**
 * Bloom filter algorithm parameters.
 *
 * All participants must agree on the same parameters in order to communicate.
 */
export interface Parameters {
  hash: HashFunction;

  projectedElementCount: number;

  falsePositiveProbability: number;
}

/** A Bloom filter. */
export class BloomFilter {
  /**
   * Construct a Bloom filter.
   * @param p algorithm parameter.
   * @param wire decode from serialized wire encoding.
   * @returns a Promise that resolves to BloomFilter instance.
   */
  public static async create(p: Parameters, wire?: Uint8Array): Promise<BloomFilter> {
    const module = await openWasmModule(undefined);
    return new BloomFilter(p, module, wire);
  }

  /** Dispose this instance to prevent memory leak. */
  public dispose(): void {
    if (!this.disposed) {
      this.m.dispose();
      this.disposed = true;
    }
  }

  /** Clear the Bloom filter. */
  public clear(): void {
    this.throwIfDisposed();
    this.c.clear();
  }

  /** Insert a value to the Bloom filter. */
  public insert(s: string | Uint8Array): void {
    this.throwIfDisposed();
    this.c.insert(s);
  }

  /** Determine whether the Bloom filter probably contains a value. */
  public contains(s: string | Uint8Array): boolean {
    this.throwIfDisposed();
    return this.c.contains(s);
  }

  /** Serialize the Bloom filter. */
  public encode(): Uint8Array {
    this.throwIfDisposed();
    const ptr = this.c.encode();
    const size = this.m.HEAPU32[ptr / 4];
    const b = new Uint8Array(this.m.HEAPU8.slice(ptr + 4, ptr + 4 + size));
    this.m._free(ptr);
    return b;
  }

  private constructor(p: Parameters, private readonly m: cModule, wire?: Uint8Array) {
    Object.assign(this, p);
    m.setHashFunction(m.addFunction(this.hashFunction, "viiii"));
    if (wire) {
      this.c = m.Bloom.decode(p.projectedElementCount, p.falsePositiveProbability, wire);
    } else {
      this.c = m.Bloom.create(p.projectedElementCount, p.falsePositiveProbability);
    }
  }

  private readonly c: cBloom;
  private disposed = false;

  private throwIfDisposed(): void {
    if (this.disposed) {
      throw new Error("invalid operation on disposed BloomFilter instance");
    }
  }

  private readonly hashFunction = (resultPtr: number, seedPtr: number, inputPtr: number, inputSize: number): void => {
    const seed = this.m.HEAPU32[seedPtr / 4];
    const input: Uint8Array = this.m.HEAPU8.slice(inputPtr, inputPtr + inputSize);
    const result = this.hash(seed, input);
    this.m.HEAPU32[resultPtr / 4] = result;
  };
}
export interface BloomFilter extends Readonly<Parameters> {}

interface cModule {
  setHashFunction(fn: number): void;
  Bloom: {
    create(pec: number, dfpp: number): cBloom;
    decode(pec: number, dfpp: number, value: string | Uint8Array): cBloom;
  };
  addFunction(fn: Function, typ: string): number;
  _free(ptr: number): void;
  dispose(): void;
  HEAPU8: Uint8Array;
  HEAPU32: Uint32Array;
}

interface cBloom {
  encode(): number;
  clear(): void;
  insert(s: string | Uint8Array): void;
  contains(s: string | Uint8Array): boolean;
}
