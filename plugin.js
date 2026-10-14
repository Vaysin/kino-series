/// <reference path="./kino.d.ts" />

const EPISODE_URL =
  "https://www.canlidizi14.net/baskalarinin-hayati-1-bolum-izle.html";

export async function search(query) {
  const text = String(query.q || "").trim().toLowerCase();

  if (!text) return [];

  const matches =
    text.includes("baskalar") ||
    text.includes("başkalar") ||
    text.includes("hayat") ||
    text.includes("prueba");

  if (!matches) return [];

  return [
    {
      id: "canlidizi-baskalarinin-hayati-1",
      ref: EPISODE_URL,
      title: "Başkalarının Hayatı — Capítulo 1 (prueba)",
      kind: "movie",
      overview: "Prueba de reproducción de un capítulo."
    }
  ];
}

export async function resolve(ref) {
  if (ref !== EPISODE_URL) {
    throw kino.error("notfound", "Referencia desconocida");
  }

  kino.log("Iniciando captura del reproductor");

  const captured = await kino.browser.capture(EPISODE_URL, {
    timeoutMs: 18000,
    autoplay: true,
    match: "\\.m3u8(?:\\?|$)"
  });

  const mediaList = Array.isArray(captured.media)
    ? captured.media
    : [];

  kino.log("Fuentes detectadas:", mediaList.length);

  const source = mediaList.find((item) =>
    item &&
    typeof item.url === "string" &&
    item.url.startsWith("https://video.twimg.com/")
  );

  if (!source) {
    throw kino.error(
      "unavailable",
      "No se detecto una fuente compatible"
    );
  }

  const headers = { ...(source.headers || {}) };

  delete headers.Origin;
  delete headers.Referer;
  delete headers.origin;
  delete headers.referer;

  kino.log(
    "Enviando cabeceras:",
    Object.keys(headers).join(", ") || "(ninguna)"
  );

  return {
    url: source.url,
    mime: source.mime || "application/vnd.apple.mpegurl",
    headers
  };
}