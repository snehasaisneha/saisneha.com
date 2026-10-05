const reply = (status, body) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store" },
});

export default async function subscribe(request, context) {
  if (request.method !== "POST") return reply(405, { error: "method" });
  // Same-origin checks are not bot protection; the edge rate limit and
  // Buttondown's validation handle abuse separately.
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return reply(403, { error: "origin" });
  }
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return reply(415, { error: "content_type" });
  }
  if (Number(request.headers.get("content-length")) > 2048) {
    return reply(413, { error: "size" });
  }
  let data;
  try {
    const body = await request.text();
    if (body.length > 2048) return reply(413, { error: "size" });
    data = JSON.parse(body);
  } catch {
    return reply(400, { error: "invalid" });
  }
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  if (data?.website || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(400, { error: "invalid" });
  }
  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) return reply(503, { error: "unavailable" });
  try {
    const response = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        type: "unactivated",
        ...(context.ip ? { ip_address: context.ip } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    // Never overwrite existing subscribers or expose upstream error bodies.
    if (!response.ok) return reply(response.status === 429 ? 429 : 502, { error: "rejected" });
    const subscriber = await response.json();
    if (subscriber.type !== "unactivated") return reply(502, { error: "unexpected_state" });
    return reply(200, { status: "pending" });
  } catch {
    return reply(502, { error: "unavailable" });
  }
}

export const config = {
  path: "/api/subscribe",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
