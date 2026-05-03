// src/services/supabaseClient.js
//
// This is the bridge between your app and your cloud database.
// Think of it like a phone line — once connected, your app can
// send and receive data from Supabase.

import { createClient } from '@supabase/supabase-js';

// ============================================
// IMPORTANT: Replace these with YOUR actual values
// from Supabase → Settings → API
// ============================================
const supabaseUrl = 'https://mgnfodscswrnccugmnxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbmZvZHNjc3dybmNjdWdtbnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MDg5NjgsImV4cCI6MjA5MzM4NDk2OH0.bts_kTJJ1BvX8KNyNfR8kX8yxU01G_7aZzLuAf4ppfc';

// Create the connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// HOW TO FIND YOUR CREDENTIALS:
// 1. Go to app.supabase.com
// 2. Click your ZimPulse project
// 3. Click Settings (gear icon) → API
// 4. Copy "Project URL" → replace supabaseUrl
// 5. Copy "anon public key" → replace supabaseAnonKey
// ============================================