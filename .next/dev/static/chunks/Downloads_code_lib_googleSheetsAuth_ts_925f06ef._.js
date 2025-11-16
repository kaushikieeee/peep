(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/code/lib/googleSheetsAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSheetData",
    ()=>getSheetData,
    "rowsToObjects",
    ()=>rowsToObjects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/googleapis@166.0.0/node_modules/googleapis/build/src/index.js [app-client] (ecmascript)");
;
/**
 * Get authenticated Google Sheets client
 */ function getAuthenticatedSheets() {
    const privateKey = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.GOOGLE_SHEETS_CLIENT_EMAIL;
    if (!privateKey || !clientEmail) {
        console.warn('Google Sheets authentication credentials not configured');
        return null;
    }
    try {
        const auth = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["google"].auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                private_key: privateKey,
                client_email: clientEmail
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets.readonly'
            ]
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$googleapis$40$166$2e$0$2e$0$2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["google"].sheets({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_code_lib_googleSheetsAuth_ts_925f06ef._.js.map