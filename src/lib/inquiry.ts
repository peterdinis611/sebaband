import { isBooked, isPast } from '$lib/data/bookings';
import { eventTypes } from '$lib/data/site';

export type InquiryField =
	| 'name'
	| 'phone'
	| 'email'
	| 'eventType'
	| 'date'
	| 'place'
	| 'message';

export type InquiryValues = Record<InquiryField, string>;

export type InquiryErrors = Partial<Record<InquiryField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function digitsOnly(value: string): string {
	return value.replace(/\D/g, '');
}

/** Accepts +421…, 09xx…, 9xx… (SK mobile / landline-ish). */
export function isValidSkPhone(value: string): boolean {
	const digits = digitsOnly(value);
	if (!digits) return false;
	if (digits.startsWith('421')) return digits.length === 12;
	if (digits.startsWith('420')) return digits.length === 12; // CZ also ok
	if (digits.startsWith('0')) return digits.length === 10;
	if (digits.length === 9) return true;
	return false;
}

export function normalizePhone(value: string): string {
	const digits = digitsOnly(value);
	if (digits.startsWith('421') && digits.length === 12) {
		return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
	}
	if (digits.startsWith('0') && digits.length === 10) {
		return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
	}
	return value.trim();
}

export function isValidEmail(value: string): boolean {
	const v = value.trim();
	if (v.length < 5 || v.length > 120) return false;
	return EMAIL_RE.test(v);
}

export function isValidIsoDate(value: string): boolean {
	if (!ISO_DATE_RE.test(value)) return false;
	const [y, m, d] = value.split('-').map(Number);
	const dt = new Date(y, m - 1, d);
	return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function validateField(field: InquiryField, values: InquiryValues): string | undefined {
	const raw = values[field] ?? '';
	const value = raw.trim();

	switch (field) {
		case 'name': {
			if (!value) return 'Zadajte meno a priezvisko.';
			if (value.length < 2) return 'Meno musí mať aspoň 2 znaky.';
			if (value.length > 80) return 'Meno je príliš dlhé.';
			if (!/[\p{L}]/u.test(value)) return 'Meno musí obsahovať písmená.';
			return;
		}
		case 'phone': {
			if (!value) return 'Zadajte telefónne číslo.';
			if (!isValidSkPhone(value)) {
				return 'Zadajte platné číslo (napr. +421 911 601 868 alebo 0911 601 868).';
			}
			return;
		}
		case 'email': {
			if (!value) return 'Zadajte e-mailovú adresu.';
			if (!isValidEmail(value)) return 'Zadajte platný e-mail (napr. meno@domena.sk).';
			return;
		}
		case 'eventType': {
			if (!value) return 'Vyberte typ akcie.';
			if (!(eventTypes as readonly string[]).includes(value)) return 'Neplatný typ akcie.';
			return;
		}
		case 'date': {
			if (!value) return 'Vyberte dátum akcie (v kalendári alebo tu).';
			if (!isValidIsoDate(value)) return 'Dátum má neplatný formát.';
			if (isPast(value)) return 'Dátum nesmie byť v minulosti.';
			if (isBooked(value)) return 'Tento dátum je obsadený — vyberte iný voľný deň.';
			return;
		}
		case 'place': {
			if (!value) return 'Zadajte miesto akcie.';
			if (value.length < 2) return 'Miesto musí mať aspoň 2 znaky.';
			if (value.length > 120) return 'Miesto je príliš dlhé.';
			return;
		}
		case 'message': {
			if (!value) return;
			if (value.length < 8) return 'Správa je príliš krátka (aspoň 8 znakov).';
			if (value.length > 2000) return 'Správa je príliš dlhá (max. 2000 znakov).';
			return;
		}
	}
}

export function validateInquiry(values: InquiryValues): InquiryErrors {
	const errors: InquiryErrors = {};
	for (const field of Object.keys(values) as InquiryField[]) {
		const err = validateField(field, values);
		if (err) errors[field] = err;
	}
	return errors;
}

export function firstErrorField(errors: InquiryErrors): InquiryField | undefined {
	const order: InquiryField[] = [
		'name',
		'phone',
		'email',
		'eventType',
		'date',
		'place',
		'message'
	];
	return order.find((key) => errors[key]);
}
