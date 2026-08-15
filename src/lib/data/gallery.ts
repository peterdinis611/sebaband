export type GalleryItem = {
	src: string;
	alt: string;
	span: 'hero' | 'wide' | 'tall' | 'square';
	width: number;
	height: number;
};

export const gallery: GalleryItem[] = [
	{
		src: '/images/img-3496.jpg',
		alt: 'Členovia SEBA BAND v elegantných oblekoch pred vystúpením',
		span: 'hero',
		width: 1400,
		height: 1050
	},
	{
		src: '/images/img-3494.jpg',
		alt: 'SEBA BAND s aparatúrou a nástrojmi na sále',
		span: 'wide',
		width: 1400,
		height: 1050
	},
	{
		src: '/images/img-3497.jpg',
		alt: 'Kapela SEBA BAND spoločne pred akciou',
		span: 'tall',
		width: 1400,
		height: 1080
	},
	{
		src: '/images/hero-band.jpg',
		alt: 'Členovia kapely SEBA BAND v elegantnom čiernom oblečení',
		span: 'wide',
		width: 1400,
		height: 1050
	},
	{
		src: '/images/img-3499.jpg',
		alt: 'SEBA BAND v zákulisí pred vystúpením',
		span: 'square',
		width: 1400,
		height: 1050
	},
	{
		src: '/images/img-3486.jpg',
		alt: 'Člen SEBA BAND v čiernom obleku v štúdiu',
		span: 'square',
		width: 864,
		height: 1184
	},
	{
		src: '/images/img-3487.jpg',
		alt: 'Spevák SEBA BAND s mikrofónom',
		span: 'tall',
		width: 864,
		height: 1184
	},
	{
		src: '/images/img-3488.jpg',
		alt: 'Klávesák SEBA BAND za klávesami',
		span: 'square',
		width: 864,
		height: 1184
	},
	{
		src: '/images/img-3489.jpg',
		alt: 'Člen SEBA BAND v čiernom obleku so zlatými detailmi',
		span: 'square',
		width: 864,
		height: 1184
	},
	{
		src: '/images/img-3490.jpg',
		alt: 'Gitarista SEBA BAND s elektrickou gitarou',
		span: 'square',
		width: 864,
		height: 1184
	},
	{
		src: '/images/img-3491.jpg',
		alt: 'Basgitarista SEBA BAND s basgitarou',
		span: 'wide',
		width: 864,
		height: 1184
	}
];
