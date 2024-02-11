#include <cstdint>
#include <string>
#include <vector>

namespace ndn {
namespace name {

class Component : public std::string {
public:
  const_iterator value_begin() const {
    return begin();
  }

  const_iterator value_end() const {
    return end();
  }
};

} // namespace name

class Name : public std::vector<uint8_t> {
public:
  void appendNumber(uint64_t) {}

  void append(const_iterator first, const_iterator last) {
    std::copy(first, last, std::back_inserter(*this));
  }
};

} // namespace ndn
