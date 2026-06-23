# OpenAI logboekverbetering

De knop `Spelling` gebruikt OpenAI alleen als de site via `server.js` draait.
Zet je API-sleutel nooit in `index.html` of `script.js`.

Starten:

```bash
cd /Users/theunvangiffen/Desktop/lijnvverkenning
export OPENAI_API_KEY="jouw_openai_api_sleutel"
node server.js
```

Open daarna:

```text
http://127.0.0.1:4174/index.html
```

Als OpenAI niet bereikbaar is of als de site via `file://` wordt geopend, gebruikt de knop automatisch de lokale spellingcorrectie.
