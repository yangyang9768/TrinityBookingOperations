const puppeteer = require('puppeteer');
// import EventPage from './src/eventbrite-rpa/views/EventPage';

let events = `135168234829
135168236835
135168238841
135168240847
135168242853
135168244859
135168246865
135168351177
135168353183
135168355189
135168357195
135168359201
135168361207
135168363213
135168365219
135168367225
135168369231
135168371237
135168373243
135168375249
135168485579
135168487585
135168489591
135168491597
135168493603
135168495609
135168497615
135168499621
135168501627
`.split("\n");


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true, args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
    });
    const page = await browser.newPage();

    // login
    await page.goto("https://www.eventbrite.ie/signin/");
    await page.waitForSelector("#email");
    await page.type('#email', 'xuch@tcd.ie');
    await Promise.all([
        page.waitForNavigation(),
        page.click("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div > div > div:nth-child(2) > form > div:nth-child(2) > button")
    ]);
    await page.waitForSelector("#password");
    await page.type('#password', 'GSUbooking2020');
    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div > div > div.eds-fx--fade-in.eds-fx--delay-2 > form > div.eds-fx--fade-in-down.eds-fx--delay-1.eds-l-mar-top-6 > button")
    ]);

    for (eventId of events.slice(0)) {
        console.log(`Refunding tickets for https://www.eventbrite.ie/manage/events/${eventId}/refund_process ...`);
        await page.goto(`https://www.eventbrite.ie/manage/events/${eventId}/refund_process`);

        // not all events need refund, skip the ones without sold tickets
        var noRefundNeeded = false;
        await page.waitForSelector("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > section > div > div > section > section > div > div:nth-child(1) > div > div > div.eds-g-cell.eds-g-cell-5-12.eds-g-cell-md-3-12 > div > label:nth-child(3) > span > span", { visible: true }).catch(() => { noRefundNeeded = true; });
        if (noRefundNeeded) continue;

        await page.click("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > section > div > div > section > section > div > div:nth-child(1) > div > div > div.eds-g-cell.eds-g-cell-5-12.eds-g-cell-md-3-12 > div > label:nth-child(3) > span > span");
        await page.waitForSelector("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__bar > div > div > div > button.eds-btn.eds-btn--submit.eds-btn--fill.eds-show-up-sw", { visible: true });
        await page.click("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__bar > div > div > div > button.eds-btn.eds-btn--submit.eds-btn--fill.eds-show-up-sw");
        await page.waitForSelector("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > section > div > div > section > div:nth-child(5) > div > div > div.eds-collapsible-pane-layout > div > div > main > div > div > div.eds-dialog__button-bar.eds-align--center.eds-dialog__button-bar--with-title > div.eds-dialog__primary-button > button", { visible: true });
        await Promise.all([
            page.waitForNavigation(),
            page.click("#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > section > div > div > section > div:nth-child(5) > div > div > div.eds-collapsible-pane-layout > div > div > main > div > div > div.eds-dialog__button-bar.eds-align--center.eds-dialog__button-bar--with-title > div.eds-dialog__primary-button > button")
        ]);
        console.log(`Refunded ${eventId} !`);
        // await delay(3000);
    }

    await browser.close();
})();