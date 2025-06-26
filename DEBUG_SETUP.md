# PDF Parser Debug Console Setup

## 🔍 **What You Now Have:**

The PDF parser now captures detailed debug information including:
- ✅ **All parsing steps** with timestamps
- ✅ **Section detection results**
- ✅ **Amount extraction attempts**
- ✅ **Full extracted text** from PDF
- ✅ **Final parsing results**
- ✅ **Error messages and warnings**
- ✅ **Debug history viewer** with easy access to past sessions

## 📁 **Where Debug Files Go:**

### **Downloaded Files:**
- **Location**: Your browser's default download folder (usually `Downloads`)
- **Filename**: `debug_[DistrictName]_[Timestamp].json`
- **Example**: `debug_Houston_ISD_2024-01-15T10-30-00.json`

### **Browser Storage:**
- **Location**: Saved in your browser's localStorage
- **Access**: View in the **"Debug History"** section at the bottom of the page
- **Limit**: Keeps last 10 debug sessions automatically

## 📤 **How to Get Debug Data:**

### **Option 1: Export to File (Recommended)**
1. Upload and parse a PDF
2. Click **"Debug Data"** button
3. File downloads to your Downloads folder
4. Send the file to whoever needs to review it

### **Option 2: View Debug History**
1. Scroll down to **"Debug History"** section
2. See all your past parsing sessions
3. Click any session to view details
4. Click **"Export"** to download that specific session

### **Option 3: Copy to Clipboard**
1. Upload and parse a PDF
2. Click **"Copy Debug"** button
3. Paste into email, Slack, etc.

### **Option 3: Send to Webhook (Automatic)**
1. Set up a webhook URL (see below)
2. Update the webhook URL in `PDFAuditParser.tsx`
3. Debug data automatically sent when parsing completes

## 🌐 **Webhook Setup Options:**

### **Quick & Free - Webhook.site:**
1. Go to https://webhook.site
2. Copy your unique URL (e.g., `https://webhook.site/abc123`)
3. Replace the URL in `handleSendDebug()` function
4. All debug data will appear on the webhook.site page

### **Discord Webhook:**
1. Create a Discord webhook in your server
2. Use the webhook URL in the code
3. Debug data posted as messages

### **Slack Webhook:**
1. Create a Slack incoming webhook
2. Use the webhook URL in the code
3. Debug data posted to your Slack channel

### **Email via Zapier/Make:**
1. Create a Zapier/Make webhook
2. Connect it to email/Google Sheets/etc.
3. Debug data automatically processed

## 📊 **Debug Data Structure:**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "extractedTextLength": 45678,
  "extractedTextPreview": "First 1000 characters...",
  "sectionsFound": ["statement of net position", "balance sheet"],
  "commonPatterns": ["Found 45 dollar amounts", "Found 12 large numbers"],
  "parsingResults": {
    "districtName": "Houston ISD",
    "netPosition": { "totalAssets": 1234567890 }
  },
  "debugLogs": [
    "[2024-01-15T10:30:01.000Z] Extracted text from 120 pages, 45678 characters",
    "[2024-01-15T10:30:02.000Z] Found section for 'statement of net position': 2341 characters",
    "[2024-01-15T10:30:03.000Z] 💰 Found amount for 'total assets': 1,234,567,890"
  ],
  "fullExtractedText": "Complete PDF text content..."
}
```

## 🎯 **Best Practices:**

1. **Test with known good PDFs first** to establish baseline
2. **Compare debug logs** between working and problematic PDFs
3. **Look for missing sections** in the `sectionsFound` array
4. **Check amount extraction logs** for failed attempts
5. **Review `fullExtractedText`** to see if text extraction is working

## 🔧 **Customizing Debug Output:**

You can modify the debug logging in `pdfParser.ts`:
- Add more detailed section analysis
- Include text positioning information  
- Add custom pattern matching
- Export intermediate processing steps
