# Bronko-Donko Website

Statische Website für das Kartenspiel **Bronko-Donko**. Deployt über GitHub Pages.

## Struktur

```
/                              Startseite
/hofregeln/                    Spielregeln (QR-Code-Ziel — URL stabil halten!)
/impressum/                    Impressum
/datenschutzerklarung/         Datenschutzerklärung
/story/                        Backgroundstory (nur Footer-Link)
/404.html                      404-Seite
/css/styles.css                Globales Stylesheet
/js/app.js                     Nav, Video-Facade (selbst gehostete MP4s), Charakter-Modals
/assets/images/                Logo, Hero-Bild, Gang-Grafiken
/assets/images/cards/          Charakter-Karten (…-staerke / …-lp)
/assets/images/cards/special/  Token-/Spezialkarten (Weste, Rückseiten, Orden, Flucht …)
/assets/videos/                Selbst gehostete MP4s (Trailer, Teaser, Charakter-Clips, Tutorial)
```

## Lokal testen

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000/ im Browser öffnen.

Wichtig: `/hofregeln/` muss mit Trailing-Slash funktionieren — der QR-Code auf der Spielverpackung verlinkt genau dorthin.

## Design

- Schwarzer Hintergrund (`#000000`)
- Silberne Schrift (`#c0c0c0`)
- Akzent-Rot (`#ed130d`)
- Akzent-Gelb (`#f2c200`)
- Headlines: Patua One · Body: Nunito (beide via Google Fonts)

Farben werden als CSS-Variablen in `:root` gepflegt — Anpassungen an einem Ort.

## Deploy

### GitHub Pages

1. GitHub → **Settings** → **Pages**
2. **Source**: `Deploy from a branch` · **Branch**: `main` · **Folder**: `/ (root)`
3. Nach 1–2 Minuten erreichbar unter `https://sebos1980-star.github.io/bronko-donko/`

### Custom Domain (bronko-donko.com)

✅ **Eingerichtet und aktiv.** Die Seite ist unter `https://www.bronko-donko.com/` erreichbar. Die DNS-Umstellung bei Ionos ist abgeschlossen, die Domain in GitHub Pages verifiziert.

Die folgende Konfiguration ist als Referenz dokumentiert (für Umzüge oder Fehlersuche):

- **Ionos DNS:**
  - `A`-Records auf GitHub-Pages-IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `CNAME` für `www` auf `sebos1980-star.github.io`
- **GitHub** → **Settings** → **Pages** → **Custom domain**: `www.bronko-donko.com` (siehe `CNAME`-Datei im Repo-Root)
- **Enforce HTTPS** ist aktiv

**Wichtig:** Keine Ionos-Weiterleitung zur GitHub-Pages-URL — `/hofregeln/` muss als Pfad erhalten bleiben (QR-Code auf der Verpackung).
