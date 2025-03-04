import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl: string = process.env.SUPABASE_URL || '';
const supabaseKey: string = process.env.SUPABASE_ANON_KEY || '';

const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
