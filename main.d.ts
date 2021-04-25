/** 32-bit hash function. */
export declare type HashFunction = (seed: number, input: Uint8Array) => number;
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
export declare class BloomFilter {
    private readonly m;
    /**
     * Construct a Bloom filter.
     * @param p algorithm parameter.
     * @param wire decode from serialized wire encoding.
     * @returns a Promise that resolves to BloomFilter instance.
     */
    static create(p: Parameters, wire?: Uint8Array): Promise<BloomFilter>;
    /** Dispose this instance to prevent memory leak. */
    dispose(): void;
    /** Clear the Bloom filter. */
    clear(): void;
    /** Insert a value to the Bloom filter. */
    insert(s: string | Uint8Array): void;
    /** Determine whether the Bloom filter probably contains a value. */
    contains(s: string | Uint8Array): boolean;
    /** Serialize the Bloom filter. */
    encode(): Uint8Array;
    private constructor();
    private readonly c;
    private disposed;
    private throwIfDisposed;
    private readonly hashFunction;
}
export interface BloomFilter extends Readonly<Parameters> {
}
