import { Encoding } from "./encodings"

export type Primitive = string | KeyValuePair

export type Data = Primitive | Encoding | AndDelimited

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
