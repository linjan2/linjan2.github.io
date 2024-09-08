---
title: Unicode encoding
categories: encoding
---

# Unicode encoding

The Unicode standard encodes characters as 21-bit codepoint values. The codepoints are stored in one of the formats: UTF-32, UTF-16, or UTF-8.

- UTF-32 stores the 21-bit unicode data in a 32-bit integer with 11 bits of zero-padding.
- UTF-16 stores unicode data in either a single 16-bit integer or within two 16-bit integers (called a surrogate pair). The high 16-bit word and the low 16-bit word each has 10 bits for the unicode data -- which is only 20 bits and not the full 21 bits. The other bits are used to recognize the encoding.
- UTF-8 stores 21-bit values within one, two, three, or four 8-bit integers. For multibyte sequences the initial bits of the first byte identify the sequence length. Subsequent bytes start with `10` followed by 6 bits for unicode data.

```
          Codepoint range:       Encoding:
UTF-32:   0x0 - 0x1F FFFF        0000 0000 000x xxxx xxxx xxxx xxxx xxxx

UTF-16:   0x0000 - 0xD7FF        xxxx xxxx xxxx xxxx
          0xD800 - 0xDFFF        (not valid codepoints)
          0xE000 - 0xFFFF        xxxx xxxx xxxx xxxx
          0x010000 - 0x10FFFF    1101 10xx xxxx xxxx, 1101 11xx xxxx xxxx

UTF-8:    0x0 - 0x7F             0xxx xxxx
          0x80 - 0x7FF           110x xxxx, 10xx xxxx
          0x800 - 0xFFFF         1110 xxxx, 10xx xxxx, 10xx xxxx
          0x10000 - 0x1FFFFF     1111 0xxx, 10xx xxxx, 10xx xxxx, 10xx xxxx
```

Codepoints should be encoded into the minimum length byte sequences, but it's possible to encode them with more bytes than necessary. E.g. 0 can be encoded with two byte sequences (11 data bits) as: `1100 0000 1000 0000` (`0xC080`). The Modified UTF-8 encoding (MUTF-8) uses this overlong encoding for `NULL` to avoid being treated as the end-of-string.
