// ===========================================
// GOOGLE SHEETS SERVICE
// ===========================================
// This service handles syncing data to Google Sheets
// Used for membership applications

const { google } = require('googleapis');

// ------------------------------------------
// Initialize Google Sheets API
// ------------------------------------------
const initializeSheets = () => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return google.sheets({ version: 'v4', auth });
};

// ------------------------------------------
// Append membership data to Google Sheet
// ------------------------------------------
const appendMembershipToSheet = async (membershipData) => {
    try {
        // Check if Google Sheets is configured
        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
            console.log('Google Sheets not configured, skipping sync');
            return { success: false, reason: 'not_configured' };
        }

        const sheets = initializeSheets();

        // Format date nicely
        const appliedDate = new Date(membershipData.appliedAt || Date.now());
        const formattedDate = appliedDate.toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        });

        // Prepare row data
        const rowData = [
            membershipData.name,
            membershipData.registrationNo,
            membershipData.mobile,
            membershipData.email,
            membershipData.domain,
            membershipData.whyJoin,
            membershipData.status || 'pending',
            formattedDate
        ];

        // Append to sheet
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:H', // Columns A through H
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [rowData]
            }
        });

        console.log('✅ Membership data synced to Google Sheets');
        return { success: true, updatedRange: response.data.updates?.updatedRange };

    } catch (error) {
        console.error('❌ Google Sheets sync failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    appendMembershipToSheet
};
