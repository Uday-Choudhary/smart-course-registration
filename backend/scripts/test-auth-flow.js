// const fetch = require('node-fetch'); // Native fetch used
// If native fetch is available (Node 18+), we don't need require. 
// I'll assume Node 18+ or I'll use a simple http request helper.

const BASE_URL = 'http://localhost:4000/api';
const ADMIN_SECRET = 'my_super_secret_key'; // We will set this in env when running

async function request(method, endpoint, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return { status: response.status, data };
}

async function runTest() {
    console.log('Starting Auth Flow Verification...');

    // 1. Try to register Admin WITHOUT secret
    console.log('\n1. Testing Admin Registration WITHOUT Secret...');
    const adminEmail = `admin_${Date.now()}@test.com`;
    const res1 = await request('POST', '/register', {
        name: 'Test Admin',
        email: adminEmail,
        password: 'password123',
        role: 'Admin'
    });

    if (res1.status === 403) {
        console.log('✅ Success: Admin registration blocked without secret.');
    } else {
        console.log('❌ Failed: Admin registration should be blocked. Status:', res1.status);
    }

    // 2. Register Admin WITH secret
    console.log('\n2. Testing Admin Registration WITH Secret...');
    const res2 = await request('POST', '/register', {
        name: 'Test Admin',
        email: adminEmail,
        password: 'password123',
        role: 'Admin',
        adminSecret: ADMIN_SECRET
    });

    let adminToken = '';
    if (res2.status === 201) {
        console.log('✅ Success: Admin registered with secret.');
        // Login to get token
        const loginRes = await request('POST', '/login', { email: adminEmail, password: 'password123' });
        adminToken = loginRes.data.token;
    } else {
        console.log('❌ Failed: Admin registration failed. Status:', res2.status, res2.data);
        return;
    }

    // 3. Create Faculty
    console.log('\n3. Testing Faculty Creation...');
    const facultyEmail = `faculty_${Date.now()}@test.com`;
    const res3 = await request('POST', '/faculty', {
        full_name: 'Test Faculty',
        email: facultyEmail,
        phone: '1234567890',
        sex: 'Male',
        subjects: ['Math']
    }, adminToken);

    if (res3.status === 201) {
        console.log('✅ Success: Faculty created.');
    } else {
        console.log('❌ Failed: Faculty creation failed. Status:', res3.status, res3.data);
        return;
    }

    // 4. Login as Faculty with DEFAULT password
    console.log('\n4. Testing Faculty Login with DEFAULT password...');
    const res4 = await request('POST', '/login', {
        email: facultyEmail,
        password: 'default@123'
    });

    let facultyToken = '';
    if (res4.status === 200) {
        console.log('✅ Success: Faculty logged in with default password.');
        facultyToken = res4.data.token;
    } else {
        console.log('❌ Failed: Faculty login failed. Status:', res4.status, res4.data);
        return;
    }

    // 5. Change Password
    console.log('\n5. Testing Password Change...');
    const newPassword = 'newpassword123';
    const res5 = await request('POST', '/change-password', {
        oldPassword: 'default@123',
        newPassword: newPassword
    }, facultyToken);

    if (res5.status === 200) {
        console.log('✅ Success: Password changed.');
    } else {
        console.log('❌ Failed: Password change failed. Status:', res5.status, res5.data);
        return;
    }

    // 6. Login with NEW password
    console.log('\n6. Testing Login with NEW password...');
    const res6 = await request('POST', '/login', {
        email: facultyEmail,
        password: newPassword
    });

    if (res6.status === 200) {
        console.log('✅ Success: Faculty logged in with new password.');
    } else {
        console.log('❌ Failed: Login with new password failed. Status:', res6.status, res6.data);
    }

    console.log('\nVerification Complete.');
}

runTest().catch(console.error);
