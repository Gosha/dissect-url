export interface Url {
  protocol: Protocol
  host: HostPart[]
  path: PathPart[]
  query?: QueryPart
  hash?: string
}

export type Protocol = string

export type Primitive = string | KeyValuePair
export type Encoding = Base64UrlEncoded | UrlEncoded | Json | JWT
export type Data = Primitive | Encoding | AndDelimited

export interface Base64UrlEncoded {
  _type: "base64url"
  raw: string
  data: Data
}

export interface UrlEncoded {
  _type: "urlencoded"
  raw: string
  data: Data
}

export interface Json {
  _type: "json"
  raw: string
  data: {}
}

export interface JWT {
  _type: "jwt"
  raw: string
  data: {
    header: {}
    payload: {}
    signature: string
  }
}

export interface Part<Type extends string> {
  _type: Type
  data: Data
}

export interface KeyValuePair {
  _type: "pair"
  key: Data
  value: Primitive | Encoding
}

export type AndDelimited = {
  _type: "array"
  raw: string
  contents: Data[]
}

export type HostPart = Part<"host">
export type PathPart = Part<"path">
export type QueryPart = Part<"query">

export function dissectUrl(url: string): Url {
  const urlObj = new URL(url)
  const protocol = urlObj.protocol.slice(0, -1) // Remove the trailing ":"
  const host = hostParts(urlObj.host)
  const path = pathParts(urlObj.pathname)
  const query = queryParts(urlObj.search.slice(1)) // Remove the leading "?"
  const hash = urlObj.hash.slice(1) // Remove the leading "#"

  return {
    protocol,
    host,
    path,
    query,
    hash,
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

const allEncodings = [
  identifyBase64UrlEncoded,
  identifyUrlEncoded,
  identifyJson,
  identifyJWT,
]

function pathParts(path: string): PathPart[] {
  const parts = path.split("/").slice(1)
  return parts.map((part) => ({
    _type: "path",
    data: identifyEncodings(allEncodings, part),
  }))
}

function queryParts(query: string): QueryPart {
  if (query.includes("&") || query.includes("=")) {
    const pairs = query.split("&").map((pair) => {
      if (pair.includes("=")) {
        const [key, value] = pair.split("=")
        return {
          _type: "pair" as const,
          key: identifyEncodings(allEncodings, key),
          value: identifyEncodings(allEncodings, value),
        }
      }
      return identifyEncodings(allEncodings, pair)
    })

    return {
      _type: "query",
      data: { _type: "array", raw: query, contents: pairs },
    }
  }

  return {
    _type: "query",
    data: identifyEncodings(allEncodings, query),
  }
}

function identifyUrlEncoded(string: string): UrlEncoded | undefined {
  const decoded = decodeURIComponent(string)
  if (decoded !== string) {
    return {
      _type: "urlencoded",
      raw: string,
      data: decoded,
    }
  }
}

function identifyBase64UrlEncoded(
  string: string
): Base64UrlEncoded | undefined {
  // Check if the string is a valid base64url encoded string
  if (!string.startsWith("ey")) return
  if (!string.match(/^[A-Za-z0-9\-_]+$/)) return

  try {
    const decoded = atob(string)

    if (printableCharacters(decoded)) {
      return {
        _type: "base64url",
        raw: string,
        data: decoded,
      }
    }
  } catch (e) {
    if (e instanceof Error && e.name == "InvalidCharacterError") return
    else throw e
  }
}

function identifyJson(string: string): Json | undefined {
  try {
    const parsed = JSON.parse(string)
    return {
      _type: "json",
      raw: string,
      data: parsed,
    }
  } catch (e) {
    if (e instanceof Error && e.name == "SyntaxError") return
    else throw e
  }
}

function identifyJWT(string: string): JWT | undefined {
  try {
    // Check if the string is a valid JWT
    const parts = string.split(".")
    if (parts.length !== 3) return

    const [header, payload, signature] = parts
    const decodedHeader = atob(header)
    const decodedPayload = atob(payload)

    if (
      printableCharacters(decodedHeader) &&
      printableCharacters(decodedPayload)
    ) {
      return {
        _type: "jwt",
        raw: string,
        data: {
          header: JSON.parse(decodedHeader),
          payload: JSON.parse(decodedPayload),
          signature,
        },
      }
    }
  } catch (e) {}
}

type Encoder = (string: string) => Encoding | undefined

function identifyEncodings(
  encodings: Encoder[],
  string: string
): Encoding | string {
  for (const identify of encodings) {
    const result = identify(string)
    if (result) {
      if (typeof result.data !== "string") return result

      const inner = identifyEncodings(encodings, result.data)
      if (inner === result.data) return result
      else
        return {
          ...result,
          data: inner,
        } as Encoding
    }
  }

  return string
}

function printableCharacters(string: string): boolean {
  // Including foreign scripts
  return /^[\x20-\x7E\u00A0-\uFFFF]*$/.test(string)
}
