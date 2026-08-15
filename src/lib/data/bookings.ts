/** ISO dates that are already taken. Expand this list as bookings come in. */
export const bookedDates: readonly string[] = [
	'2026-08-08',
	'2026-08-14',
	'2026-08-15',
	'2026-08-21',
	'2026-08-22',
	'2026-09-05',
	'2026-09-12',
	'2026-09-19',
	'2026-10-03',
	'2026-10-17'
];

export const monthNames = [
	'január',
	'február',
	'marec',
	'apríl',
	'máj',
	'jún',
	'júl',
	'august',
	'september',
	'október',
	'november',
	'december'
] as const;

export const weekdayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;

export function toIso(year: number, monthIndex: number, day: number): string {
	return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatSlovakDate(iso: string): string {
	const [y, m, d] = iso.split('-').map(Number);
	return `${d}. ${monthNames[m - 1]} ${y}`;
}

export function isBooked(iso: string): boolean {
	return bookedDates.includes(iso);
}

export function isPast(iso: string, today = new Date()): boolean {
	const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, m - 1, d) < start;
}
