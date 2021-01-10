#ifndef PSYNCBLOOM_UTIL_HPP
#define PSYNCBLOOM_UTIL_HPP

#include <cstdint>
#include <string>

using HashFunction = uint32_t (*)(uint32_t seed, uint32_t data, uint32_t size);

extern HashFunction hash;

inline uint32_t
murmurHash3(uint32_t seed, const std::string& s)
{
  return (*hash)(seed, reinterpret_cast<uintptr_t>(s.data()), s.size());
}

#endif // PSYNCBLOOM_UTIL_HPP
