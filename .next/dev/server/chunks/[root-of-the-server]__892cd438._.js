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
"[project]/Downloads/code/lib/evidenceSheets.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Evidence/Report data management
 * All data comes from Google Sheets "evidence" tab
 */ __turbopack_context__.s([
    "fetchEvidenceFromSheets",
    ()=>fetchEvidenceFromSheets
]);
async function fetchEvidenceFromSheets() {
    const SHEET_ID = ("TURBOPACK compile-time value", "1IRDxPqcjRroM6TkAONKuiTWjeLCBtK-vlrHCcLsHnxw");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/query?tq=SELECT%20*%20FROM%20'evidence'&tqx=out:json`;
        const response = await fetch(url);
        const text = await response.text();
        console.log('Google Sheets response length:', text.length, 'First 100 chars:', text.substring(0, 100));
        // Google Sheets response format: )]}' followed by JSON
        let jsonString = text.trim();
        // Remove the Google Sheets security prefix if present
        if (jsonString.startsWith(')]}\'')) {
            jsonString = jsonString.substring(4);
        }
        // Try to parse the JSON
        let json;
        try {
            json = JSON.parse(jsonString);
        } catch (parseError) {
            // If direct parse fails, try to extract JSON object from the string
            const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.warn('Could not extract JSON from Google Sheets response:', text.substring(0, 200));
                return [];
            }
            try {
                json = JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.warn('Extracted JSON is still invalid:', jsonMatch[0].substring(0, 100));
                return [];
            }
        }
        // If table is empty or no rows, return empty array
        if (!json.table || !json.table.rows || json.table.rows.length === 0) {
            console.log('Google Sheets table is empty');
            return [];
        }
        const evidence = json.table.rows.map((row, idx)=>{
            const cols = row.c || [];
            return {
                id: cols[0]?.v || `E${idx + 1}`,
                lat: parseFloat(cols[1]?.v) || 0,
                lng: parseFloat(cols[2]?.v) || 0,
                category: cols[3]?.v || '',
                severity: cols[4]?.v || 'Low',
                note: cols[5]?.v || '',
                reporter: cols[6]?.v || '',
                date: cols[7]?.v || new Date().toISOString().split('T')[0],
                zone: cols[8]?.v || '',
                upvotes: parseInt(cols[9]?.v) || 0,
                verified: cols[10]?.v?.toString().toLowerCase() === 'yes' || cols[10]?.v?.toString().toLowerCase() === 'true',
                status: cols[11]?.v || 'Open',
                images: (cols[12]?.v || '').split('|').filter((s)=>s.trim()),
                assignedTo: cols[13]?.v || '',
                assignedDate: cols[14]?.v || ''
            };
        });
        return evidence;
    } catch (error) {
        console.error('Error fetching evidence from Google Sheets:', error);
        return [];
    }
}
}),
"[project]/Downloads/code/app/api/data/reports/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$evidenceSheets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/code/lib/evidenceSheets.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const evidence = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$lib$2f$evidenceSheets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchEvidenceFromSheets"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(evidence);
    } catch (error) {
        console.error('Error fetching evidence from sheets:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$code$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([], {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__892cd438._.js.map