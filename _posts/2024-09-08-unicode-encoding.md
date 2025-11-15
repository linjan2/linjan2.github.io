---
title: Unicode encoding
categories: encoding
---

# Unicode encoding

The Unicode standard encodes characters as 21-bit codepoint values. The codepoints are stored in one of the formats: UTF-32, UTF-16, or UTF-8.

- UTF-32 stores the 21-bit unicode data in a 32-bit integer with 11 bits of zero-padding.
- UTF-16 stores unicode data in either a single 16-bit integer or within two 16-bit integers (called a surrogate pair). The high 16-bit word and the low 16-bit word each has 10 bits for the unicode data -- which is only 20 bits and not the full 21 bits. The other bits are used to recognize the encoding.
- UTF-8 stores 21-bit values within one, two, three, or four 8-bit integers. For multibyte sequences the initial bits of the first byte identify the sequence length. Subsequent bytes start with `10` followed by 6 bits for unicode data.

The diagram belows shows how Unicode codepoint values are encoded in bits for the different encoding formats. `x` is part of the codepoint bit number and the literal numbers are what identifies the Unicode encoding.

```
          Codepoint range:       Bit encoding:
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

## MUTF-8

Codepoints should be encoded into the minimum length byte sequences for UTF-16 and UTF-8, but it's possible to encode them with more bytes than necessary by simply setting the codepoint value bits to zeroes for the higher bytes.

For example, 0 can be encoded with two byte sequences (11 data bits) instead of one as: `1100 0000 1000 0000` (`0xC080`). The Modified UTF-8 encoding (MUTF-8) uses this "overlong encoding" for the `NULL` value to avoid it being encoded (and possibly treated) as the end-of-string (i.e. `\0`).

## Byte-order-mark (BOM)

A byte-order-mark (BOM) in the beginning of the character stream marks the byte endianness of the sequence. This is relevant for UTF-16 and UTF-32 to recognize if the first byte of the encoded sequence is in the high byte or in the low byte of the integer -- as the endianness of the system must match the sequence to load the bytes into 16/32-bit integers correctly.

For UTF-8 there is no need for a BOM, since each byte is loaded into a separate integer. However, there is an optional (and discouraged) BOM for UTF-8 that can be used to identify the encoding as UTF-8.

The Unicode codepoint for the BOM is `U+FEFF`, which is the "zero width non-breaking space" character.

```
            First bytes    Check
UTF-32LE    FF FE 00 00    uint32_t bom == 0xFFFE0000
UTF-32BE    00 00 FE FF    uint32_t bom == 0x0000FEFF
UTF-16LE    FF FE .. ..    uint16_t bom == 0xFFFE
UTF-16BE    FE FF .. ..    uint16_t bom == 0xFEFF
UTF-8       EF BB BF ..    1110 [1111], 10[11 1011], 10[11 1111] = 0xFEFF
```

Most CPU systems are little endian.
