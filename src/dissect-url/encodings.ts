import { Data } from "./types"

export type Encoding =
  | Json
  | JWT
  | UrlEncoded
  | RFC3986URIEncoded
  | Base64UrlEncoded

export interface UrlEncoded {
  _type: "urlencoded"
  raw: string
  data: Data
}

export const allEncodings = [
  identifyBase64UrlEncoded,
  identifyRFC3986URIEncoded,
  identifyUrlEncoded,
  identifyJson,
  identifyJWT,
]

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

export interface RFC3986URIEncoded {
  _type: "rfc3986uri"
  raw: string
  data: Data
}

export function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

function identifyRFC3986URIEncoded(
  string: string
): RFC3986URIEncoded | undefined {
  // TODO:
  const decoded = decodeURIComponent(string)
  if (decoded !== string) {
    return {
      _type: "rfc3986uri",
      raw: string,
      data: decoded,
    }
  }
}

export interface Base64UrlEncoded {
  _type: "base64url"
  raw: string
  data: Data
}

function printableCharacters(string: string): boolean {
  // Including foreign scripts
  return /^[\x20-\x7E\u00A0-\uFFFF]*$/.test(string)
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

export interface Json {
  _type: "json"
  raw: string
  data: {}
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

export interface JWT {
  _type: "jwt"
  raw: string
  data: {
    header: {}
    payload: {}
    signature: string
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

export function identifyEncodings(
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
