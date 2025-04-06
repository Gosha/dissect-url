import { suite } from "uvu"

import * as assert from "uvu/assert"
import { assembleUrl, dissectUrl, Url } from "./dissect-url"

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
  const url =
    "https://example.com/Hello%20World%20%21%3F%5B%5D?Hello%20World%20%21%3F%5B%5D=Hello%20World%20%21%3F%5B%5D"
  testDissect("URL encoded", () => {
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

  testReassemble("Reassemble URL encoded", () => {
    assert.equal(assembleUrl(dissectUrl(url)), url)
  })
}

{
  const url = "https://example.com/%2521%2520Hello%2520World"
  testDissect("Double URL encoded", () => {
    const encodedHelloWorld = {
      _type: "rfc3986uri" as const,
      raw: "%21%20Hello%20World",
      data: "! Hello World",
    }
    const doubleEncodedHelloWorld = {
      _type: "rfc3986uri" as const,
      raw: "%2521%2520Hello%2520World",
      data: encodedHelloWorld,
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
