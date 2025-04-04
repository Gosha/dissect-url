import { Accessor, Component, For, JSX, Show } from "solid-js"
import {
  Base64UrlEncoded,
  Data,
  dissectUrl,
  Json,
  JWT,
  KeyValuePairs,
  Part,
  Url,
  UrlEncoded,
} from "./dissect-url"

export const DissectURL: Component<{ url: Accessor<string> }> = (props) => {
  const dissectedUrl = () => dissectUrl(props.url())

  return (
    <div class="flex flex-col text-left m-5">
      {/* <p class="text-xs mb-5" style={{ "word-break": "break-all" }}>
        {props.url}
      </p> */}
      <ShowUrl url={dissectedUrl()} />
      {/* <pre
        class="text-xs"
        style={{ "text-wrap": "wrap", "word-break": "break-all" }}
      >
        {JSON.stringify(dissectedUrl, null, 2)}
      </pre> */}
    </div>
  )
}

const Static: Component<{ children: JSX.Element }> = (props) => {
  return <div class="m-1 text-gray-500">{props.children}</div>
}

const ShowPart: Component<{ part: Part<any> }> = (props) => {
  return (
    <div class="m-1">
      <ShowData data={props.part.data} />
    </div>
  )
}

const ShowUrlEncoded: Component<{ data: UrlEncoded }> = (props) => {
  return (
    <span>
      urlencode(
      <ShowData data={props.data.data} />)
    </span>
  )
}

const ShowBase64Encoded: Component<{ data: Base64UrlEncoded }> = (props) => {
  return (
    <span>
      base64(
      <ShowData data={props.data.data} />)
    </span>
  )
}

const ShowJson: Component<{ data: Json }> = (props) => {
  return (
    <span>
      stringify(
      <span class="font-mono">{JSON.stringify(props.data.data)}</span>)
    </span>
  )
}

const ShowJWT: Component<{ data: JWT }> = (props) => {
  return (
    <span class="font-mono">
      JWT(
      <span style={{ "white-space": "pre" }}>
        {JSON.stringify(props.data.data.header, null, 2)}
      </span>
      ,{" "}
      <span style={{ "white-space": "pre" }}>
        {JSON.stringify(props.data.data.payload, null, 2)}
      </span>
      ,{" "}
      <span
        style={{
          display: "inline-block",
          "text-overflow": "ellipsis",
          overflow: "hidden",
          "white-space": "nowrap",
          "max-width": "20em",
          "vertical-align": "bottom",
        }}
      >
        {JSON.stringify(props.data.data.signature, null, 2)}
      </span>
      ")
    </span>
  )
}

const ShowData: Component<{ data: Data }> = ({ data }) => {
  if (typeof data === "string") {
    return <span>{data}</span>
  }
  switch (data._type) {
    case "urlencoded":
      return <ShowUrlEncoded data={data} />
    case "base64url":
      return <ShowBase64Encoded data={data} />
    case "json":
      return <ShowJson data={data} />
    case "jwt":
      return <ShowJWT data={data} />
  }
  return <pre>{JSON.stringify(data)}</pre>
}

const ShowUrl: Component<{ url: Url }> = (props) => {
  return (
    <>
      <div class="flex">
        <Static>{props.url.protocol}://</Static>
        <For each={props.url.host}>
          {(item, index) => (
            <>
              <ShowPart part={item} />
              <Show when={index() !== props.url.host.length - 1}>
                <Static>.</Static>
              </Show>
            </>
          )}
        </For>
      </div>

      <div class="ml-5 flex flex-wrap">
        <Static>/</Static>
        <For each={props.url.path}>
          {(item, index) => (
            <>
              <ShowPart part={item} />
              <Show when={index() !== props.url.path.length - 1}>
                <Static>/</Static>
              </Show>
            </>
          )}
        </For>
      </div>

      <div class="ml-5 flex flex-col" style={{ "word-break": "break-all" }}>
        <Show when={isKeyValue(props.url.query?.data) && props.url.query?.data}>
          {(data) => (
            <For each={data().pairs}>
              {(item, index) => (
                <div class="flex">
                  <Static>{index() == 0 ? "?" : "&"}</Static>
                  <div class="m-1 shrink-0">
                    <ShowData data={item.key} />
                  </div>
                  <Static>=</Static>
                  <div class="m-1">
                    <ShowData data={item.value} />
                  </div>
                </div>
              )}
            </For>
          )}
        </Show>
      </div>
    </>
  )
}

function isKeyValue(data?: Data): data is KeyValuePairs {
  return typeof data === "object" && data._type === "keyvalue"
}
