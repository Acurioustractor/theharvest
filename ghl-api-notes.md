# Go High Level API Integration Notes

## Create Contact Endpoint

**URL:** `POST https://services.leadconnectorhq.com/contacts/`

**Authentication:**
- Bearer Token (OAuth Access Token or Private Integration Token)
- Token Type: Sub-Account Token
- Scope required: `contacts.write`

**Required Headers:**
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <TOKEN>`
- `Version: 2021-07-28`

**Required Body Fields:**
- `locationId` (string, required) - The GHL sub-account/location ID
- `email` (string, nullable) - Contact's email address

**Optional Fields:**
- `firstName` (string)
- `lastName` (string)
- `name` (string)
- `phone` (string)
- `tags` (string array)
- `source` (string) - e.g., "website newsletter"
- `customFields` (array of objects)

## Example Request

```bash
curl -L 'https://services.leadconnectorhq.com/contacts/' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Version: 2021-07-28' \
  --data-raw '{
    "email": "subscriber@example.com",
    "locationId": "ve9EPM428h8vShlRW1KT",
    "source": "website newsletter",
    "tags": ["newsletter"]
  }'
```

## Required Credentials from User

1. **GHL_API_KEY** - Private Integration Token from Go High Level
2. **GHL_LOCATION_ID** - The sub-account/location ID where contacts should be created
