/**
 * ============================================================
 *  TEST: UPI / UTR Payment Saving to Database
 * ============================================================
 *
 *  This script verifies that when a user scans the UPI QR code
 *  and enters their UPI Transaction ID (UTR number), the data
 *  is correctly saved in the Supabase database.
 *
 *  It covers TWO flows:
 *    1. Visitor Registration  → visitor_registration table
 *    2. Event Registration    → participant_team table
 *
 *  Usage:
 *    node scripts/test_payment_utr.js
 *
 *  Requires:
 *    - .env.local with EXPO_PUBLIC_SUPABASE_URL and
 *      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
 *    - npm install dotenv @supabase/supabase-js  (already in deps)
 * ============================================================
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
const generateUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

const TEST_PREFIX = 'TEST_UTR_';
let passed = 0;
let failed = 0;
const results = [];

function assert(condition, label) {
    if (condition) {
        passed++;
        results.push(`  ✅  ${label}`);
    } else {
        failed++;
        results.push(`  ❌  ${label}`);
    }
}

// ─── Test 1: Visitor Registration – UTR saving ────────────────────────────────
async function testVisitorRegistrationUTR() {
    console.log('\n── Test 1: Visitor Registration UTR ──────────────────');

    const testId = generateUUID();
    const testUTR = TEST_PREFIX + Date.now().toString().slice(-12).padStart(12, '0');
    const testEmail = `test_visitor_${Date.now()}@test.com`;

    const payload = {
        id: testId,
        name: 'Test Visitor User',
        email: testEmail,
        phone: '9876543210',
        college: 'Test Engineering College',
        passType: 'day1',
        amount: 49,
        status: 'pending',
        paymentProofUrl: testUTR,       // ← This is the UTR / UPI Transaction ID
        bookingId: null,
        userBookingId: 'SGF26-TESTID',
        userId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // 1a. INSERT
    console.log('  → Inserting visitor registration with UTR:', testUTR);
    const { error: insertErr } = await supabase
        .from('visitor_registration')
        .insert(payload);

    assert(!insertErr, `INSERT into visitor_registration (${insertErr ? insertErr.message : 'OK'})`);
    if (insertErr) {
        console.error('    Insert error:', insertErr.message);
        return { cleanup: null };
    }

    // 1b. SELECT – verify UTR was saved
    console.log('  → Querying back to verify UTR is saved...');
    const { data, error: selectErr } = await supabase
        .from('visitor_registration')
        .select('id, name, email, paymentProofUrl, passType, amount, status, userBookingId')
        .eq('id', testId)
        .single();

    assert(!selectErr, `SELECT visitor_registration by id (${selectErr ? selectErr.message : 'OK'})`);

    if (data) {
        assert(data.paymentProofUrl === testUTR, `UTR matches: expected "${testUTR}", got "${data.paymentProofUrl}"`);
        assert(data.name === 'Test Visitor User', `Name matches: "${data.name}"`);
        assert(data.email === testEmail, `Email matches: "${data.email}"`);
        assert(data.passType === 'day1', `Pass type matches: "${data.passType}"`);
        assert(data.amount === 49, `Amount matches: ${data.amount}`);
        assert(data.status === 'pending', `Status is pending: "${data.status}"`);
        assert(data.userBookingId === 'SGF26-TESTID', `Booking ID matches: "${data.userBookingId}"`);
    } else {
        assert(false, 'Row not found after insert');
    }

    // 1c. SELECT by paymentProofUrl (UTR) – simulates lookup by UTR
    console.log('  → Querying by UTR number directly...');
    const { data: byUtr, error: utrErr } = await supabase
        .from('visitor_registration')
        .select('id, paymentProofUrl')
        .eq('paymentProofUrl', testUTR)
        .single();

    assert(!utrErr, `SELECT by paymentProofUrl/UTR (${utrErr ? utrErr.message : 'OK'})`);
    assert(byUtr && byUtr.id === testId, `Found correct row by UTR lookup`);

    return { cleanup: testId };
}

// ─── Test 2: Event Registration (participant_team) – UTR saving ────────────────
async function testEventRegistrationUTR() {
    console.log('\n── Test 2: Event Registration (participant_team) UTR ─');

    const testUTR = TEST_PREFIX + (Date.now() + 1).toString().slice(-12).padStart(12, '0');
    const testEmail = `test_event_${Date.now()}@test.com`;

    const payload = {
        teamName: 'Test Team Alpha',
        leaderName: 'Test Leader',
        leaderEmail: testEmail,
        leaderPhone: '9876543211',
        leaderBookingId: 'SGF26-EVTTEST',
        college: 'Test Engineering College',
        totalAmount: 150,
        status: 'pending',
        paymentProofUrl: testUTR,       // ← This is the UTR / UPI Transaction ID
    };

    // 2a. INSERT
    console.log('  → Inserting participant_team with UTR:', testUTR);
    const { data: teamData, error: insertErr } = await supabase
        .from('participant_team')
        .insert(payload)
        .select()
        .single();

    assert(!insertErr, `INSERT into participant_team (${insertErr ? insertErr.message : 'OK'})`);
    if (insertErr) {
        console.error('    Insert error:', insertErr.message);
        return { cleanup: null };
    }

    const teamId = teamData?.id;
    assert(!!teamId, `Got team ID back: ${teamId}`);

    // 2b. SELECT – verify UTR was saved
    console.log('  → Querying back to verify UTR is saved...');
    const { data, error: selectErr } = await supabase
        .from('participant_team')
        .select('id, teamName, leaderName, leaderEmail, paymentProofUrl, totalAmount, status, leaderBookingId')
        .eq('id', teamId)
        .single();

    assert(!selectErr, `SELECT participant_team by id (${selectErr ? selectErr.message : 'OK'})`);

    if (data) {
        assert(data.paymentProofUrl === testUTR, `UTR matches: expected "${testUTR}", got "${data.paymentProofUrl}"`);
        assert(data.teamName === 'Test Team Alpha', `Team name matches: "${data.teamName}"`);
        assert(data.leaderName === 'Test Leader', `Leader name matches: "${data.leaderName}"`);
        assert(data.leaderEmail === testEmail, `Leader email matches: "${data.leaderEmail}"`);
        assert(data.totalAmount === 150, `Amount matches: ${data.totalAmount}`);
        assert(data.status === 'pending', `Status is pending: "${data.status}"`);
        assert(data.leaderBookingId === 'SGF26-EVTTEST', `Booking ID matches: "${data.leaderBookingId}"`);
    } else {
        assert(false, 'Row not found after insert');
    }

    // 2c. SELECT by paymentProofUrl (UTR) – simulates lookup by UTR
    console.log('  → Querying by UTR number directly...');
    const { data: byUtr, error: utrErr } = await supabase
        .from('participant_team')
        .select('id, paymentProofUrl')
        .eq('paymentProofUrl', testUTR)
        .single();

    assert(!utrErr, `SELECT by paymentProofUrl/UTR (${utrErr ? utrErr.message : 'OK'})`);
    assert(byUtr && byUtr.id === teamId, `Found correct row by UTR lookup`);

    return { cleanup: teamId };
}

// ─── Test 3: Edge cases ────────────────────────────────────────────────────────
async function testEdgeCases() {
    console.log('\n── Test 3: Edge Cases ───────────────────────────────');

    // 3a. Empty UTR should still insert (app validates on client side, DB has no constraint)
    const testId = generateUUID();
    const { error: emptyErr } = await supabase
        .from('visitor_registration')
        .insert({
            id: testId,
            name: 'Edge Case User',
            email: `edge_${Date.now()}@test.com`,
            phone: '0000000000',
            college: 'Edge College',
            passType: 'dual',
            amount: 79,
            status: 'pending',
            paymentProofUrl: '',    // empty UTR
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

    assert(!emptyErr, `INSERT with empty UTR (DB allows it — validation is client-side)`);

    // 3b. Very long UTR string
    const longUTR = 'UPI' + '1'.repeat(100);
    const testId2 = generateUUID();
    const { error: longErr } = await supabase
        .from('visitor_registration')
        .insert({
            id: testId2,
            name: 'Long UTR User',
            email: `long_${Date.now()}@test.com`,
            phone: '0000000001',
            college: 'Long College',
            passType: 'day1',
            amount: 49,
            status: 'pending',
            paymentProofUrl: longUTR,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

    assert(!longErr, `INSERT with very long UTR string (${longErr ? longErr.message : 'OK'})`);

    // Verify the long UTR was stored correctly
    if (!longErr) {
        const { data } = await supabase
            .from('visitor_registration')
            .select('paymentProofUrl')
            .eq('id', testId2)
            .single();
        assert(data?.paymentProofUrl === longUTR, `Long UTR stored & retrieved correctly`);
    }

    // 3c. NULL UTR (paymentProofUrl is nullable in schema)
    const testId3 = generateUUID();
    const { error: nullErr } = await supabase
        .from('visitor_registration')
        .insert({
            id: testId3,
            name: 'Null UTR User',
            email: `null_${Date.now()}@test.com`,
            phone: '0000000002',
            college: 'Null College',
            passType: 'day2',
            amount: 79,
            status: 'pending',
            paymentProofUrl: null,  // no UTR at all
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

    assert(!nullErr, `INSERT with NULL UTR (${nullErr ? nullErr.message : 'OK'})`);

    return { cleanup: [testId, testId2, testId3] };
}

// ─── Test 4: Duplicate UTR detection ───────────────────────────────────────────
async function testDuplicateUTR() {
    console.log('\n── Test 4: Duplicate UTR Detection ──────────────────');

    const duplicateUTR = TEST_PREFIX + 'DUP' + Date.now().toString().slice(-9);

    // Insert first record
    const id1 = generateUUID();
    const { error: err1 } = await supabase
        .from('visitor_registration')
        .insert({
            id: id1,
            name: 'Dup User 1',
            email: `dup1_${Date.now()}@test.com`,
            phone: '1111111111',
            college: 'Dup College',
            passType: 'day1',
            amount: 49,
            status: 'pending',
            paymentProofUrl: duplicateUTR,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

    assert(!err1, `First insert with UTR "${duplicateUTR}" succeeded`);

    // Insert second record with SAME UTR (DB allows it – no unique constraint on paymentProofUrl)
    const id2 = generateUUID();
    const { error: err2 } = await supabase
        .from('visitor_registration')
        .insert({
            id: id2,
            name: 'Dup User 2',
            email: `dup2_${Date.now()}@test.com`,
            phone: '2222222222',
            college: 'Dup College',
            passType: 'day1',
            amount: 49,
            status: 'pending',
            paymentProofUrl: duplicateUTR,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

    // NOTE: The DB currently allows duplicate UTRs – this test documents that behavior.
    // If you want to prevent duplicates, add a unique constraint on paymentProofUrl.
    assert(!err2, `Second insert with same UTR allowed (no unique constraint)`);

    // Verify both exist
    const { data: dups, error: dupErr } = await supabase
        .from('visitor_registration')
        .select('id')
        .eq('paymentProofUrl', duplicateUTR);

    assert(!dupErr && dups?.length === 2, `Both records with same UTR exist in DB (count: ${dups?.length})`);

    return { cleanup: [id1, id2] };
}

// ─── Cleanup ───────────────────────────────────────────────────────────────────
async function cleanup(visitorIds, teamIds) {
    console.log('\n── Cleanup ──────────────────────────────────────────');

    if (visitorIds.length > 0) {
        const { error } = await supabase
            .from('visitor_registration')
            .delete()
            .in('id', visitorIds);
        console.log(`  🧹  Deleted ${visitorIds.length} test visitor_registration rows ${error ? '(error: ' + error.message + ')' : '✓'}`);
    }

    if (teamIds.length > 0) {
        const { error } = await supabase
            .from('participant_team')
            .delete()
            .in('id', teamIds);
        console.log(`  🧹  Deleted ${teamIds.length} test participant_team rows ${error ? '(error: ' + error.message + ')' : '✓'}`);
    }
}

// ─── Run all tests ─────────────────────────────────────────────────────────────
async function main() {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   UPI / UTR Payment → Database Save Test Suite      ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log(`Supabase URL: ${supabaseUrl}`);
    console.log(`Timestamp:    ${new Date().toISOString()}`);

    const visitorCleanup = [];
    const teamCleanup = [];

    try {
        // Test 1
        const t1 = await testVisitorRegistrationUTR();
        if (t1.cleanup) visitorCleanup.push(t1.cleanup);

        // Test 2
        const t2 = await testEventRegistrationUTR();
        if (t2.cleanup) teamCleanup.push(t2.cleanup);

        // Test 3
        const t3 = await testEdgeCases();
        if (t3.cleanup) visitorCleanup.push(...t3.cleanup);

        // Test 4
        const t4 = await testDuplicateUTR();
        if (t4.cleanup) visitorCleanup.push(...t4.cleanup);

    } catch (err) {
        console.error('\n💥  Unexpected error during tests:', err);
    }

    // Cleanup test data
    await cleanup(visitorCleanup, teamCleanup);

    // Print summary
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  TEST RESULTS');
    console.log('══════════════════════════════════════════════════════');
    results.forEach((r) => console.log(r));
    console.log('──────────────────────────────────────────────────────');
    console.log(`  Total: ${passed + failed}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}`);
    console.log('══════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

main();
