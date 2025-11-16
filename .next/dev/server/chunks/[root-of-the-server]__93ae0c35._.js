module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/Downloads/code/lib/googleSheetsServerClient.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-side Google Sheets API Client
 * Uses Service Account for secure server-side operations
 * 
 * Setup:
 * 1. Create a Google Service Account:
 *    - Go to Google Cloud Console
 *    - Create a new project (or use existing)
 *    - Enable Google Sheets API
 *    - Create Service Account with Editor role
 *    - Create and download JSON key
 * 
 * 2. Share your Google Sheet with the service account email:
 *    - Copy the "client_email" from the JSON key
 *    - Share the sheet with that email, give it Editor access
 * 
 * 3. Set environment variables in .env.local:
 *    GOOGLE_SHEETS_PRIVATE_KEY=your_private_key_here
 *    GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email_here
 *    GOOGLE_SHEETS_ID=your_sheet_id_here (same as NEXT_PUBLIC version)
 */ __turbopack_context__.s([
    "appendSheetRow",
    ()=>appendSheetRow,
    "deleteSheetRow",
    ()=>deleteSheetRow,
    "getSheetRows",
    ()=>getSheetRows,
    "updateSheetRow",
    ()=>updateSheetRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/googleapis@166.0.0/node_modules/googleapis/build/src/index.js [app-route] (ecmascript)");
;
let sheetsClient = null;
function getAuthClient() {
    if (!sheetsClient) {
        const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        if (!privateKey || !clientEmail) {
            throw new Error('Google Sheets credentials not configured. Please set GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_CLIENT_EMAIL in .env.local');
        }
        const auth = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        });
        sheetsClient = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
            version: 'v4',
            auth
        });
    }
    return sheetsClient;
}
async function updateSheetRow({ sheetName, rowIndex, values }) {
    try {
        const sheets = getAuthClient();
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        if (!sheetId) {
            throw new Error('GOOGLE_SHEETS_ID not configured');
        }
        // Get sheet metadata to find proper range
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId: sheetId
        });
        const sheet = metadata.data.sheets?.find((s)=>s.properties?.title === sheetName);
        if (!sheet) {
            throw new Error(`Sheet "${sheetName}" not found`);
        }
        const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
        const result = await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [
                    values
                ]
            }
        });
        return result.data;
    } catch (error) {
        console.error('Error updating sheet row:', error);
        throw error;
    }
}
async function appendSheetRow({ sheetName, values }) {
    try {
        const sheets = getAuthClient();
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        if (!sheetId) {
            throw new Error('GOOGLE_SHEETS_ID not configured');
        }
        const range = `${sheetName}!A:Z`;
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [
                    values
                ]
            }
        });
        return result.data;
    } catch (error) {
        console.error('Error appending sheet row:', error);
        throw error;
    }
}
async function deleteSheetRow(sheetName, rowIndex) {
    try {
        const sheets = getAuthClient();
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        if (!sheetId) {
            throw new Error('GOOGLE_SHEETS_ID not configured');
        }
        const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
        const result = await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range
        });
        return result.data;
    } catch (error) {
        console.error('Error deleting sheet row:', error);
        throw error;
    }
}
async function getSheetRows(sheetName) {
    try {
        const sheets = getAuthClient();
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        if (!sheetId) {
            throw new Error('GOOGLE_SHEETS_ID not configured');
        }
        const result = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!A:Z`
        });
        return result.data.values || [];
    } catch (error) {
        console.error('Error getting sheet rows:', error);
        throw error;
    }
}
}),
"[project]/Downloads/code/app/api/admin/sheets/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$googleSheetsServerClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/lib/googleSheetsServerClient.ts [app-route] (ecmascript)");
;
;
// Verify admin authentication
function verifyAdminAuth(request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    // For now, we'll use a simple token verification
    // In production, you should use proper session management (JWT, etc.)
    return token === process.env.ADMIN_API_TOKEN || request.cookies.get('admin-auth')?.value === 'true';
}
async function POST(request) {
    try {
        // Verify admin is authenticated
        if (!verifyAdminAuth(request)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { action, sheetName, rowIndex, values, data } = await request.json();
        if (!sheetName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'sheetName is required'
            }, {
                status: 400
            });
        }
        switch(action){
            case 'update':
                if (!rowIndex || !values) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'rowIndex and values are required for update'
                    }, {
                        status: 400
                    });
                }
                const updateResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$googleSheetsServerClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSheetRow"])({
                    sheetName,
                    rowIndex,
                    values
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: updateResult
                });
            case 'append':
                if (!values) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'values are required for append'
                    }, {
                        status: 400
                    });
                }
                const appendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$googleSheetsServerClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendSheetRow"])({
                    sheetName,
                    values
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: appendResult
                });
            case 'delete':
                if (!rowIndex) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'rowIndex is required for delete'
                    }, {
                        status: 400
                    });
                }
                const deleteResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$googleSheetsServerClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteSheetRow"])(sheetName, rowIndex);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: deleteResult
                });
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid action'
                }, {
                    status: 400
                });
        }
    } catch (error) {
        console.error('API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__93ae0c35._.js.map