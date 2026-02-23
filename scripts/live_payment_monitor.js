/**
 * ═══════════════════════════════════════════════════════════════
 *  LIVE MONITOR: UPI / UTR Payment → Database Watcher
 * ═══════════════════════════════════════════════════════════════
 *
 *  Keep this running in a terminal while testing in Expo Go.
 *  When you scan the QR, enter a UTR/UPI ID, and submit —
 *  this script will instantly show the new record in the terminal.
 *
 *  Monitors:
 *    • visitor_registration  (visitor pass purchases)
 *    • participant_team      (event registrations)
 *
 *  Usage:
 *    node scripts/live_payment_monitor.js
 *
 *  Press Ctrl+C to stop.
 * ═══════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ─── Load env ──────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('❌  .env.local not found at', envPath);
    process.exit(1);
}
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌  Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── State ─────────────────────────────────────────────────────────────────────
let lastVisitorId = null;
let lastTeamId = null;
let visitorCount = 0;
let teamCount = 0;
let pollCount = 0;

const POLL_INTERVAL = 3000; // check every 3 seconds

// ─── Pretty print helpers ──────────────────────────────────────────────────────
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const BG_GREEN = '\x1b[42m';
const BG_MAGENTA = '\x1b[45m';
const WHITE = '\x1b[37m';

function timestamp() {
    return new Date().toLocaleTimeString('en-IN', { hour12: true });
}

function printVisitorEntry(row) {
    visitorCount++;
    console.log('');
    console.log(`${BG_GREEN}${WHITE}${BOLD} 🎟️  NEW VISITOR REGISTRATION #${visitorCount} ${RESET}  ${DIM}${timestamp()}${RESET}`);
    console.log(`${GREEN}┌──────────────────────────────────────────────────────┐${RESET}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}UTR / UPI ID:${RESET}   ${YELLOW}${row.paymentProofUrl || '(empty)'}${RESET}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Name:${RESET}           ${row.name}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Email:${RESET}          ${row.email}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Phone:${RESET}          ${row.phone}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}College:${RESET}        ${row.college}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Pass Type:${RESET}      ${row.passType}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Amount:${RESET}         ₹${row.amount}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Status:${RESET}         ${row.status}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Booking ID:${RESET}     ${row.userBookingId || row.bookingId || '—'}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}User ID:${RESET}        ${row.userId || '—'}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}DB Row ID:${RESET}      ${DIM}${row.id}${RESET}`);
    console.log(`${GREEN}│${RESET}  ${BOLD}Created:${RESET}        ${row.createdAt}`);
    console.log(`${GREEN}└──────────────────────────────────────────────────────┘${RESET}`);

    if (row.paymentProofUrl && row.paymentProofUrl.length >= 12) {
        console.log(`  ${GREEN}✅  UTR saved correctly in DB!${RESET}`);
    } else if (row.paymentProofUrl) {
        console.log(`  ${YELLOW}⚠️  UTR saved but looks short (${row.paymentProofUrl.length} chars)${RESET}`);
    } else {
        console.log(`  ${RED}❌  UTR is empty / null!${RESET}`);
    }
}

function printTeamEntry(row) {
    teamCount++;
    console.log('');
    console.log(`${BG_MAGENTA}${WHITE}${BOLD} 🏆  NEW EVENT REGISTRATION #${teamCount} ${RESET}  ${DIM}${timestamp()}${RESET}`);
    console.log(`${MAGENTA}┌──────────────────────────────────────────────────────┐${RESET}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}UTR / UPI ID:${RESET}   ${YELLOW}${row.paymentProofUrl || '(empty)'}${RESET}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Team Name:${RESET}      ${row.teamName}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Leader:${RESET}         ${row.leaderName}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Email:${RESET}          ${row.leaderEmail}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Phone:${RESET}          ${row.leaderPhone}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}College:${RESET}        ${row.college}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Amount:${RESET}         ₹${row.totalAmount}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Status:${RESET}         ${row.status}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Booking ID:${RESET}     ${row.leaderBookingId || '—'}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}DB Row ID:${RESET}      ${DIM}${row.id}${RESET}`);
    console.log(`${MAGENTA}│${RESET}  ${BOLD}Created:${RESET}        ${row.createdAt}`);
    console.log(`${MAGENTA}└──────────────────────────────────────────────────────┘${RESET}`);

    if (row.paymentProofUrl && row.paymentProofUrl.length >= 12) {
        console.log(`  ${GREEN}✅  UTR saved correctly in DB!${RESET}`);
    } else if (row.paymentProofUrl) {
        console.log(`  ${YELLOW}⚠️  UTR saved but looks short (${row.paymentProofUrl.length} chars)${RESET}`);
    } else {
        console.log(`  ${RED}❌  UTR is empty / null!${RESET}`);
    }
}

// ─── Realtime subscription (Supabase Realtime) ────────────────────────────────
function setupRealtime() {
    const channel = supabase.channel('payment-monitor');

    channel
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'visitor_registration' },
            (payload) => {
                printVisitorEntry(payload.new);
            }
        )
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'participant_team' },
            (payload) => {
                printTeamEntry(payload.new);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`${GREEN}${BOLD}  ✓ Realtime subscription active${RESET}`);
                console.log(`${DIM}    (Instant notifications for new rows)${RESET}`);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.log(`${YELLOW}  ⚠ Realtime not available (status: ${status})${RESET}`);
                console.log(`${DIM}    Falling back to polling every ${POLL_INTERVAL / 1000}s...${RESET}`);
            }
        });

    return channel;
}

// ─── Polling fallback ──────────────────────────────────────────────────────────
async function getLatestVisitor() {
    const { data, error } = await supabase
        .from('visitor_registration')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') return null; // PGRST116 = no rows
    return data;
}

async function getLatestTeam() {
    const { data, error } = await supabase
        .from('participant_team')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') return null;
    return data;
}

async function pollForChanges() {
    pollCount++;
    
    // Spinner animation
    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const frame = spinnerFrames[pollCount % spinnerFrames.length];
    process.stdout.write(`\r${DIM}  ${frame} Watching for new payments... (poll #${pollCount})${RESET}    `);

    try {
        const visitor = await getLatestVisitor();
        if (visitor && visitor.id !== lastVisitorId) {
            if (lastVisitorId !== null) {
                // This is a genuinely new entry (not the initial load)
                process.stdout.write('\r' + ' '.repeat(60) + '\r');
                printVisitorEntry(visitor);
            }
            lastVisitorId = visitor.id;
        }

        const team = await getLatestTeam();
        if (team && team.id !== lastTeamId) {
            if (lastTeamId !== null) {
                process.stdout.write('\r' + ' '.repeat(60) + '\r');
                printTeamEntry(team);
            }
            lastTeamId = team.id;
        }
    } catch (err) {
        // Silently continue on polling errors
    }
}

// ─── Fetch current counts on startup ──────────────────────────────────────────
async function showCurrentState() {
    console.log(`\n${CYAN}${BOLD}  Fetching current DB state...${RESET}`);

    const { count: vCount } = await supabase
        .from('visitor_registration')
        .select('*', { count: 'exact', head: true });

    const { count: tCount } = await supabase
        .from('participant_team')
        .select('*', { count: 'exact', head: true });

    console.log(`${CYAN}  📊  visitor_registration: ${BOLD}${vCount ?? 0}${RESET}${CYAN} total rows${RESET}`);
    console.log(`${CYAN}  📊  participant_team:      ${BOLD}${tCount ?? 0}${RESET}${CYAN} total rows${RESET}`);

    // Show last 3 visitor registrations
    const { data: recentVisitors } = await supabase
        .from('visitor_registration')
        .select('name, paymentProofUrl, passType, amount, createdAt')
        .order('createdAt', { ascending: false })
        .limit(3);

    if (recentVisitors && recentVisitors.length > 0) {
        console.log(`\n${DIM}  Last ${recentVisitors.length} visitor registrations:${RESET}`);
        recentVisitors.forEach((v, i) => {
            console.log(`${DIM}    ${i + 1}. ${v.name} | UTR: ${v.paymentProofUrl || '—'} | ${v.passType} | ₹${v.amount} | ${v.createdAt}${RESET}`);
        });
    }

    // Show last 3 team registrations
    const { data: recentTeams } = await supabase
        .from('participant_team')
        .select('teamName, leaderName, paymentProofUrl, totalAmount, createdAt')
        .order('createdAt', { ascending: false })
        .limit(3);

    if (recentTeams && recentTeams.length > 0) {
        console.log(`\n${DIM}  Last ${recentTeams.length} event registrations:${RESET}`);
        recentTeams.forEach((t, i) => {
            console.log(`${DIM}    ${i + 1}. ${t.teamName} (${t.leaderName}) | UTR: ${t.paymentProofUrl || '—'} | ₹${t.totalAmount} | ${t.createdAt}${RESET}`);
        });
    }

    // Seed the "last seen" IDs so polling only shows NEW entries
    const latestV = await getLatestVisitor();
    if (latestV) lastVisitorId = latestV.id;

    const latestT = await getLatestTeam();
    if (latestT) lastTeamId = latestT.id;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.clear();
    console.log(`${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}`);
    console.log(`${BOLD}║  ${CYAN}🔴 LIVE${RESET}${BOLD}  UPI / UTR Payment Monitor                     ║${RESET}`);
    console.log(`${BOLD}║         Watching DB for new payments in real-time       ║${RESET}`);
    console.log(`${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}`);
    console.log(`${DIM}  Supabase: ${supabaseUrl}${RESET}`);
    console.log(`${DIM}  Started:  ${new Date().toLocaleString()}${RESET}`);

    await showCurrentState();

    console.log(`\n${BOLD}──────────────────────────────────────────────────────────${RESET}`);
    console.log(`${GREEN}${BOLD}  👀 Watching for new entries...${RESET}`);
    console.log(`${DIM}  Open Expo Go → submit a payment → see it here instantly${RESET}`);
    console.log(`${DIM}  Press Ctrl+C to stop${RESET}`);
    console.log(`${BOLD}──────────────────────────────────────────────────────────${RESET}`);

    // Try Supabase Realtime first
    const channel = setupRealtime();

    // Also run polling as a reliable fallback
    setInterval(pollForChanges, POLL_INTERVAL);

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log(`\n\n${YELLOW}${BOLD}  Stopping monitor...${RESET}`);
        console.log(`${DIM}  Session summary: ${visitorCount} visitor registrations, ${teamCount} event registrations detected.${RESET}\n`);
        supabase.removeChannel(channel);
        process.exit(0);
    });
}

main().catch((err) => {
    console.error(`\n${RED}Fatal error:${RESET}`, err);
    process.exit(1);
});
