import App from '../App.svelte';

const el = document.createElement('div');
let app;

beforeAll(() => {
	app = new App({ target: el, store });
});

test('expect test to run', () => {
	expect(true).toBe(true);
});