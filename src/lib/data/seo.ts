import { site } from '$lib/data/site';

/** Primary search phrases — used in meta keywords, JSON-LD and page copy. */
export const seoKeywords = [
	'SEBA BAND',
	'Seba Band',
	'rómska kapela',
	'rómska live kapela',
	'live kapela',
	'živá hudba',
	'kapela na svadbu',
	'kapela na svadbu Slovensko',
	'svadobná kapela',
	'svadobná hudba',
	'kapela na ples',
	'plesová kapela',
	'kapela na oslavu',
	'kapela na zábavu',
	'obecná zábava kapela',
	'kapela na festival',
	'kapela na firemnú akciu',
	'firemná kapela',
	'živá hudba na svadbu',
	'živá kapela Slovensko',
	'wedding band Slovakia',
	'roma band',
	'gypsy band Slovakia',
	'východniarsky štýl',
	'pavlovský štýl',
	'ľudovky naživo',
	'rock kapela na svadbu',
	'moderné hity naživo',
	'kapela s technikou',
	'vlastná zvuková technika',
	'svetelná technika kapela',
	'moderovanie svadby',
	'kapela Košice',
	'kapela Prešov',
	'kapela východné Slovensko',
	'kapela Bratislava',
	'kapela Česko',
	'kapela zahraničie',
	'rezervácia kapely',
	'cena kapely na svadbu',
	'najlepšia kapela na svadbu',
	'plný parket',
	'živá zábava',
	'music group Slovakia'
] as const;

export const seo = {
	locale: 'sk_SK',
	localeAlt: ['cs_CZ', 'en_US'],
	ogImage: '/images/hero-band.webp',
	ogImageAlt: 'Členovia kapely SEBA BAND — rómska live kapela',
	twitterCard: 'summary_large_image' as const,
	keywords: seoKeywords.join(', '),
	organization: {
		'@type': 'MusicGroup' as const,
		name: site.name,
		alternateName: ['Seba Band', 'SEBA Band', 'Sebaband'],
		url: site.url,
		logo: `${site.url}/images/logo.webp`,
		image: `${site.url}/images/hero-band.webp`,
		description: site.description,
		foundingDate: String(site.founded),
		email: site.email,
		telephone: site.phone,
		genre: [
			'Rómska hudba',
			'Live wedding band',
			'Svadobná kapela',
			'Ľudová hudba',
			'Rock',
			'Pop',
			'Party band'
		],
		numberOfEmployees: site.members,
		areaServed: [
			{ '@type': 'Country', name: 'Slovakia' },
			{ '@type': 'Country', name: 'Czech Republic' },
			{ '@type': 'Continent', name: 'Europe' },
			'Košice',
			'Prešov',
			'Bratislava',
			'Žilina',
			'Banská Bystrica',
			'Nitra',
			'Trnava',
			'Trenčín'
		],
		knowsAbout: [...seoKeywords.slice(0, 24)],
		sameAs: [site.facebook, site.tiktok, site.youtube],
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: site.phone,
			contactType: 'reservations',
			availableLanguage: ['Slovak', 'Czech', 'English'],
			areaServed: ['SK', 'CZ', 'EU']
		}
	}
} as const;

export type PageSeo = {
	title: string;
	description: string;
	keywords?: string;
	path: string;
};

