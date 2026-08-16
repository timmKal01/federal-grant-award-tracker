import { Actor, log } from 'apify';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { keyword, agency, recipientState, minAwardAmount, daysBack = 30, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const GRANT_SEARCH_EVENT = 'grant-search';

const API_URL = 'https://api.usaspending.gov/api/v2/search/spending_by_award/';

function isoDate(d) {
    return d.toISOString().slice(0, 10);
}

const endDate = new Date();
const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

const filters = {
    // 02=block grant, 03=formula grant, 04=project grant, 05=cooperative agreement
    award_type_codes: ['02', '03', '04', '05'],
    time_period: [{ start_date: isoDate(startDate), end_date: isoDate(endDate) }],
};

if (keyword) filters.keywords = [keyword];
if (agency) filters.agencies = [{ type: 'awarding', tier: 'toptier', name: agency }];
if (recipientState) filters.recipient_locations = [{ country: 'USA', state: recipientState.toUpperCase() }];
if (minAwardAmount) filters.award_amounts = [{ lower_bound: minAwardAmount }];

const requestBody = {
    filters,
    fields: [
        'Award ID',
        'Recipient Name',
        'Start Date',
        'End Date',
        'Award Amount',
        'Awarding Agency',
        'Awarding Sub Agency',
        'Award Type',
        'Description',
        'generated_internal_id',
    ],
    page: 1,
    limit: Math.min(maxResults, 100),
    sort: 'Award Amount',
    order: 'desc',
};

log.info('Searching USAspending.gov for grant awards', { filters });

const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
});

if (!res.ok) {
    throw new Error(`USAspending.gov API request failed: ${res.status} ${res.statusText}`);
}

const data = await res.json();
const results = data.results ?? [];

for (const award of results) {
    await Actor.pushData({
        awardId: award['Award ID'],
        recipientName: award['Recipient Name'],
        awardAmount: award['Award Amount'],
        awardingAgency: award['Awarding Agency'],
        awardingSubAgency: award['Awarding Sub Agency'],
        awardType: award['Award Type'],
        description: award.Description,
        startDate: award['Start Date'],
        endDate: award['End Date'],
        usaspendingUrl: award.generated_internal_id
            ? `https://www.usaspending.gov/award/${award.generated_internal_id}`
            : null,
    });
}

await Actor.charge({ eventName: GRANT_SEARCH_EVENT });

log.info(`Found ${results.length} grant award(s)`, {
    dateRange: `${isoDate(startDate)} to ${isoDate(endDate)}`,
});

await Actor.exit();
