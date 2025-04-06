import {
  Accessor,
  Component,
  createSignal,
  For,
  JSX,
  Match,
  Show,
  Switch,
} from "solid-js"
import {
  Base64UrlEncoded,
  Data,
  dissectUrl,
  Json,
  JWT,
  AndDelimited,
  KeyValuePair,
  Part,
  Url,
  UrlEncoded,
  RFC3986URIEncoded,
} from "./dissect-url"

export const DissectURL: Component<{ url: Accessor<string> }> = (props) => {
  const dissectedUrl = () => dissectUrl(props.url())

  const [showDebug, setShowDebug] = createSignal(false)

  return (
    <div class="flex flex-col text-left m-5">
      <ShowUrl url={dissectedUrl()} />

      <div
        class="text-sm flex mt-5 cursor-pointer"
        onClick={() => setShowDebug(!showDebug())}
      >
        <Show
          when={showDebug()}
          fallback={<div class="i-mdi-light:chevron-right  text-xl" />}
        >
          <div class="i-mdi-light:chevron-down  text-xl" />
        </Show>

        <div>Debug</div>
      </div>
      <Show when={showDebug()}>
        <pre
          class="text-xs ml-5"
          style={{ "text-wrap": "wrap", "word-break": "break-all" }}
        >
          {JSON.stringify(dissectedUrl(), null, 2)}
        </pre>
      </Show>
    </div>
  )
}

const Static: Component<{ children: JSX.Element }> = (props) => {
  return <div class="m-1 text-gray-500">{props.children}</div>
}

const ShowPart: Component<{ part?: Part<any> }> = (props) => {
  return (
    <div class="m-1">
      <Show when={props.part}>{(part) => <ShowData data={part().data} />}</Show>
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

const ShowRFC3986IROEncoded: Component<{ data: RFC3986URIEncoded }> = (
  props
) => {
  return (
    <span>
      encodeRFC3986(
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

const ShowPair: Component<{ data: KeyValuePair }> = (props) => {
  return (
    <div class="flex">
      <div class="m-1 flex-shrink-0">
        <ShowData data={props.data.key} />
      </div>
      <Static>=</Static>
      <div class="m-1">
        <ShowData data={props.data.value} />
      </div>
    </div>
  )
}

const ShowArray: Component<{ data: AndDelimited }> = (props) => {
  return (
    <For each={props.data.contents}>
      {(item, index) => (
        <div class="flex">
          <Static>{index() == 0 ? "?" : "&"}</Static>
          <ShowData data={item} />
        </div>
      )}
    </For>
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

const ShowData: Component<{ data: Data }> = (props) => {
  function getNonString<T>(x: T): Exclude<T, string> | undefined {
    if (typeof x !== "string") return x as Exclude<T, string>
  }

  function getWhenType<T extends { _type: string }, K extends T["_type"]>(
    x: T,
    k: K
  ): Extract<T, { _type: K }> | undefined {
    if (x._type === k) return x as Extract<T, { _type: K }>
  }

  return (
    <Switch>
      <Match when={typeof props.data === "string"}>
        {<span>{props.data as string}</span>}
      </Match>
      <Match when={getNonString(props.data)}>
        {(data) => (
          <Switch fallback={<pre>{JSON.stringify(props.data)}</pre>}>
            <Match when={getWhenType(data(), "urlencoded")}>
              {(data) => <ShowUrlEncoded data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "rfc3986uri")}>
              {(data) => <ShowRFC3986IROEncoded data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "base64url")}>
              {(data) => <ShowBase64Encoded data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "json")}>
              {(data) => <ShowJson data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "jwt")}>
              {(data) => <ShowJWT data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "pair")}>
              {(data) => <ShowPair data={data()} />}
            </Match>
            <Match when={getWhenType(data(), "array")}>
              {(data) => <ShowArray data={data()} />}
            </Match>
          </Switch>
        )}
      </Match>
    </Switch>
  )
}

const ShowUrl: Component<{ url: Url }> = (props) => {
  const protocol = () => props.url.protocol
  const host = () => props.url.host
  const path = () => props.url.path
  const query = () => props.url.query
  const hash = () => props.url.hash

  return (
    <>
      <div class="flex">
        <Static>{protocol()}://</Static>
        <For each={host()}>
          {(item, index) => (
            <>
              <ShowPart part={item} />
              <Show when={index() !== host().length - 1}>
                <Static>.</Static>
              </Show>
            </>
          )}
        </For>
      </div>

      <div class="ml-5 flex flex-wrap">
        <Static>/</Static>
        <For each={path()}>
          {(item, index) => (
            <>
              <ShowPart part={item} />
              <Show when={index() !== path().length - 1}>
                <Static>/</Static>
              </Show>
            </>
          )}
        </For>
      </div>

      <div class="ml-5 flex flex-col" style={{ "word-break": "break-all" }}>
        <ShowPart part={query()} />
      </div>

      <div class="ml-5 flex flex-col" style={{ "word-break": "break-all" }}>
        <Show when={hash()}>
          {(hash) => (
            <div class="flex">
              <Static>#</Static>
              <div class="m-1">
                <ShowData data={hash()} />
              </div>
            </div>
          )}
        </Show>
      </div>
    </>
  )
}
