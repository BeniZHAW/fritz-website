# FRITZ Webseite

Neue Webseite für FRITZ, das Allrounder-Paprikagewürz aus Muri AG.
Stand: Prototyp auf localhost. Die bestehende Seite pommes-fritz.ch bleibt bis zum Livegang unverändert.

Konzept (Struktur, Bilder, Fahrplan): https://claude.ai/artifact/54zTqqKPmNmFFQY7RQC19R

## Stack

- [Astro](https://astro.build) 7 + TypeScript, statische Seiten
- [GSAP](https://gsap.com) ScrollTrigger für die Scroll-Animationen
- Bilder über `astro:assets` (automatisch AVIF/WebP in mehreren Grössen)

## Lokal starten

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Typprüfung + Build nach dist/
npm run preview    # Build lokal ansehen
```

## Vorschau

Jeder Push auf `main` baut die Vorschau automatisch und stellt sie auf GitHub Pages:
https://benizhaw.github.io/fritz-website/

Die Vorschau ist öffentlich, aber für Suchmaschinen gesperrt (`noindex`). Bestellungen werden dort nicht gesendet.
Lokal nachbauen: `PUBLIC_PREVIEW=true npm run build && npm run preview`.

## Mitarbeiten

1. Repo klonen, `npm install`, `npm run dev`. Wer mit Claude Code arbeitet: Die Regeln stehen in `CLAUDE.md`.
2. Nie direkt auf `main` arbeiten: eigenen Branch erstellen und einen Pull Request öffnen.
3. Beni prüft den Pull Request und führt ihn zusammen. Erst dann geht die Änderung in die Vorschau.

## Aufbau

```text
src/
  config/shop.ts        Produkte, Preise, Versandregel (einzige Quelle)
  config/site.ts        Navigation, Kontakt
  styles/tokens.css     Design-Tokens (Farben, Schrift, Abstände)
  layouts/              Grundlayout mit Header, Footer, Bestell-Leiste
  components/           Header, Footer, Toast, Seitentitel
  components/home/      Abschnitte der Startseite
  scripts/cart.ts       Warenkorb (localStorage + Events)
  scripts/order-api.ts  Übergabe der Bestellung ans ERP
  scripts/home-animations.ts  Scroll-Animationen
  pages/                Startseite, Unsere Geschichte, Rezepte, Verkaufsstellen, Impressum
scripts/prepare-images.ps1  erzeugt Arbeitsbilder aus den Originalen
```

## Bilder

Originale (bis 50 MB) liegen in `assets-src/` und sind **nicht** im Repo.
`npm run images` schneidet daraus die Arbeitsbilder in `src/assets/images/` zu.
Bilder mit dem Hinweis "Platzhalter" werden durch das Shooting ersetzt (Liste im Konzept).

## Bestellungen

Ohne `PUBLIC_ORDER_API_URL` (siehe `.env.example`) läuft der Prototyp-Modus:
Die Bestellung wird geprüft und angezeigt, aber nicht gesendet.
Später sendet das Formular an eine öffentliche Schnittstelle im FRITZ ERP, die Preise und Versand selbst nachrechnet,
Kunde und Bestellung anlegt und die Bestätigung mit TWINT-Link verschickt.
