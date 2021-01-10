#ifndef PSYNCBLOOM_UTIL_HPP
#define PSYNCBLOOM_UTIL_HPP

#include <cstdint>
#include <string>

using HashFunction = void (*)(uint32_t resultPtr, uint32_t seedPtr, uint32_t inputPtr,
                              uint32_t inputSize);

extern HashFunction hash;

inline uint32_t
murmurHash3(uint32_t seed, const std::string& input)
{
  uint32_t result = 0;
  (*hash)(reinterpret_cast<uintptr_t>(&result), reinterpret_cast<uintptr_t>(&seed),
          reinterpret_cast<uintptr_t>(input.data()), input.size());
  return result;
}

#endif // PSYNCBLOOM_UTIL_HPP
