import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Suppress ES module __dirname issues if TS target requires
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://efsgbittghkwjoklhqfk.supabase.co";
const SUPABASE_KEY = "sb_publishable_sVxAizYJoQGhe_ysQYvIBQ_EXqB0Xpj";

async function main() {
  console.log("Initializing Supabase client...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Verifying/creating policies bucket in storage...");
  // Attempt to create the bucket (it will fail/no-op if already exists)
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('policies', {
    public: true
  });

  if (bucketError) {
    console.log("Bucket status note:", bucketError.message);
  } else {
    console.log("Bucket created successfully.");
  }


  const pdfMapping = [
    {
      id: "arogya-sanjeevani",
      pattern: /Arogya_Sanjeevani/i
    },
    {
      id: "family-health-optima",
      pattern: /Family_Health_Optima/i
    },
    {
      id: "medi-classic",
      pattern: /Medi_Classic/i
    },
    {
      id: "star-assure",
      pattern: /Star_Health_Assure/i
    },
    {
      id: "star-premier",
      pattern: /Star_Health_Premier/i
    },
    {
      id: "young-star",
      pattern: /Young_Star/i
    },
    {
      id: "super-star",
      pattern: /Super_Star/i
    }
  ];

  const docsDir = path.resolve(__dirname, '../star-health-rag/star_health_docs/policies');
  
  if (!fs.existsSync(docsDir)) {
    console.error(`Policies folder not found at ${docsDir}`);
    return;
  }

  const files = fs.readdirSync(docsDir);
  console.log(`Found files in policies folder: ${files.join(", ")}`);

  for (const file of files) {
    if (!file.endsWith('.pdf')) continue;

    // Find match in our mapping
    const match = pdfMapping.find(m => m.pattern.test(file));
    if (!match) {
      console.log(`Skipping file: ${file} (no direct mapping)`);
      continue;
    }

    const filePath = path.join(docsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const supabasePath = `${match.id}.pdf`;

    console.log(`Uploading ${file} -> storage/policies/${supabasePath}...`);
    
    // Upload using Supabase JS SDK (since public upload policy is active)
    const { data, error } = await supabase.storage
      .from('policies')
      .upload(supabasePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error(`Failed to upload ${file}:`, error.message);
    } else {
      console.log(`Successfully uploaded ${file}. Public URL: ${SUPABASE_URL}/storage/v1/object/public/policies/${supabasePath}`);
    }
  }

  console.log("All operations complete.");
}

main().catch(err => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
