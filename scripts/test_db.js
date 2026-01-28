
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');
    console.log('URL:', supabaseUrl);

    const { data, error } = await supabase
        .from('event')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error connecting to database:', error.message);
    } else {
        console.log('Successfully connected!');
        console.log(`Found ${data.length} events.`);
        if (data.length > 0) {
            console.log('Sample Event:', data[0]);
        } else {
            console.log('The event table is empty.');
        }
    }
}

testConnection();
