# AI Context - FRITZ Webseite

Öffentliche Webseite von FRITZ (Paprikagewürz aus Muri AG). Befehle und Aufbau in `README.md`.
Das Konzept liegt als Claude-Doc: https://claude.ai/artifact/54zTqqKPmNmFFQY7RQC19R

## Arbeitsregeln

- UI und Texte auf Deutsch (de-CH, "ss" statt "ß"), Währung CHF. Titel kurz und frech, teils Mundart; Fliesstext Hochdeutsch, per Du.
- Der Spruch "Ohni Zwiifel" wird nicht mehr verwendet. Kein Weihnachts-/Geschenk-Marketing.
- Zutaten-Aussage nur: "Nur natürliche Zutaten. Keine künstlichen Zusatzstoffe." Keine weiteren Lebensmittel-Claims ohne Rückfrage.
- Preise und Versandregel nur in `src/config/shop.ts` ändern (Versand: genau 1 Dose = CHF 6.–, sonst gratis).
- Farben, Schriften, Abstände nur über `src/styles/tokens.css`.
- Jede Animation muss mit "Bewegung reduzieren" und ohne JavaScript eine vollständige, ruhige Seite ergeben.
- Mobile first: jede Änderung auch bei 390 px Breite prüfen.
- Platzhalter-Bilder sind mit `placeholder-badge` gekennzeichnet, bis das Shooting sie ersetzt.
- Originalbilder gehören nach `assets-src/` (nicht im Repo), Arbeitsbilder erzeugt `scripts/prepare-images.ps1`.
- Bestellungen gehen später ans FRITZ ERP (separates Repo `fritz-erp`); die Webseite schreibt nie direkt in dessen Datenbank.
- Interne Links und Dateien aus `public/` immer über `withBase()` aus `src/config/site.ts` verlinken, sonst funktioniert die Vorschau unter `/fritz-website` nicht.
- Änderungen von Mitarbeitenden laufen über Branch und Pull Request, nie direkt auf `main`.
- Nach Änderungen mindestens `npm run build` und `git diff --check`.
