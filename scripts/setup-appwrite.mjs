/**
 * LessGooo - Appwrite Database Collections Setup Script
 *
 * This script automates the creation of all required collections, attributes,
 * indexes, and permissions in your Appwrite Cloud Database.
 *
 * Usage:
 *   node scripts/setup-appwrite.mjs <APPWRITE_API_KEY>
 *
 * Or set the APPWRITE_API_KEY environment variable:
 *   APPWRITE_API_KEY=your_key node scripts/setup-appwrite.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load env variables
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  const vars = {};
  for (const f of envFiles) {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!(key in vars)) vars[key] = val;
        }
      }
    }
  }
  return vars;
}

const env = loadEnv();
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6addf37400385e615d7d";
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6addf6920037cf1f242e";

const apiKey = process.argv[2] || process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.log(`
========================================================================
🚀 LessGooo — Appwrite Database Setup
========================================================================
To automatically create the required Appwrite collections ('trips', 'posts', 'expenses', etc.):

1. Go to Appwrite Console: https://cloud.appwrite.io
2. Select Project: "${PROJECT_ID}"
3. Go to "Project Settings" -> "API Keys" -> "Create API Key"
4. Give it a name (e.g. "LessGooo Setup") and check scopes:
   - collections.read, collections.write
   - attributes.read, attributes.write
   - indexes.read, indexes.write
   - documents.read, documents.write
5. Copy the secret key and run:

   node scripts/setup-appwrite.mjs <YOUR_SECRET_API_KEY>

Alternatively, if you prefer creating collections manually in the Appwrite Console:
- Database: ${DATABASE_ID}
- Create Collection with Custom ID: "trips"
  - Attributes: userId (string, 36), title (string, 255), destination (string, 255),
    startDate (string, 50), endDate (string, 50), category (string, 50),
    budget (float), currency (string, 10), status (string, 20),
    notes (string, 5000), proposedPlan (string, 100000), specifications (string, 50000),
    createdAt (string, 50), updatedAt (string, 50)
  - Permissions: Any (read), Users (create, update, delete)

- Create Collection with Custom ID: "posts"
  - Attributes: userId (string, 36), authorName (string, 128), authorUsername (string, 64),
    title (string, 255), content (string, 10000), category (string, 64),
    tags (string, 5000), likesCount (integer, default 0), likedBy (string, 20000),
    createdAt (string, 50)
  - Permissions: Any (read), Users (create, update, delete)
========================================================================
`);
  process.exit(0);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": PROJECT_ID,
  "X-Appwrite-Key": apiKey,
};

async function api(method, urlPath, body) {
  const res = await fetch(`${ENDPOINT}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function ensureCollection(collectionId, name, permissions) {
  console.log(`\nChecking collection '${collectionId}' (${name})...`);
  const check = await api("GET", `/databases/${DATABASE_ID}/collections/${collectionId}`);
  if (check.ok) {
    console.log(`  Collection '${collectionId}' already exists.`);
    return true;
  }

  console.log(`  Creating collection '${collectionId}'...`);
  const create = await api("POST", `/databases/${DATABASE_ID}/collections`, {
    collectionId,
    name,
    permissions,
    documentSecurity: false,
  });

  if (!create.ok) {
    console.error(`  Failed to create collection '${collectionId}':`, create.data?.message || create.status);
    return false;
  }
  console.log(`  Collection '${collectionId}' created successfully!`);
  return true;
}

async function createAttribute(collectionId, type, attr) {
  const url = `/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${type}`;
  const res = await api("POST", url, attr);
  if (res.ok) {
    console.log(`    + Added attribute: ${attr.key} (${type})`);
  } else if (res.status === 409 || res.data?.type === "attribute_already_exists") {
    console.log(`    = Attribute already exists: ${attr.key}`);
  } else {
    console.warn(`    ! Warning for attribute ${attr.key}:`, res.data?.message || res.status);
  }
}

async function createIndex(collectionId, key, type, attributes) {
  const url = `/databases/${DATABASE_ID}/collections/${collectionId}/indexes`;
  const res = await api("POST", url, { key, type, attributes });
  if (res.ok) {
    console.log(`    + Added index: ${key} on [${attributes.join(", ")}]`);
  } else if (res.status === 409 || res.data?.type === "index_already_exists") {
    console.log(`    = Index already exists: ${key}`);
  } else {
    console.warn(`    ! Warning for index ${key}:`, res.data?.message || res.status);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log(`Connecting to Appwrite: ${ENDPOINT}`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Database: ${DATABASE_ID}`);

  // Permissions presets
  const standardPerms = [
    'read("any")',
    'create("users")',
    'update("users")',
    'delete("users")',
  ];

  // 1. Setup 'trips' collection
  if (await ensureCollection("trips", "Trips", standardPerms)) {
    console.log("  Configuring 'trips' attributes...");
    await createAttribute("trips", "string", { key: "userId", size: 36, required: true });
    await createAttribute("trips", "string", { key: "title", size: 255, required: true });
    await createAttribute("trips", "string", { key: "destination", size: 255, required: true });
    await createAttribute("trips", "string", { key: "from", size: 255, required: false });
    await createAttribute("trips", "string", { key: "startDate", size: 50, required: true });
    await createAttribute("trips", "string", { key: "endDate", size: 50, required: true });
    await createAttribute("trips", "string", { key: "category", size: 50, required: true });
    await createAttribute("trips", "float", { key: "budget", required: true, default: 0 });
    await createAttribute("trips", "string", { key: "currency", size: 10, required: true, default: "INR" });
    await createAttribute("trips", "string", { key: "status", size: 20, required: true, default: "upcoming" });
    await createAttribute("trips", "string", { key: "notes", size: 5000, required: false });
    await createAttribute("trips", "string", { key: "specifications", size: 50000, required: false });
    await createAttribute("trips", "string", { key: "proposedPlan", size: 100000, required: false });
    await createAttribute("trips", "float", { key: "estimatedTicketCost", required: false });
    await createAttribute("trips", "string", { key: "estimatedTransitCost", size: 10000, required: false });
    await createAttribute("trips", "string", { key: "approachingTransitCost", size: 10000, required: false });
    await createAttribute("trips", "string", { key: "departureTransitCost", size: 10000, required: false });
    await createAttribute("trips", "string", { key: "createdAt", size: 50, required: true });
    await createAttribute("trips", "string", { key: "updatedAt", size: 50, required: true });

    await sleep(1000);
    await createIndex("trips", "userId_idx", "key", ["userId"]);
    await createIndex("trips", "status_idx", "key", ["status"]);
  }

  // 2. Setup 'posts' collection
  if (await ensureCollection("posts", "Posts", standardPerms)) {
    console.log("  Configuring 'posts' attributes...");
    await createAttribute("posts", "string", { key: "userId", size: 36, required: true });
    await createAttribute("posts", "string", { key: "user_id", size: 36, required: false });
    await createAttribute("posts", "string", { key: "authorName", size: 128, required: true });
    await createAttribute("posts", "string", { key: "author_name", size: 128, required: false });
    await createAttribute("posts", "string", { key: "authorUsername", size: 64, required: true });
    await createAttribute("posts", "string", { key: "author_username", size: 64, required: false });
    await createAttribute("posts", "string", { key: "title", size: 255, required: true });
    await createAttribute("posts", "string", { key: "content", size: 10000, required: true });
    await createAttribute("posts", "string", { key: "category", size: 64, required: true, default: "General" });
    await createAttribute("posts", "string", { key: "tags", size: 5000, required: true, default: "[]" });
    await createAttribute("posts", "integer", { key: "likesCount", required: true, default: 0 });
    await createAttribute("posts", "integer", { key: "likes_count", required: false, default: 0 });
    await createAttribute("posts", "string", { key: "likedBy", size: 20000, required: true, default: "[]" });
    await createAttribute("posts", "string", { key: "liked_by", size: 20000, required: false, default: "[]" });
    await createAttribute("posts", "string", { key: "createdAt", size: 50, required: true });
    await createAttribute("posts", "string", { key: "created_at", size: 50, required: false });

    await sleep(1000);
    await createIndex("posts", "createdAt_idx", "key", ["createdAt"]);
  }

  // 3. Setup 'expenses' collection
  if (await ensureCollection("expenses", "Expenses", standardPerms)) {
    console.log("  Configuring 'expenses' attributes...");
    await createAttribute("expenses", "string", { key: "userId", size: 36, required: true });
    await createAttribute("expenses", "string", { key: "tripId", size: 36, required: false });
    await createAttribute("expenses", "string", { key: "itineraryId", size: 36, required: false });
    await createAttribute("expenses", "string", { key: "title", size: 255, required: true });
    await createAttribute("expenses", "float", { key: "amountINR", required: true, default: 0 });
    await createAttribute("expenses", "string", { key: "category", size: 50, required: true, default: "transit" });
    await createAttribute("expenses", "string", { key: "timestamp", size: 50, required: true });

    await sleep(1000);
    await createIndex("expenses", "userId_idx", "key", ["userId"]);
  }

  // 4. Setup 'itineraries' collection
  if (await ensureCollection("itineraries", "Itineraries", standardPerms)) {
    console.log("  Configuring 'itineraries' attributes...");
    await createAttribute("itineraries", "string", { key: "userId", size: 36, required: true });
    await createAttribute("itineraries", "string", { key: "tripId", size: 36, required: false });
    await createAttribute("itineraries", "string", { key: "title", size: 255, required: true });
    await createAttribute("itineraries", "string", { key: "stopsJson", size: 100000, required: true });
    await createAttribute("itineraries", "integer", { key: "totalBudgetINR", required: true, default: 0 });
    await createAttribute("itineraries", "integer", { key: "spentINR", required: true, default: 0 });
    await createAttribute("itineraries", "string", { key: "createdAt", size: 50, required: true });
    await createAttribute("itineraries", "string", { key: "updatedAt", size: 50, required: true });

    await sleep(1000);
    await createIndex("itineraries", "userId_idx", "key", ["userId"]);
  }

  console.log("\n Appwrite Database collections and schemas configured successfully!");
}

run().catch((err) => {
  console.error("Setup script failed:", err);
  process.exit(1);
});
