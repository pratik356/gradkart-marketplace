import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tvboeempbyfvuraucvtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Ym9lZW1wYnlmdnVyYXVjdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDg1NzAsImV4cCI6MjA2NjU4NDU3MH0.qoRvN70wZq83I0tjlJsxPZQ8S0MOVnziQg7R8MmlUpA'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 