module.exports = [
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
"[project]/Downloads/code/lib/googleSheetsAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSheetData",
    ()=>getSheetData,
    "rowsToObjects",
    ()=>rowsToObjects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/googleapis@166.0.0/node_modules/googleapis/build/src/index.js [app-ssr] (ecmascript)");
;
/**
 * Get authenticated Google Sheets client
 */ function getAuthenticatedSheets() {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    if (!privateKey || !clientEmail) {
        console.warn('Google Sheets authentication credentials not configured');
        return null;
    }
    try {
        const auth = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["google"].auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                private_key: privateKey,
                client_email: clientEmail
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets.readonly'
            ]
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["google"].sheets({
            version: 'v4',
            auth
        });
    } catch (error) {
        console.error('Failed to authenticate with Google Sheets:', error);
        return null;
    }
}
async function getSheetData(spreadsheetId, range) {
    const sheets = getAuthenticatedSheets();
    if (!sheets) {
        throw new Error('Google Sheets client not initialized');
    }
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });
        return response.data.values || [];
    } catch (error) {
        console.error(`Failed to fetch sheet data from ${range}:`, error);
        throw error;
    }
}
function rowsToObjects(rows) {
    if (rows.length < 2) return [];
    const [headers, ...dataRows] = rows;
    return dataRows.map((row)=>{
        const obj = {};
        headers.forEach((header, index)=>{
            obj[header] = row[index] || '';
        });
        return obj;
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b1244f06._.js.map