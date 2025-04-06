export type AnyEncoding =
  | Json
  | JWT
  | UrlEncoded
  | RFC3986URIEncoded
  | Base64UrlEncoded

export type Encoding<Type, Content = string> = {
  _type: Type
  raw: string
  data: Content extends string ? Content | Encoding<any> : Content
}

export type UrlEncoded = Encoding<"urlencoded">

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

export type RFC3986URIEncoded = Encoding<"rfc3986uri">

export function encodeRFC3986URIComponent(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

function identifyRFC3986URIEncoded(
  string: string
): RFC3986URIEncoded | undefined {
  if (
    !"[!'()*]"
      .split("")
      .find((c) =>
        string.includes(`%${c.charCodeAt(0).toString(16).toUpperCase()}`)
      )
  )
    return

  const decoded = decodeURIComponent(string)
  if (decoded !== string) {
    return {
      _type: "rfc3986uri",
      raw: string,
      data: decoded,
    }
  }
}

export type Base64UrlEncoded = Encoding<"base64url">

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

export type Json = Encoding<"json", unknown>

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

export interface JWTContent {
  header: {}
  payload: {}
  signature: string
}
export type JWT = Encoding<"jwt", JWTContent>

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

type Encoder = (string: string) => AnyEncoding | undefined

export function identifyEncodings(
  encodings: Encoder[],
  string: string
): AnyEncoding | string {
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
        } as AnyEncoding
    }
  }

  return string
}
