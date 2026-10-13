/// <reference path="./kino.d.ts" />

const EPISODE_URL =
  "https://www.canlidizi14.net/baskalarinin-hayati-1-bolum-izle.html";

const PLAYER_URL =
  "https://canliplayer.com/fireplayer/video/8b3727a35276726e2c33f18011523ad9";

const VIDEO_HASH = "8b3727a35276726e2c33f18011523ad9";

export async function search(query) {
  const text = String(query.q || "").trim().toLowerCase();

  if (!text) return [];

  const matches =
    text.includes("baskalar") ||
    text.includes("başkalar") ||
    text.includes("hayat") ||
    text.includes("prueba");

  if (!matches) return [];

  return [{
    id: "canlidizi-baskalarinin-hayati-1",
    ref: EPISODE_URL,
    title: "Başkalarının Hayatı — Capítulo 1 (prueba)",
    kind: "movie",
    overview: "Prueba de reproducción de un capítulo."
  }];
}

export async function resolve(ref) {
  if (ref !== EPISODE_URL) {
    throw kino.error("notfound", "Referencia desconocida");
  }

  const response = await kino.fetch(
    PLAYER_URL + "?do=getVideo",
    {
      method: "POST",
      body: {
        form: {
          hash: VIDEO_HASH,
          r: "https://www.canlidizi14.net/",
          s: ""
        }
      }
    }
  );

  if (!response.ok) {
    throw kino.error(
      "unavailable",
      "El servidor respondió con HTTP " + response.status
    );
  }

  let data;

  try {
    data = await response.json();
  } catch (_) {
    throw kino.error(
      "unavailable",
      "El servidor no devolvió una respuesta JSON válida"
    );
  }

  const sources = Array.isArray(data.videoSources)
    ? data.videoSources
    : [];

  const source = sources.find((item) =>
    item &&
    typeof item.file === "string" &&
    item.file.startsWith("https://video.twimg.com/")
  );

  if (!source) {
    throw kino.error(
      "unavailable",
      "No se encontró una fuente compatible en esta prueba"
    );
  }

  return {
    url: source.file,
    mime: "application/vnd.apple.mpegurl"
  };
}
