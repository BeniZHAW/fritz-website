export const SITE = {
  name: 'FRITZ',
  title: 'FRITZ – Das Paprika-Gewürz aus Muri',
  description:
    'FRITZ: das Allrounder-Paprikagewürz aus Muri AG. Natürliche Zutaten, keine künstlichen Zusatzstoffe, von Hand abgefüllt in der Dose fürs Leben. Jetzt online bestellen.',
  email: 'hoi@pommes-fritz.ch',
  location: 'CH-5630 Muri AG',
  orderAnchor: '/#bestellen',
} as const;

export const NAV = [
  { href: '/unsere-geschichte', label: 'Unsere Geschichte' },
  { href: '/rezepte', label: 'Rezepte' },
  { href: '/verkaufsstellen', label: 'Verkaufsstellen' },
] as const;

export const LEGAL_NAV = [{ href: '/impressum', label: 'Impressum & Datenschutz' }] as const;
