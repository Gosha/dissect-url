import { suite } from "uvu"

import * as assert from "uvu/assert"
import { assembleUrl, dissectUrl, Url } from "./url"
import { UrlEncoded } from "./encodings"

const testDissect = suite("dissect-url")
const testReassemble = suite("reassemble")

{
  const url = "https://example.com/path/to-resource"
  testDissect("Simple URL", () => {
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        { _type: "path", data: "path" },
        { _type: "path", data: "to-resource" },
      ],
    } satisfies Url)
  })

  testReassemble("Reassemble Simple URL", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

testReassemble("Reassemble empty query", () => {
  const url = "https://example.com/path/to-resource?"
  assert.equal(assembleUrl(dissectUrl(url)), url)
})

{
  const url = "https://example.com/path/to-resource#"

  testDissect("Empty hash", () => {
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        { _type: "path", data: "path" },
        { _type: "path", data: "to-resource" },
      ],
      hash: "",
    } satisfies Url)
  })

  testReassemble("Reassemble empty hash", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

testReassemble("Reassemble spaced hash", () => {
  const url = "https://example.com/path/to-resource#hello there"
  assert.equal(assembleUrl(dissectUrl(url)), url)
})

testReassemble("Double encoded URL", () => {
  const url = "https://auth.services.wasakredit.se/Account/BankId?returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dwk_minasidor%26scope%3Dopenid%2Boffline_access%26redirect_uri%3Dhttps%253a%252f%252fminasidor.wasakredit.se%252finloggning%252fcallback%26state%3De7129877ba924773a9eec92f5fbf571b%26nonce%3D3289c6d841a04c789248cf0d567b4dcb"
  assert.equal(assembleUrl(dissectUrl(url)), url)
})

{
  const url =
    "https://example.com/path/to-resource?query=param&key=value#hashvalue"
  testDissect("Normal URL", () => {
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        { _type: "path", data: "path" },
        { _type: "path", data: "to-resource" },
      ],
      query: {
        _type: "query",
        data: {
          _type: "array",
          raw: "query=param&key=value",
          contents: [
            { _type: "pair", key: "query", value: "param" },
            { _type: "pair", key: "key", value: "value" },
          ],
        },
      },
      hash: "hashvalue",
    } satisfies Url)
  })

  testReassemble("Reassemble Normal URL", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

{
  const url = "https://example.com/Hello%20World"
  testDissect("URL encoded", () => {
    const encodedHelloWorld = {
      _type: "urlencoded" as const,
      raw: "Hello%20World",
      data: "Hello World",
    }
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        {
          _type: "path",
          data: encodedHelloWorld,
        },
      ],
    } satisfies Url)
  })

  testReassemble("Reassemble URL encoded", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

testReassemble("Reassemble broken url encoding", () => {
  const url = "https://example.com/path/%B"
  assert.equal(assembleUrl(dissectUrl(url)), url)
})

testReassemble("Reassemble broken RFC3986 url encoding", () => {
  const url = "https://example.com/path/%B"
  assert.equal(assembleUrl(dissectUrl(url)), url)
})

{
  const url =
    "https://example.com/Hello%20World%20%21%3F%5B%5D?Hello%20World%20%21%3F%5B%5D=Hello%20World%20%21%3F%5B%5D"
  testDissect("RFC3986 URL encoded", () => {
    const encodedHelloWorld = {
      _type: "rfc3986uri" as const,
      raw: "Hello%20World%20%21%3F%5B%5D",
      data: "Hello World !?[]",
    }
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        {
          _type: "path",
          data: encodedHelloWorld,
        },
      ],
      query: {
        _type: "query",
        data: {
          _type: "array",
          raw: "Hello%20World%20%21%3F%5B%5D=Hello%20World%20%21%3F%5B%5D",
          contents: [
            { _type: "pair", key: encodedHelloWorld, value: encodedHelloWorld },
          ],
        },
      },
    } satisfies Url)
  })

  testReassemble("Reassemble RFC3986 URL encoded", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

{
  const url = "https://example.com/%2521%2520Hello%2520World"
  testDissect("Double URL encoded", () => {
    const doubleEncodedHelloWorld = {
      _type: "urlencoded",
      raw: "%2521%2520Hello%2520World",
      data: {
        _type: "rfc3986uri",
        raw: "%21%20Hello%20World",
        data: "! Hello World",
      },
    } satisfies UrlEncoded
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        {
          _type: "path",
          data: doubleEncodedHelloWorld,
        },
      ],
    } satisfies Url)
  })

  testReassemble("Reassemble Double URL encoded", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

{
  const url = "https://example.com/path?string"
  testDissect("String query", () => {
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        {
          _type: "path",
          data: "path",
        },
      ],
      query: {
        _type: "query",
        data: "string",
      },
    } satisfies Url)
  })

  testReassemble("Reassemble String query", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

{
  const url = "https://example.com/path?string&key=value"
  testDissect("String and key value query", () => {
    assert.equal(dissectUrl(url), {
      protocol: "https",
      host: [
        { _type: "host", data: "example" },
        { _type: "host", data: "com" },
      ],
      path: [
        {
          _type: "path",
          data: "path",
        },
      ],
      query: {
        _type: "query",
        data: {
          _type: "array",
          raw: "string&key=value",
          contents: ["string", { _type: "pair", key: "key", value: "value" }],
        },
      },
    } satisfies Url)
  })

  testReassemble("Reassemble String and key value query", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

testDissect.run()
testReassemble.run()
