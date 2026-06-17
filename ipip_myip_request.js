const DEFAULT_POLICY = "PROXY";
const TARGET_URL = "https://myip.ipip.net";

function parseArgument() {
  const result = {};
  if (typeof $argument !== "string" || !$argument.trim()) return result;

  for (const part of $argument.split("&")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index);
    const value = part.slice(index + 1);
    result[key] = decodeURIComponent(value);
  }

  return result;
}

function cleanText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function respond(status, body) {
  $done({
    response: {
      status,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
      body,
    },
  });
}

const args = parseArgument();
const policy = args.policy || DEFAULT_POLICY;

$httpClient.get(
  {
    url: TARGET_URL,
    policy,
    timeout: 8,
    headers: {
      "User-Agent": "Surge IPIP MyIP Request",
      "Cache-Control": "no-cache",
    },
  },
  function (error, response, data) {
    if (error) {
      respond(502, `Query failed through policy: ${policy}\n${String(error)}`);
      return;
    }

    const status = response && response.status ? response.status : 200;
    const text = cleanText(data);
    respond(status, `${text || "No response"}\nPolicy: ${policy}`);
  }
);
