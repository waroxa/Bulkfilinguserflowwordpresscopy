# Console Logs Reference - GoHighLevel Integration

## 🔍 What to Look For When Testing

When a firm submits an order, you should see these console messages in order:

---

## ✅ **Successful Sync (Happy Path)**

```
🚀 Starting GoHighLevel contact sync...

📇 Creating firm contact in GoHighLevel: Smith & Associates CPA

✅ Firm contact created: 6vN8kHGpJ3xY2dQwZmLp

📇 Creating 3 client contacts for firm: Smith & Associates CPA

📇 Creating client contact: ABC Holdings LLC
✅ Client contact created: a9B7mKpL4jX3eR5vYnMq

📇 Creating client contact: XYZ Enterprises LLC
✅ Client contact created: b2C8nLqM5kY4fS6wZoNr

📇 Creating client contact: DEF Corporation LLC
✅ Client contact created: c3D9oMrN6lZ5gT7xApOs

✅ Created 3/3 client contacts

📧 Sending order confirmation to firm: Smith & Associates CPA
✅ Order confirmation sent successfully

✅ GoHighLevel sync complete!
```

**What this means:**
- ✅ Integration is working perfectly
- ✅ All contacts created in GoHighLevel
- ✅ Email workflow will be triggered
- ✅ Order fully processed

---

## ❌ **Common Errors & What They Mean**

### **Error 1: Invalid API Key**
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
❌ Failed to create firm contact: 401 Unauthorized
❌ Error syncing to GoHighLevel: Failed to create firm contact: 401
```

**Cause:** API key is invalid or expired

**Fix:**
1. Check `/utils/highlevelContacts.ts`
2. Verify `HIGHLEVEL_API_KEY` is correct
3. Check GoHighLevel dashboard → Settings → API
4. Generate new key if needed

---

### **Error 2: Network/Connection Issue**
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
❌ Failed to create firm contact: Failed to fetch
❌ Error syncing to GoHighLevel: TypeError: Failed to fetch
```

**Cause:** Network connection issue or API endpoint down

**Fix:**
1. Check internet connection
2. Verify GoHighLevel API is online: `https://services.leadconnectorhq.com/`
3. Check CORS settings
4. Try again in a few minutes

---

### **Error 3: Rate Limit Exceeded**
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
✅ Firm contact created: 6vN8kHGpJ3xY2dQwZmLp
📇 Creating 50 client contacts for firm: Large Firm LLC
📇 Creating client contact: LLC 1
✅ Client contact created: d4E0pNsO7mA6hU8yBqPt
📇 Creating client contact: LLC 2
✅ Client contact created: e5F1qOtP8nB7iV9zCrQu
...
📇 Creating client contact: LLC 45
❌ Failed to create client contact for LLC 45: 429 Too Many Requests
❌ Failed to create client contact for LLC 46: 429 Too Many Requests
...
✅ Created 44/50 client contacts
```

**Cause:** Too many API requests too quickly (rate limiting)

**Fix:**
1. This is expected for very large orders (50+ clients)
2. Sync will create as many as possible
3. Failed contacts can be retried manually
4. Consider increasing delay in `/utils/highlevelContacts.ts` from 100ms to 200ms

---

### **Error 4: Invalid Location ID**
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
❌ Failed to create firm contact: 404 Not Found
❌ Error syncing to GoHighLevel: Failed to create firm contact: 404
```

**Cause:** `HIGHLEVEL_LOCATION_ID` is incorrect

**Fix:**
1. Check `/utils/highlevelContacts.ts`
2. Verify `HIGHLEVEL_LOCATION_ID = "fXXJzwVf8OtANDf2M4VP"`
3. Check GoHighLevel dashboard → Settings → Business Profile
4. Copy correct location ID

---

### **Error 5: Missing Required Field**
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
❌ Failed to create firm contact: 400 Bad Request - Missing required field: email
❌ Error syncing to GoHighLevel: Failed to create firm contact: 400
```

**Cause:** Required data missing from wizard

**Fix:**
1. Check firm profile has email address
2. Verify all required fields in wizard
3. Add fallback values in `/utils/highlevelContacts.ts`

---

## 🔍 **Partial Success (Some Clients Failed)**

```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
✅ Firm contact created: 6vN8kHGpJ3xY2dQwZmLp
📇 Creating 5 client contacts for firm: Smith & Associates CPA
📇 Creating client contact: ABC Holdings LLC
✅ Client contact created: a9B7mKpL4jX3eR5vYnMq
📇 Creating client contact: XYZ Enterprises LLC
❌ Failed to create contact for XYZ Enterprises LLC: Network error
📇 Creating client contact: DEF Corporation LLC
✅ Client contact created: c3D9oMrN6lZ5gT7xApOs
📇 Creating client contact: GHI Industries LLC
✅ Client contact created: f6G2rPuQ9oC8jW0aDsSv
📇 Creating client contact: JKL Partners LLC
✅ Client contact created: g7H3sQvR0pD9kX1bEtTw
✅ Created 4/5 client contacts
📧 Sending order confirmation to firm: Smith & Associates CPA
✅ Order confirmation sent successfully
✅ GoHighLevel sync complete!
```

**What this means:**
- ✅ Firm contact created
- ⚠️ 1 client failed (XYZ Enterprises LLC)
- ✅ 4 clients created successfully
- ✅ Order confirmation sent

**Action:**
- Order is complete for user
- Manually retry failed client in GoHighLevel
- Check why that specific client failed (network, data issue, etc.)

---

## 🧪 **Test Scenarios**

### **Test 1: Single Client Order**
Expected logs:
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Test Firm
✅ Firm contact created: [id]
📇 Creating 1 client contacts for firm: Test Firm
📇 Creating client contact: Test LLC
✅ Client contact created: [id]
✅ Created 1/1 client contacts
📧 Sending order confirmation to firm: Test Firm
✅ Order confirmation sent successfully
✅ GoHighLevel sync complete!
```

