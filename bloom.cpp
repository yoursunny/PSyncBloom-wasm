#include "PSync/detail/bloom-filter.hpp"
#include "PSync/detail/util.hpp"
#include <emscripten/bind.h>

HashFunction hash;

void
setHashFunction(uintptr_t f)
{
  hash = reinterpret_cast<HashFunction>(f);
}

class Bloom : public psync::detail::BloomFilter
{
public:
  using BloomFilter::BloomFilter;

  static Bloom create(unsigned int pec, double dfpp)
  {
    return Bloom(pec, dfpp);
  }

  static Bloom decode(unsigned int pec, double dfpp, std::string value)
  {
    ndn::name::Component comp;
    comp.swap(value);
    return Bloom(pec, dfpp, comp);
  }

  uint32_t encode() const
  {
    ndn::Name name;
    appendToName(name);
    void* m = std::malloc(sizeof(uint32_t) + name.size());
    std::copy(name.begin(), name.end(), reinterpret_cast<uint8_t*>(m) + 4);
    *reinterpret_cast<uint32_t*>(m) = name.size();
    return reinterpret_cast<uintptr_t>(m);
  }

  void clear()
  {
    BloomFilter::clear();
  }

  void insert(const std::string& s)
  {
    BloomFilter::insert(s);
  }

  bool contains(const std::string& s) const
  {
    return BloomFilter::contains(s);
  }
};

EMSCRIPTEN_BINDINGS(bloom)
{
  emscripten::function("setHashFunction", &setHashFunction);

  emscripten::class_<Bloom>("Bloom")
    .class_function("create", &Bloom::create)
    .class_function("decode", &Bloom::decode)
    .function("encode", &Bloom::encode)
    .function("clear", &Bloom::clear)
    .function("insert", &Bloom::insert)
    .function("contains", &Bloom::contains);
}
