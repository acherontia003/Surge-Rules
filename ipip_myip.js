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

function extractIp(value) {
  const text = String(value || "");
  const ipv4 = text.match(/(?:\d{1,3}\.){3}\d{1,3}/);
  if (ipv4) return ipv4[0];

  const ipv6 = text.match(/(?:[a-fA-F0-9]{0,4}:){2,}[a-fA-F0-9]{0,4}/);
  return ipv6 ? ipv6[0] : "";
}

function finish(result) {
  $done({
    title: result.title,
    content: result.content,
    style: result.style || "info",
    icon: result.icon || "network",
    "icon-color": result.iconColor || "#3D8BFF",
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
      "User-Agent": "Surge IPIP MyIP Panel",
    },
  },
  function (error, response, data) {
    if (error) {
      finish({
        title: "IPIP MyIP",
        content: `Query failed\nPolicy: ${policy}\n${String(error)}`,
        style: "error",
        icon: "wifi.exclamationmark",
        iconColor: "#FF453A",
      });
      return;
    }

    const text = cleanText(data);
    const ip = extractIp(text);
    const status = response && response.status ? `HTTP ${response.status}` : "HTTP OK";

    finish({
      title: ip ? `IPIP MyIP: ${ip}` : "IPIP MyIP",
      content: `${text || "No response"}\nPolicy: ${policy} / ${status}`,
      style: "info",
    });
  }
);
