export const site = {
	name: 'SEBA BAND',
	shortName: 'SB',
	tagline: 'Hudba, ktorá spája rodinu aj ľudí',
	kicker: 'Rómska live kapela',
	description:
		'SEBA BAND je rómska live kapela na svadby, oslavy, plesy, zábavy, festivaly a firemné akcie na Slovensku aj v zahraničí. Vlastná technika, moderovanie a plný parket.',
	founded: 2023,
	members: 6,
	phone: '+421911601868',
	phoneDisplay: '+421 911 601 868',
	email: 'sebabandofficial@gmail.com',
	region: 'Slovensko aj zahraničie',
	repertoire: 'Východniarsky / Pavlovský štýl, ľudovky, rock aj moderné hity',
	facebook: 'https://www.facebook.com/share/1BkJ8YAjLw/',
	tiktok: 'https://www.tiktok.com/@seba.band.officia',
	youtube: 'https://youtube.com/@sebabandofficial-r2n9o',
	events: ['Svadby', 'Plesy', 'Oslavy', 'Zábavy', 'Festivaly', 'Firemné akcie']
} as const;

export const nav = [
	{ href: '/', label: 'Domov' },
	{ href: '/o-nas', label: 'O nás' },
	{ href: '/galeria', label: 'Galéria' },
	{ href: '/videa', label: 'Videá' },
	{ href: '/rezervacie', label: 'Rezervácie' },
	{ href: '/kontakt', label: 'Kontakt' }
] as const;

export const eventTypes = [
	'Svadba',
	'Ples',
	'Oslava',
	'Firemná akcia',
	'Festival',
	'Obecná zábava',
	'Iné'
] as const;
