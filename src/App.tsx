import { Component, createSignal } from "solid-js"
import { DissectURL } from "./ShowUrl"
import { ContentEditable } from "@bigmistqke/solid-contenteditable"

const App: Component = () => {
  const [url, setUrl] = createSignal(
    "https://user:password@authorize.psd2-sandbox.op.fi/oauth/authorize/purescript-jordans-reference-site/content/%2521%2520Hello%2520World/%21%20Hello%20World/01-Prelude-ish/08-Control-Flow-Typeclasses/?request=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxQRTNBUSJ9.eyJhdWQiOiJodHRwczovL210bHMtYXBpcy5wc2QyLXNhbmRib3gub3AuZmkiLCJpc3MiOiI4ODlodFYxdEFiTXpqWFUzZGtYQSIsInJlc3BvbnNlX3R5cGUiOiJjb2RlIGlkX3Rva2VuIiwiY2xpZW50X2lkIjoiODg5aHRWMXRBYk16alhVM2RrWEEiLCJyZWRpcmVjdF91cmkiOiJodHRwczovL3psYW50YXIuYmVzdmlrZWwuc2UiLCJzY29wZSI6Im9wZW5pZCBhY2NvdW50cyIsInN0YXRlIjoiOGUyOWNmNTYtY2YyZC00ODQ3LTg0N2ItZDI1YzQxOTYxMTEyIiwibm9uY2UiOiI1MDk5N2E5YS05YmEyLTQyNGQtOTIxZS02ZDk5ODViMWRmYmMiLCJtYXhfYWdlIjo4NjQwMCwiZXhwIjoxNjQ3NzIxMzg0LCJpYXQiOjE2NDc3MjA0ODQsImNsYWltcyI6eyJ1c2VyaW5mbyI6eyJhdXRob3JpemF0aW9uSWQiOnsidmFsdWUiOiI4YjQwMzUwOC00MjRlLTRkNWItOTc3My0zNDVkMGQ5MTI5ODMiLCJlc3NlbnRpYWwiOnRydWV9fSwiaWRfdG9rZW4iOnsiYXV0aG9yaXphdGlvbklkIjp7InZhbHVlIjoiOGI0MDM1MDgtNDI0ZS00ZDViLTk3NzMtMzQ1ZDBkOTEyOTgzIiwiZXNzZW50aWFsIjp0cnVlfSwiYWNyIjp7ImVzc2VudGlhbCI6dHJ1ZSwidmFsdWVzIjpbInVybjpvcGVuYmFua2luZzpwc2QyOnNjYSJdfX19fQ.DDm7KVL2jfOHV9pPttUGhuI92ID_p3tUpvzHUYRlTzsVdlTgiI-Ef6dR-fZ0w5F5pfvWcLzPp-J7lyNriopnwHI34jlzpoYcWu5Cnrn4M5gQmdm1-trcFu72sjUJ_7ANzIbX9LjbpDPdb3kztBrP20-zcGYSCgwlB9gzKhLhOeGxPcNnIG0hL2-S7mAPY-8vO5NAQiATPhjZN4IcO90HnAw7OFmw3fMPf9jsk4liZgELDY6M3JfqzqQf5UPMLzk8LBVqNAS8Wqeg5xo85pmaHQdxZaCplVL9kmiyMlD2NuEqrHc2fI0vW81-P9c6sOzW4nqC6KgsuU_FsGhlf46mhsZhFjndWMjb9Vwnmbjfu_5Uk-nnLmkkEMVp742fA05g9J-YNIO8mSPmRBrRyNCPmT4vVw6SGzB6Xw6N0bwecsNmsU2edGBEseXKjG3dskIC-OHvOi97WFrvydivOMa_NLc49w4HJ7cqwic4WX_AljsXS-U_WYYLfhFieA8rIEL5ilvEHgEKwrC3MqSah5puEOAvW5O6g1lcHm7XJkBsL662cbm4yAiebCeN8kg3yVsZdswny-yvfqF5IHUrZ7lax1xrRciv1UkI3c8njVzEc0cbQlmptOuhMJiaTDgeYqDdP8Jx3e6jWDkvKh7Z5OWoGFK1yPp_p7-uktIsFaVFkM&response_type=code&client_id=889htV1tAbMzjXU3dkXA&scope=openid+accounts&and=eyJzb21lIjoianNvbiJ9"
  )

  return (
    <>
      <div class="h-full flex" style={{ "max-width": "100vw" }}>
        <div class="m-auto">
          <h1 class="text-5xl font-thin">Dissect URL</h1>
          <ContentEditable
            class="text-left font-mono m-5 text-sm border-1 p-2"
            style={{ "word-break": "break-all" }}
            textContent={url()}
            onTextContent={setUrl}
          />
          <span>{url()}</span>
          <DissectURL url={url} />
          {/* <p class="text-left">https://user:password@authorize.psd2-sandbox.op.fi/oauth/authorize/purescript-jordans-reference-site/content/%2521%2520Hello%2520World/%21%20Hello%20World/01-Prelude-ish/08-Control-Flow-Typeclasses/?request=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxQRTNBUSJ9.eyJhdWQiOiJodHRwczovL210bHMtYXBpcy5wc2QyLXNhbmRib3gub3AuZmkiLCJpc3MiOiI4ODlodFYxdEFiTXpqWFUzZGtYQSIsInJlc3BvbnNlX3R5cGUiOiJjb2RlIGlkX3Rva2VuIiwiY2xpZW50X2lkIjoiODg5aHRWMXRBYk16alhVM2RrWEEiLCJyZWRpcmVjdF91cmkiOiJodHRwczovL3psYW50YXIuYmVzdmlrZWwuc2UiLCJzY29wZSI6Im9wZW5pZCBhY2NvdW50cyIsInN0YXRlIjoiOGUyOWNmNTYtY2YyZC00ODQ3LTg0N2ItZDI1YzQxOTYxMTEyIiwibm9uY2UiOiI1MDk5N2E5YS05YmEyLTQyNGQtOTIxZS02ZDk5ODViMWRmYmMiLCJtYXhfYWdlIjo4NjQwMCwiZXhwIjoxNjQ3NzIxMzg0LCJpYXQiOjE2NDc3MjA0ODQsImNsYWltcyI6eyJ1c2VyaW5mbyI6eyJhdXRob3JpemF0aW9uSWQiOnsidmFsdWUiOiI4YjQwMzUwOC00MjRlLTRkNWItOTc3My0zNDVkMGQ5MTI5ODMiLCJlc3NlbnRpYWwiOnRydWV9fSwiaWRfdG9rZW4iOnsiYXV0aG9yaXphdGlvbklkIjp7InZhbHVlIjoiOGI0MDM1MDgtNDI0ZS00ZDViLTk3NzMtMzQ1ZDBkOTEyOTgzIiwiZXNzZW50aWFsIjp0cnVlfSwiYWNyIjp7ImVzc2VudGlhbCI6dHJ1ZSwidmFsdWVzIjpbInVybjpvcGVuYmFua2luZzpwc2QyOnNjYSJdfX19fQ.DDm7KVL2jfOHV9pPttUGhuI92ID_p3tUpvzHUYRlTzsVdlTgiI-Ef6dR-fZ0w5F5pfvWcLzPp-J7lyNriopnwHI34jlzpoYcWu5Cnrn4M5gQmdm1-trcFu72sjUJ_7ANzIbX9LjbpDPdb3kztBrP20-zcGYSCgwlB9gzKhLhOeGxPcNnIG0hL2-S7mAPY-8vO5NAQiATPhjZN4IcO90HnAw7OFmw3fMPf9jsk4liZgELDY6M3JfqzqQf5UPMLzk8LBVqNAS8Wqeg5xo85pmaHQdxZaCplVL9kmiyMlD2NuEqrHc2fI0vW81-P9c6sOzW4nqC6KgsuU_FsGhlf46mhsZhFjndWMjb9Vwnmbjfu_5Uk-nnLmkkEMVp742fA05g9J-YNIO8mSPmRBrRyNCPmT4vVw6SGzB6Xw6N0bwecsNmsU2edGBEseXKjG3dskIC-OHvOi97WFrvydivOMa_NLc49w4HJ7cqwic4WX_AljsXS-U_WYYLfhFieA8rIEL5ilvEHgEKwrC3MqSah5puEOAvW5O6g1lcHm7XJkBsL662cbm4yAiebCeN8kg3yVsZdswny-yvfqF5IHUrZ7lax1xrRciv1UkI3c8njVzEc0cbQlmptOuhMJiaTDgeYqDdP8Jx3e6jWDkvKh7Z5OWoGFK1yPp_p7-uktIsFaVFkM&response_type=code&client_id=889htV1tAbMzjXU3dkXA&scope=openid+accounts</p> */}

          {/* <DissectURL url="https://example.com/path/to/resource?query=param&and=eyJzb21lIjoianNvbiJ9#hashvalue" />
          <hr />
          <DissectURL url="https://example.com/path/to/resource?key=value&key=value&email=mail%40email.com" />
          <hr />
          <DissectURL url="https://user:password@authorize.psd2-sandbox.op.fi/oauth/authorize/purescript-jordans-reference-site/content/%2521%2520Hello%2520World/%21%20Hello%20World/01-Prelude-ish/08-Control-Flow-Typeclasses/?request=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxQRTNBUSJ9.eyJhdWQiOiJodHRwczovL210bHMtYXBpcy5wc2QyLXNhbmRib3gub3AuZmkiLCJpc3MiOiI4ODlodFYxdEFiTXpqWFUzZGtYQSIsInJlc3BvbnNlX3R5cGUiOiJjb2RlIGlkX3Rva2VuIiwiY2xpZW50X2lkIjoiODg5aHRWMXRBYk16alhVM2RrWEEiLCJyZWRpcmVjdF91cmkiOiJodHRwczovL3psYW50YXIuYmVzdmlrZWwuc2UiLCJzY29wZSI6Im9wZW5pZCBhY2NvdW50cyIsInN0YXRlIjoiOGUyOWNmNTYtY2YyZC00ODQ3LTg0N2ItZDI1YzQxOTYxMTEyIiwibm9uY2UiOiI1MDk5N2E5YS05YmEyLTQyNGQtOTIxZS02ZDk5ODViMWRmYmMiLCJtYXhfYWdlIjo4NjQwMCwiZXhwIjoxNjQ3NzIxMzg0LCJpYXQiOjE2NDc3MjA0ODQsImNsYWltcyI6eyJ1c2VyaW5mbyI6eyJhdXRob3JpemF0aW9uSWQiOnsidmFsdWUiOiI4YjQwMzUwOC00MjRlLTRkNWItOTc3My0zNDVkMGQ5MTI5ODMiLCJlc3NlbnRpYWwiOnRydWV9fSwiaWRfdG9rZW4iOnsiYXV0aG9yaXphdGlvbklkIjp7InZhbHVlIjoiOGI0MDM1MDgtNDI0ZS00ZDViLTk3NzMtMzQ1ZDBkOTEyOTgzIiwiZXNzZW50aWFsIjp0cnVlfSwiYWNyIjp7ImVzc2VudGlhbCI6dHJ1ZSwidmFsdWVzIjpbInVybjpvcGVuYmFua2luZzpwc2QyOnNjYSJdfX19fQ.DDm7KVL2jfOHV9pPttUGhuI92ID_p3tUpvzHUYRlTzsVdlTgiI-Ef6dR-fZ0w5F5pfvWcLzPp-J7lyNriopnwHI34jlzpoYcWu5Cnrn4M5gQmdm1-trcFu72sjUJ_7ANzIbX9LjbpDPdb3kztBrP20-zcGYSCgwlB9gzKhLhOeGxPcNnIG0hL2-S7mAPY-8vO5NAQiATPhjZN4IcO90HnAw7OFmw3fMPf9jsk4liZgELDY6M3JfqzqQf5UPMLzk8LBVqNAS8Wqeg5xo85pmaHQdxZaCplVL9kmiyMlD2NuEqrHc2fI0vW81-P9c6sOzW4nqC6KgsuU_FsGhlf46mhsZhFjndWMjb9Vwnmbjfu_5Uk-nnLmkkEMVp742fA05g9J-YNIO8mSPmRBrRyNCPmT4vVw6SGzB6Xw6N0bwecsNmsU2edGBEseXKjG3dskIC-OHvOi97WFrvydivOMa_NLc49w4HJ7cqwic4WX_AljsXS-U_WYYLfhFieA8rIEL5ilvEHgEKwrC3MqSah5puEOAvW5O6g1lcHm7XJkBsL662cbm4yAiebCeN8kg3yVsZdswny-yvfqF5IHUrZ7lax1xrRciv1UkI3c8njVzEc0cbQlmptOuhMJiaTDgeYqDdP8Jx3e6jWDkvKh7Z5OWoGFK1yPp_p7-uktIsFaVFkM&response_type=code&client_id=889htV1tAbMzjXU3dkXA&scope=openid+accounts" /> */}
          {/* <DissectURL url="https://user:password@authorize.psd2-sandbox.op.fi/oauth/authorize/purescript-jordans-reference-site/content/%2521%2520Hello%2520World/%21%20Hello%20World/01-Prelude-ish/08-Control-Flow-Typeclasses/?request=&response_type=code&client_id=889htV1tAbMzjXU3dkXA&scope=openid+accounts" /> */}
        </div>
      </div>
    </>
  )
}

export default App
