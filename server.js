const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4174);
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "POST" && url.pathname === "/api/improve-logbook") {
      await handleImproveLogbook(request, response);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      sendJson(response, 405, { error: "Methode niet toegestaan." });
      return;
    }

    serveStaticFile(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: "Serverfout." });
  }
});

async function handleImproveLogbook(request, response) {
  if (!openAiApiKey) {
    sendJson(response, 503, { error: "OPENAI_API_KEY ontbreekt." });
    return;
  }

  const body = await readJsonBody(request);
  const text = String(body.text || "").trim();
  if (!text) {
    sendJson(response, 400, { error: "Geen tekst ontvangen." });
    return;
  }

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "Je verbetert Nederlands logboektekst voor een formele mentormap.",
                "Prioriteit: spelling, grammatica en interpunctie 100% corrigeren.",
                "Zinsconstructie maximaal 60% verbeteren: maak kromme zinnen leesbaarder, maar herschrijf niet onnodig.",
                "Behoud alle concrete informatie exact: routes, lijnen, namen, fouten, observaties, tijden en volgorde.",
                "Laat geen inhoud weg, vat niets samen en voeg geen feiten, oordeel of details toe.",
                "Behoud zoveel mogelijk de eigen woordkeuze van de mentor.",
                "Schrijf zakelijk, kort en rapportwaardig, zonder literaire stijl.",
                "Geef alleen de verbeterde tekst terug.",
              ].join(" "),
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text }],
        },
      ],
      temperature: 0.2,
      max_output_tokens: 350,
    }),
  });

  const data = await openAiResponse.json();
  if (!openAiResponse.ok) {
    sendJson(response, openAiResponse.status, { error: data.error?.message || "OpenAI-aanvraag mislukt." });
    return;
  }

  sendJson(response, 200, { text: extractResponseText(data) });
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10000) {
        request.destroy();
        reject(new Error("Body te groot."));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function serveStaticFile(pathname, response) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(rootDir, cleanPath));

  if (!filePath.startsWith(rootDir)) {
    sendJson(response, 403, { error: "Niet toegestaan." });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, 404, { error: "Niet gevonden." });
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

server.listen(port, "127.0.0.1", () => {
  console.log(`Mentormap server draait op http://127.0.0.1:${port}`);
});
