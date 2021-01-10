#include <cstdint>
#include <string>
#include <vector>

namespace ndn {
namespace name {

class Component : public std::string
{
public:
  const_iterator value_begin() const
  {
    return begin();
  }

  const_iterator value_end() const
  {
    return end();
  }
};

} // namespace ndn

class Name : public std::string
{
public:
  void appendNumber(uint64_t) {}

  void append(std::vector<uint8_t>::const_iterator first, std::vector<uint8_t>::const_iterator last)
  {
    resize(std::distance(first, last));
    std::copy(first, last, reinterpret_cast<uint8_t*>(data()));
  }
};

} // namespace ndn
