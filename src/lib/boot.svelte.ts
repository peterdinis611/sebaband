function initialLocked() {
	if (typeof document === 'undefined') return false;
	return document.documentElement.classList.contains('is-booting');
}

export const boot = $state({
	/** True while boot curtain plays. Analytics/preview use boot-skip → never locked. */
	locked: initialLocked()
});
