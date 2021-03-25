const puppeteer = require('puppeteer');
const sessionFactory = require('./factory/sessionFactory');
const userFactory = require('./factory/userFactory');

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();
	await page.goto('localhost:3000');
});

afterEach(async () => {
	await browser.close();
});

test('The header has the correct text', async () => {
	const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
	expect(text).toEqual('Blogster');
});

test('Clicking login starts OAuth flow', async () => {
	await page.click('.right a');
	const url = await page.url();
	expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
	// first test: using userId and the 1st function in ./tests/userFactory
	// const userId = '60564b55f0a692637f3fe2e4';
	// const { sessionString, sessionSig } = sessionFactory(userId);

	const user = await userFactory();
	const { sessionString, sessionSig } = sessionFactory(user);

	await page.setCookie({ name: 'session', value: sessionString });
	await page.setCookie({ name: 'session.sig', value: sessionSig });
	await page.goto('localhost:3000');

	await page.waitFor('a[href="/auth/logout"]');

	const logoutBtnText = await page.$eval(
		'a[href="/auth/logout"]',
		(el) => el.innerHTML
	);

	expect(logoutBtnText).toEqual('Logout');
});
