import { suite } from "uvu"

import * as assert from "uvu/assert"
import { dissectUrl, Url } from "./dissect-url"

const test = suite("dissect-url")

test("Normal URL", () => {
  assert.equal(
    dissectUrl(
      "https://example.com/path/to-resource?query=param&key=value#hashvalue"
    ),
    {
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
    } satisfies Url
  )
})

test("URL encoded", () => {
  const encodedHelloWorld = {
    _type: "urlencoded" as const,
    raw: "%21%20Hello%20World",
    data: "! Hello World",
  }
  assert.equal(
    dissectUrl(
      "https://example.com/%21%20Hello%20World?%21%20Hello%20World=%21%20Hello%20World"
    ),
    {
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
          raw: "%21%20Hello%20World=%21%20Hello%20World",
          contents: [
            { _type: "pair", key: encodedHelloWorld, value: encodedHelloWorld },
          ],
        },
      },
      hash: "",
    } satisfies Url
  )
})

test("Double URL encoded", () => {
  const encodedHelloWorld = {
    _type: "urlencoded" as const,
    raw: "%21%20Hello%20World",
    data: "! Hello World",
  }
  const doubleEncodedHelloWorld = {
    _type: "urlencoded" as const,
    raw: "%2521%2520Hello%2520World",
    data: encodedHelloWorld,
  }
  assert.equal(dissectUrl("https://example.com/%2521%2520Hello%2520World"), {
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
    query: {
      _type: "query",
      data: "",
    },
    hash: "",
  } satisfies Url)
})

test("String query", () => {
  assert.equal(dissectUrl("https://example.com/path?string"), {
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
    hash: "",
  } satisfies Url)
})

test("String and key value query", () => {
  assert.equal(dissectUrl("https://example.com/path?string&key=value"), {
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
    hash: "",
  } satisfies Url)
})

test.run()
