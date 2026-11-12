/** Basis-Pfad: leer auf pommes-fritz.ch, "/fritz-website" auf der GitHub-Pages-Vorschau. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Interne Links immer hierueber bauen, damit sie auch in der Vorschau stimmen. */
export const withBase = (path: string): string => (path === '/' ? BASE || '/' : `${BASE}${path}`);

export const SITE = {
  name: 'FRITZ',
  title: 'FRITZ – Das Paprika-Gewürz aus Muri',
  description:
    'FRITZ: das Allrounder-Paprikagewürz aus Muri AG. Natürliche Zutaten, keine künstlichen Zusatzstoffe, von Hand abgefüllt in der Dose fürs Leben. Jetzt online bestellen.',
  email: 'hoi@pommes-fritz.ch',
  location: 'CH-5630 Muri AG',
  orderAnchor: withBase('/#bestellen'),
} as const;

export const NAV = [
  { href: withBase('/unsere-geschichte'), label: 'Unsere Geschichte' },
  { href: withBase('/rezepte'), label: 'Rezepte' },
  { href: withBase('/verkaufsstellen'), label: 'Verkaufsstellen' },
] as const;

export const LEGAL_NAV = [{ href: withBase('/impressum'), label: 'Impressum & Datenschutz' }] as const;
