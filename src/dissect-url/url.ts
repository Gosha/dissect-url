import { encode, identifyEncodings } from "./encodings"
import { Data } from "./types"

export type Protocol = string

export interface Url {
  protocol: Protocol
  host: HostPart[]
  path: PathPart[]
  query?: QueryPart
  hash?: string
}

export interface Part<Type extends string> {
  _type: Type
  data: Data
}

export type HostPart = Part<"host">
export type PathPart = Part<"path">
export type QueryPart = Part<"query">

function extractUrlHash(url: string): string | undefined {
  const hashIndex = url.indexOf("#")
  if (hashIndex === -1) return undefined
  return url.slice(hashIndex + 1)
}

export function dissectUrl(url: string): Url {
  const urlObj = new URL(url)
  const protocol = urlObj.protocol.slice(0, -1) // Remove the trailing ":"
  const host = hostParts(urlObj.host)
  const path = pathParts(urlObj.pathname)
  const query = url.includes("?")
    ? queryParts(urlObj.search.slice(1))
    : undefined
  const hash = extractUrlHash(url)

  return {
    protocol,
    host,
    path,
    ...(hash !== undefined ? { hash } : {}),
    ...(query !== undefined ? { query } : {}),
  }
}

export function assembleUrl(url: Url): string {
  const protocol = url.protocol + ":"
  const host = url.host.map((part) => part.data).join(".")
  const path = url.path.map((part) => encodeAll(part.data)).join("/")
  const query = url.query !== undefined ? "?" + encodeAll(url.query.data) : ""
  const hash = url.hash !== undefined ? "#" + encodeAll(url.hash) : ""

  return `${protocol}//${host}/${path}${query}${hash}`
}

function encodeAll(data: Data): string {
  if (typeof data === "string") return data
  switch (data._type) {
    case "urlencoded":
    case "rfc3986uri":
    case "base64url":
    case "json":
    case "jwt":
      return encode(data)
    case "pair":
      return `${encodeAll(data.key)}=${encodeAll(data.value)}`
    case "array":
      return data.contents.map(encodeAll).join("&")
  }
}

const example1: Url = {
  protocol: "https",
  host: [
    { _type: "host", data: "example" },
    { _type: "host", data: "com" },
  ],
  path: [
    {
      _type: "path",
      data: { _type: "base64url", raw: "ZXhhbXBsZQ", data: "path" },
    },
    { _type: "path", data: "to" },
    {
      _type: "path",
      data: {
        _type: "urlencoded",
        raw: "%21%20Hello%20World",
        data: "! Hello World",
      },
    },
  ],
  query: {
    _type: "query",
    data: {
      _type: "array",
      raw: "query=ZXhhbXBsZQ",
      contents: [
        {
          _type: "pair",
          key: "query",
          value: { _type: "base64url", raw: "ZXhhbXBsZQ", data: "path" },
        },
      ],
    },
  },
}

function hostParts(host: string): HostPart[] {
  const parts = host.split(".")
  return parts.map((part) => ({
    _type: "host",
    data: part,
  }))
}

function pathParts(path: string): PathPart[] {
  const parts = path.split("/").slice(1)
  return parts.map((part) => ({
    _type: "path",
    data: identifyEncodings(part),
  }))
}

function queryParts(query: string): QueryPart {
  if (query.includes("&") || query.includes("=")) {
    const pairs = query.split("&").map((pair) => {
      if (pair.includes("=")) {
        const [key, value] = pair.split("=")
        return {
          _type: "pair" as const,
          key: identifyEncodings(key),
          value: identifyEncodings(value),
        }
      }
      return identifyEncodings(pair)
    })

    return {
      _type: "query",
      data: { _type: "array", raw: query, contents: pairs },
    }
  }

  return {
    _type: "query",
    data: identifyEncodings(query),
  }
}
