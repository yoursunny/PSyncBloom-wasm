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
export declare class BloomFilter {
    private readonly m;
    /**
     * Construct a Bloom filter.
     * @param p - Algorithm parameter.
     * @param wire - Decode from serialized wire encoding.
     * @returns Promise that resolves to BloomFilter instance.
     */
    static create(p: Parameters, wire?: Uint8Array): Promise<BloomFilter>;
    /** @deprecated No longer needed. */
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
    private readonly hashFunction;
}
export interface BloomFilter extends Readonly<Parameters> {
}
