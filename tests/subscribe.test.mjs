import { test } from "node:test";
import assert from "node:assert/strict";
import subscribe, { config } from "../netlify/functions/subscribe.mjs";

const request = (data = { email: "reader@example.com" }, headers = {}) =>
  new Request("https://saisneha.com/api/subscribe", {
    method: "POST",
    headers: { origin: "https://saisneha.com", "content-type": "application/json", ...headers },
    body: JSON.stringify(data),
  });

function setup(t, response) {
  const oldKey = process.env.BUTTONDOWN_API_KEY;
  process.env.BUTTONDOWN_API_KEY = "test-key-not-real";
  t.after(() => {
    if (oldKey === undefined) delete process.env.BUTTONDOWN_API_KEY;
    else process.env.BUTTONDOWN_API_KEY = oldKey;
  });
  return t.mock.method(globalThis, "fetch", response);
}

test("creates only a pending subscriber and returns no personal data", async t => {
  const upstream = setup(t, async (url, options) => {
    assert.equal(url, "https://api.buttondown.com/v1/subscribers");
    assert.equal(options.headers.Authorization, "Token test-key-not-real");
    assert.equal(options.headers["X-Buttondown-Collision-Behavior"], undefined);
    assert.deepEqual(JSON.parse(options.body), {
      email_address: "reader@example.com", type: "unactivated", ip_address: "192.0.2.1",
    });
    return Response.json({ type: "unactivated", email_address: "reader@example.com" }, { status: 201 });
  });
  const result = await subscribe(request(), { ip: "192.0.2.1" });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.deepEqual(await result.json(), { status: "pending" });
  assert.equal(upstream.mock.callCount(), 1);
  assert.equal(config.path, "/api/subscribe");
  assert.equal(config.rateLimit.windowLimit, 5);
});

test("rejects invalid, cross-origin, bot and oversized input before contacting Buttondown", async t => {
  const upstream = setup(t, () => { throw new Error("must not call"); });
  for (const [req, status] of [
    [request({ email: "bad" }), 400],
    [request(null), 400],
    [request({ email: "reader@example.com", website: "spam" }), 400],
    [request(undefined, { origin: "https://other.example" }), 403],
    [request(undefined, { "content-type": "text/plain" }), 415],
    [request({ email: "a".repeat(2100) }), 413],
    [new Request("https://saisneha.com/api/subscribe"), 405],
  ]) assert.equal((await subscribe(req, {})).status, status);
  assert.equal(upstream.mock.callCount(), 0);
});

test("missing key fails closed", async t => {
  const upstream = setup(t, () => { throw new Error("must not call"); });
  delete process.env.BUTTONDOWN_API_KEY;
  assert.equal((await subscribe(request(), {})).status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});

for (const status of [400, 401, 403, 409, 422, 429, 500]) {
  test(`upstream ${status} is not presented as success or leaked`, async t => {
    setup(t, async () => Response.json({ secret: "upstream-detail" }, { status }));
    const result = await subscribe(request(), {});
    assert.equal(result.status, status === 429 ? 429 : 502);
    assert.deepEqual(await result.json(), { error: "rejected" });
  });
}

for (const type of ["regular", "blocked", undefined]) {
  test(`unexpected subscriber state ${type} is not confirmation success`, async t => {
    setup(t, async () => Response.json({ type }));
    assert.equal((await subscribe(request(), {})).status, 502);
  });
}

test("network timeout has a retryable error, never success", async t => {
  setup(t, async () => { throw new DOMException("Timed out", "TimeoutError"); });
  assert.equal((await subscribe(request(), {})).status, 502);
});
