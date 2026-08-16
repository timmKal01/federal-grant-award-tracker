# Federal Grant Award Tracker — Who Just Got Funded

Track federal grants and cooperative agreements that have actually been
**awarded** — not open opportunities to apply for, actual money that
just went out the door. Search by keyword, agency, recipient state, or
minimum amount.

Built for grant-writing consultants doing competitive research,
journalists covering federal spending, nonprofits watching their
sector, and lobbying/advocacy teams tracking a policy area.

## Input

```json
{
  "keyword": "climate resilience",
  "agency": "",
  "recipientState": "",
  "minAwardAmount": 100000,
  "daysBack": 30,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `keyword` | string (optional) | Free-text search across grant descriptions. |
| `agency` | string (optional) | Exact top-tier awarding agency name, e.g. `"Department of Health and Human Services"`. |
| `recipientState` | string (optional) | Two-letter US state code to limit to recipients located there. |
| `minAwardAmount` | number (optional) | Only return awards at or above this dollar amount. |
| `daysBack` | number | How many days back from today to search, by award start date. Default `30`, max `365`. |
| `maxResults` | number | Max awards to return, largest amount first. Default `25`, max `100`. |

## Output

One record per award:

```json
{
  "awardId": "ZZ31152926",
  "recipientName": "ARLINGTON HISTORICAL SOCIETY, THE",
  "awardAmount": 25000.0,
  "awardingAgency": "National Endowment for the Humanities",
  "awardingSubAgency": "National Endowment for the Humanities",
  "awardType": "PROJECT GRANT (B)",
  "description": "THE BATTLE OF MENOTOMY: INTERPRETING APRIL 19, 1775 FOR AMERICA'S 250TH ANNIVERSARY...",
  "startDate": "2026-08-01",
  "endDate": "2027-02-28",
  "usaspendingUrl": "https://www.usaspending.gov/award/ASST_NON_ZZ31152926_418"
}
```

A search with no matches returns no items but is still billed once for
the search.

## How it works

Direct calls to the official [USAspending.gov
API](https://api.usaspending.gov/docs/endpoints) — no proxy, no key, no
scraping. Covers block grants, formula grants, project grants, and
cooperative agreements (award type codes 02/03/04/05).

## Pricing note

Billed per **search**, not per award returned — one charge whether the
search returns 0 awards or 100.

## Related products

- [Grant Opportunity Tracker](https://github.com/timmKal01/grant-opportunity-tracker) — new open funding opportunities from Grants.gov, the "before" to this actor's "after"
- [Federal Contract Award Tracker](https://github.com/timmKal01/federal-contract-award-tracker) — the same USAspending.gov data for contracts instead of grants