export const pages: Record<string, PageSeo> = {
	home: {
		path: '/',
		title: 'SEBA BAND — Kapela na svadbu, ples a oslavu | Rómska live kapela',
		description:
			'SEBA BAND — rómska live kapela na svadby, plesy, oslavy, zábavy, festivaly a firemné akcie. Živá hudba, vlastná technika a moderovanie. Slovensko aj zahraničie. Rezervujte termín.',
		keywords:
			'kapela na svadbu, rómska kapela, live kapela Slovensko, svadobná kapela, kapela na ples, živá hudba na oslavu, SEBA BAND'
	},
	about: {
		path: '/o-nas',
		title: 'O nás — SEBA BAND | Rómska live kapela, 6 členov',
		description:
			'Poznajte SEBA BAND: 6 členov, bratia a bratranci, východniarsky a pavlovský štýl, ľudovky, rock aj moderné hity. Kapela s vlastnou technikou na svadby a plesy.',
		keywords: 'rómska live kapela, SEBA BAND o nás, svadobná kapela Slovensko, pavlovský štýl'
	},
	gallery: {
		path: '/galeria',
		title: 'Galéria — SEBA BAND | Fotky zo svadieb, plesov a festivalov',
		description:
			'Fotogaléria SEBA BAND zo svadieb, plesov, zábav a festivalov. Pozrite si živú kapelu v akcii — plný parket, elegantný look a atmosféra naživo.',
		keywords: 'fotky kapela svadba, galéria SEBA BAND, live kapela fotky, ples kapela'
	},
	videos: {
		path: '/videa',
		title: 'Videá — SEBA BAND | Ukážky živej hudby na YouTube',
		description:
			'Videoukážky SEBA BAND zo štúdia aj z vystúpení. Počujte rómsku live kapelu, ľudovky, rock a hity — ideálne pred rezerváciou na svadbu alebo ples.',
		keywords: 'SEBA BAND videá, live kapela youtube, ukážka kapely na svadbu'
	},
	booking: {
		path: '/rezervacie',
		title: 'Rezervácie — SEBA BAND | Voľné termíny kapely na svadbu',
		description:
			'Rezervačný kalendár SEBA BAND. Overte voľný termín na svadbu, ples alebo oslavu a rezervujte telefonicky, e-mailom alebo dopytom. Kapela so zvukom a svetlami.',
		keywords: 'rezervácia kapely, termín kapela svadba, voľné termíny kapela, dopyt SEBA BAND'
	},
	contact: {
		path: '/kontakt',
		title: 'Kontakt — SEBA BAND | Telefón, e-mail, sociálne siete',
		description:
			'Kontaktujte SEBA BAND: telefón +421 911 601 868, e-mail, Facebook, TikTok a YouTube. Rýchla rezervácia živej kapely na svadbu, ples či firemnú akciu.',
		keywords: 'kontakt SEBA BAND, telefón kapela, rezervácia živej hudby'
	},
	terms: {
		path: '/rezervacne-podmienky',
		title: 'Rezervačné podmienky — SEBA BAND',
		description:
			'Rezervačné podmienky SEBA BAND: záloha, storna a výnimočné situácie pri rezervácii kapely na svadbu, ples alebo oslavu.',
		keywords: 'podmienky rezervácie kapely, záloha kapela svadba'
	}
};

export const faqLd = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: 'Je SEBA BAND vhodná kapela na svadbu?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Áno. SEBA BAND je rómska live kapela špecializovaná na svadby, plesy a oslavy. Hráme ľudovky, rock aj moderné hity, máme vlastnú zvukovú a svetelnú techniku a dbáme na plný parket.'
			}
		},
		{
			'@type': 'Question',
			name: 'Hráte aj mimo Slovenska?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Áno. Okrem Slovenska hráme aj v zahraničí, vrátane Česka a ďalších krajín EÚ. Termín a logistiku dohodneme individuálne.'
			}
		},
		{
			'@type': 'Question',
			name: 'Máte vlastnú techniku?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Áno. SEBA BAND prichádza s vlastnou zvukovou a svetelnou technikou a vie aj moderovať program akcie.'
			}
		},
		{
			'@type': 'Question',
			name: 'Ako si rezervujem termín?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Pozrite voľné termíny v rezervačnom kalendári na stránke Rezervácie, potom zavolajte na +421 911 601 868, napíšte e-mail alebo vyplňte dopyt.'
			}
		},
		{
			'@type': 'Question',
			name: 'Aký je repertoár SEBA BAND?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Repertoár zahŕňa východniarsky a pavlovský štýl, ľudovky, rock aj moderné tanečné hity — podľa programu vašej svadby, plesu alebo zábavy.'
			}
		}
	]
} as const;