---

### **Test 2: Large Batch Order (50 clients)**
Expected logs:
```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Large Firm
✅ Firm contact created: [id]
📇 Creating 50 client contacts for firm: Large Firm
📇 Creating client contact: LLC 1
✅ Client contact created: [id]
... (repeats 50 times with 100ms delay)
✅ Created 50/50 client contacts
📧 Sending order confirmation to firm: Large Firm
✅ Order confirmation sent successfully
✅ GoHighLevel sync complete!
```

**Time estimate:** ~5-7 seconds for 50 clients

---

### **Test 3: Mixed Service Types**
Expected logs should show:
- Firm created
- Monitoring clients created (tagged: `monitoring`)
- Filing clients created (tagged: `filing`)
- All tagged with same `firm-[number]`

```
✅ Created 10/10 client contacts
```

---

## 🐛 **Debugging Tips**

### **No Logs Appearing?**
1. Check browser console is open (F12)
2. Make sure you're on Step 7 (confirmation page)
3. Verify integration is enabled (it is by default)
4. Check if `handleStep6Complete()` is being called

---

### **Logs Appear But No Contacts in GoHighLevel?**
1. Verify API key has write permissions
2. Check location ID is correct
3. Look for HTTP error codes (401, 403, 404)
4. Try creating a contact manually in GoHighLevel to test permissions

---

### **Email Not Sending?**
1. Check GoHighLevel workflow is active
2. Verify trigger field: `last_order_number`
3. Confirm firm contact has valid email
4. Check workflow history in GoHighLevel for errors
5. Look for the "✅ Order confirmation sent successfully" message

---

### **Contacts Created But Missing Tags?**
1. Check console for full payload
2. Verify tags array is populated
3. GoHighLevel may take a few seconds to index tags
4. Refresh the contacts page in GoHighLevel

---

## 📊 **Performance Benchmarks**

| Order Size | Expected Sync Time | Console Messages |
|-----------|-------------------|------------------|
| 1 client | ~1 second | 8 lines |
| 5 clients | ~2 seconds | 18 lines |
| 10 clients | ~3 seconds | 33 lines |
| 25 clients | ~5 seconds | 78 lines |
| 50 clients | ~7 seconds | 153 lines |
| 100 clients | ~12 seconds | 303 lines |

---

## 🎯 **What Success Looks Like**

After a successful order:

1. **Console shows:**
   - ✅ All green checkmarks
   - No ❌ error messages
   - "GoHighLevel sync complete!" at the end

2. **GoHighLevel shows:**
   - New firm contact (or updated existing)
   - New client contacts for each LLC
   - Correct tags on all contacts
   - Custom fields populated

3. **User receives:**
   - Confirmation email (if workflow is set up)
   - Order number and details

---

## 🔔 **Important Notes**

### **User Experience:**
- User sees confirmation page IMMEDIATELY
- Sync happens in background (non-blocking)
- Errors don't prevent order completion
- User doesn't see CRM errors (only logged)

### **Error Handling:**
- All errors are caught and logged
- User workflow is never interrupted
- Failed syncs can be retried manually
- Console provides full error details for debugging

### **Rate Limiting:**
- 100ms delay between client creations
- Prevents hitting API limits
- Can be increased if needed
- GoHighLevel limits: ~100 requests/minute

---

## ✅ Checklist for Testing

- [ ] Order submitted successfully
- [ ] Console shows "🚀 Starting GoHighLevel contact sync..."
- [ ] Firm contact created (green checkmark)
- [ ] All client contacts created (count matches)
- [ ] Order confirmation sent (green checkmark)
- [ ] "✅ GoHighLevel sync complete!" appears
- [ ] No ❌ error messages
- [ ] Firm contact visible in GoHighLevel
- [ ] Client contacts visible in GoHighLevel
- [ ] Tags applied correctly
- [ ] Custom fields populated
- [ ] Email received (if workflow active)

---

**Last Updated:** February 3, 2026  
**For More Info:** See `/GOHIGHLEVEL_INTEGRATION.md`
