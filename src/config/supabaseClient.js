import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngnnfglvdetefmfjionn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbm5mZ2x2ZGV0ZWZtZmppb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcxMTk1NDgsImV4cCI6MjAxMjY5NTU0OH0.w3P2ywcdzxN2G8_t5q_OG_KT27TJk7cwVsHq4HgjxFY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase