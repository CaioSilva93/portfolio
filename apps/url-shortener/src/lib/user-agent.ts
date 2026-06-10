import { UAParser } from "ua-parser-js";

interface ParsedUA {
  device: string;
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string | null): ParsedUA {
  if (!ua) return { device: "unknown", browser: "unknown", os: "unknown" };

  const result = UAParser(ua);

  return {
    device: result.device.type || "desktop",
    browser: result.browser.name || "unknown",
    os: result.os.name || "unknown",
  };
}
