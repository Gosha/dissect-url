export type AnyEncoding =
  | Json
  | JWT
  | UrlEncoded
  | RFC3986URIEncoded
  | Base64UrlEncoded

export type Encoding<Type, Content = string> = {
  _type: Type
  raw: string
  data: Content extends string ? Content | Encoding<any, any> : Content
}

export type Encoded<T extends Encoding<unknown, unknown>> = T extends Encoding<
  infer Type,
  infer Content
>
  ? {
      _type: Type
      raw: string
      data: Content
    }
  : never

export type UrlEncoded = Encoding<"urlencoded">

export interface Encoder<E extends Encoding<unknown, unknown>> {
  identify: (string: string) => E | undefined
  encode: (data: Encoded<E>) => string
}

const urlEncoder: Encoder<UrlEncoded> = {
  identify(string) {
    const decoded = decodeURIComponent(string)
    if (decoded !== string) {
      return {
        _type: "urlencoded",
        raw: string,
        data: decoded,
      }
    }
  },
  encode(data) {
    return encodeURIComponent(data.data)
  },
}

export type RFC3986URIEncoded = Encoding<"rfc3986uri">

export function encodeRFC3986URIComponent(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

const rfc3986uriEncoder: Encoder<RFC3986URIEncoded> = {
  identify(string: string): RFC3986URIEncoded | undefined {
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
  },
  encode(data) {
    return encodeRFC3986URIComponent(data.data)
  },
}

function base64URLencode(str: string): string {
  const utf8Arr = new TextEncoder().encode(str)
  const base64Encoded = btoa(utf8Arr as any as string)
  return base64Encoded
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export type Base64UrlEncoded = Encoding<"base64url">

function printableCharacters(string: string): boolean {
  // Including foreign scripts
  return /^[\x20-\x7E\u00A0-\uFFFF]*$/.test(string)
}

const base64urlEncoder: Encoder<Base64UrlEncoded> = {
  identify(string: string): Base64UrlEncoded | undefined {
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
  },
  encode(data) {
    return base64URLencode(data.data)
  },
}

export type Json = Encoding<"json", unknown>

const jsonEncoder: Encoder<Json> = {
  identify(string: string) {
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
  },
  encode(data) {
    return JSON.stringify(data.data)
  },
}

export interface JWTContent {
  header: {}
  payload: {}
  signature: string
}
export type JWT = Encoding<"jwt", JWTContent>

const jwtEncoder: Encoder<JWT> = {
  identify(string: string) {
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
  },
  encode(data) {
    return (
      base64URLencode(JSON.stringify(data.data.header)) +
      "." +
      base64URLencode(JSON.stringify(data.data.payload)) +
      "." +
      data.data.signature
    )
  },
}

const allEncoders = {
  base64url: base64urlEncoder,
  rfc3986uri: rfc3986uriEncoder,
  urlencoded: urlEncoder,
  json: jsonEncoder,
  jwt: jwtEncoder,
}

export function identifyEncodings(string: string): AnyEncoding | string {
  for (const encoder of Object.values(allEncoders)) {
    const result = encoder.identify(string)
    if (result) {
      if (typeof result.data !== "string") return result

      const inner = identifyEncodings(result.data)
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

function encoderFor<T extends keyof typeof allEncoders>(
  type: T
): (typeof allEncoders)[T] {
  return allEncoders[type]
}

export function encode<T extends Encoding<any, any>>(data: T): string {
  const encoder = encoderFor(data._type)

  if (typeof data.data === "string") {
    return encoder.encode(data)
  } else {
    return encoder.encode({ ...data, data: encode(data.data) })
  }
}
