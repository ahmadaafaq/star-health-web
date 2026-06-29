import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://efsgbittghkwjoklhqfk.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "sb_publishable_sVxAizYJoQGhe_ysQYvIBQ_EXqB0Xpj";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log("Checking leads in Supabase...");
  const { data: leads } = await supabase.from('leads').select('id, name, phone').limit(5);
  console.log("Leads Sample:", leads);

  console.log("Checking messages in Supabase...");
  const { data: messages, error } = await supabase.from('messages').select('*').limit(10);
  if (error) {
    console.error("Error reading messages:", error);
    return;
  }
  console.log("Messages Count:", messages?.length);
  console.log("Messages Sample:", messages);
}

check();
