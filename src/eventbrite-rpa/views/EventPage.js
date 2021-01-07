import BaseView from './BaseView';

class EventPage extends BaseView {

    constructor(page, eventId) {
        super(page);
        this.eventId = eventId;
    }

    async getVenueAvailability() {
        await this.clickSelector(`#eventbrite-widget-modal-trigger-${this.eventId}`).catch(console.log);
        await this.page.waitForSelector('iframe');
        let frames = await this.page.frames();
        let venuesFrame = fa
        await venuesFrame.waitForSelector('ul.eds-card-list', {
            timeout: 30000
        });
        // compute whether each venue is sold-out or not
        return await venuesFrame.evaluate(() => Array.from(document.querySelectorAll('.eds-card-list__item')).map(venue => ({ name: venue.querySelector('h3').innerText, isSoldOut: venue.querySelector('span.ticket-status.eds-text-color--ui-600.eds-text-bm.ticket-status--no-wrap.eds-text--right') != null })));
    }
}

export default EventPage;
