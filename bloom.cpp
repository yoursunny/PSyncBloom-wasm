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

  std::string encode() const
  {
    ndn::Name name;
    appendToName(name);
    return std::move(name);
  }

  void insert2(std::string s)
  {
    insert(s);
  }

  bool contains2(std::string s) const
  {
    return contains(s);
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
    .function("insert", &Bloom::insert2)
    .function("contains", &Bloom::contains2);
}
