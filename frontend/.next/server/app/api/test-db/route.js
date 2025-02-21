const CHUNK_PUBLIC_PATH = "server/app/api/test-db/route.js";
const runtime = require("../../../chunks/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/node_modules_next_b0b694._.js");
runtime.loadChunk("server/chunks/[root of the server]__5bc3ea._.js");
runtime.loadChunk("server/chunks/_d96bc8._.js");
runtime.getOrInstantiateRuntimeModule("[project]/.next-internal/server/app/api/test-db/route/actions.js [app-rsc] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \"[project]/app/api/test-db/route.ts [app-route] (ecmascript)\" } [app-route] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
