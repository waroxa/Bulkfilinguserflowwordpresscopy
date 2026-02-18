# Fetch HighLevel Custom Field IDs

## Run this command to get the custom field IDs:

```cmd
curl -X GET "https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields" -H "Accept: application/json" -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" -H "Version: 2021-07-28"
```

## Expected Response Format:

```json
{
  "customFields": [
    {
      "id": "abc123def456",
      "name": "Account Status",
      "key": "account_status",
      "type": "MULTIPLE_OPTIONS"
    },
    {
      "id": "ghi789jkl012",
      "name": "Account Type",
      "key": "account_type",
      "type": "TEXT"
    }
  ]
}
```

## Custom Fields We Need IDs For:

1. **account_status** → ID: `_____________`
2. **account_type** → ID: `_____________`
3. **professional_type** → ID: `_____________`
4. **sms_consent** → ID: `_____________`
5. **email_marketing_consent** → ID: `_____________`
6. **firm_profile_completed** → ID: `_____________`

## Next Steps:

Once you have the IDs, provide them and I'll update the code to use:
- `customFields` (plural) for both POST and PUT
- Include `id`, `key`, and `field_value` for each field
- Use actual booleans (not strings) for boolean fields
