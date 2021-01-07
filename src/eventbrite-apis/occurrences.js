const getAvailability = (() => {
    if (typeof require !== 'undefined') XLSX = require('xlsx');
    let workbook = XLSX.readFile('slots.xlsx');
    let slotsSheet = workbook.Sheets[workbook.SheetNames[0]];
    let rawSlotsData = XLSX.utils.sheet_to_json(slotsSheet);
    const dayMap = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

    var availabilityMap = {};
    let currentDay = null;
    for (const slotAvailability of rawSlotsData) {
        if ('day' in slotAvailability) currentDay = dayMap.indexOf(slotAvailability.day);
        let startHours = slotAvailability.time.split(':')[0];
        let slotId = `${currentDay}-${startHours}`;
        delete slotAvailability.day;
        delete slotAvailability.time;
        availabilityMap[slotId] = slotAvailability;
    }

    return (startLocalDateTime) => {
        startLocalDateTime = new Date(startLocalDateTime);
        let slotId = `${startLocalDateTime.getDay()}-${startLocalDateTime.getHours()}`;
        return Object.assign({}, availabilityMap[slotId]); // copy to a new oject to protect the availability map
    };
})();


const eventbrite = require('eventbrite').default;

// Create configured Eventbrite SDK
const sdk = eventbrite({ token: 'YFXTNH2VGRDTXULP7GKW' });

const filterEventFields = ({ id, url, start }) => { let startLocal = start.local; let availability = getAvailability(startLocal); return { id, url, startLocal, availability }; };

// See: https://www.eventbrite.com/platform/api#/reference/event/list/list-events-by-series
sdk.request('/series/124271500403/events/?time_filter=current_future&order_by=start_asc')
    .then(res => res.events.map(filterEventFields))
    .then(events => console.log(events))
    .catch(error => console.log(error));
