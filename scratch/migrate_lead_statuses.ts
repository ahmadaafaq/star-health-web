import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up since this is in scratch/
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY/SUPABASE_KEY in env variables.");
  process.exit(1);
}

async function runMigration() {
  console.log("Connecting to Supabase...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Fetching all leads...");
  const { data: leads, error: fetchError } = await supabase
    .from('leads')
    .select('id, name, lead_status');

  if (fetchError) {
    console.error("Error fetching leads:", fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${leads?.length || 0} leads. Migrating status values...`);

  let openCount = 0;
  let inProgressCount = 0;
  let communicationCount = 0;
  let wonCount = 0;
  let lostCount = 0;
  let unchangedCount = 0;

  for (const lead of (leads || [])) {
    let targetStatus = lead.lead_status;

    if (lead.lead_status === 'open' || !lead.lead_status) {
      targetStatus = 'new';
      openCount++;
    } else if (lead.lead_status === 'in_progress') {
      targetStatus = 'connected';
      inProgressCount++;
    } else if (lead.lead_status === 'communication' || lead.lead_status === 'scheduled') {
      targetStatus = 'callback';
      communicationCount++;
    } else if (lead.lead_status === 'won') {
      targetStatus = 'converted';
      wonCount++;
    } else if (lead.lead_status === 'lost') {
      targetStatus = 'junk';
      lostCount++;
    } else {
      unchangedCount++;
      continue; // Skip if already using a new status or other status
    }

    console.log(`Migrating lead "${lead.name || 'Unnamed'}" (${lead.id}): "${lead.lead_status}" -> "${targetStatus}"`);
    const { error: updateError } = await supabase
      .from('leads')
      .update({ lead_status: targetStatus })
      .eq('id', lead.id);

    if (updateError) {
      console.error(`Failed to update lead ${lead.id}:`, updateError.message);
    }
  }

  console.log("\nMigration completed successfully!");
  console.log(`- 'open' -> 'new': ${openCount}`);
  console.log(`- 'in_progress' -> 'connected': ${inProgressCount}`);
  console.log(`- 'communication'/'scheduled' -> 'callback': ${communicationCount}`);
  console.log(`- 'won' -> 'converted': ${wonCount}`);
  console.log(`- 'lost' -> 'junk': ${lostCount}`);
  console.log(`- Unchanged/Skip: ${unchangedCount}`);
}

runMigration().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
