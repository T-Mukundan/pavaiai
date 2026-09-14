import * as dotenv from 'dotenv';
dotenv.config();

import { authenticateUser, registerNewUser, sendCitizenOtp, verifyCitizenOtp } from '../lib/auth-service';
import { verifySessionToken } from '../lib/session';

async function testAuthSuite() {
  console.log('\n==================================================');
  console.log('       PRAVAH-AI AUTHENTICATION TEST SUITE');
  console.log('==================================================\n');

  // 1. Authenticate Demo Nodal Officer
  console.log('▶ [1/4] Testing Nodal Officer Credentials Login...');
  const nodalAuth = await authenticateUser('nodal@pravah.demo', 'demoPassword123!');
  if (!nodalAuth) {
    console.error('❌ Failed to authenticate nodal@pravah.demo');
  } else {
    console.log(`   ✅ Success! User: "${nodalAuth.user.name}" (${nodalAuth.user.role})`);
    console.log(`      • Department  : ${nodalAuth.user.departmentName}`);
    console.log(`      • Designation : ${nodalAuth.user.designation}`);
    const verified = verifySessionToken(nodalAuth.token);
    console.log(`      • JWT Verified: ${verified ? 'VALID (Expires in ' + (verified.exp - verified.iat) + 's)' : 'INVALID'}`);
  }

  // 2. Authenticate Citizen
  console.log('\n▶ [2/4] Testing Citizen Credentials Login...');
  const citizenAuth = await authenticateUser('citizen@pravah.demo', 'demoPassword123!');
  if (!citizenAuth) {
    console.error('❌ Failed to authenticate citizen@pravah.demo');
  } else {
    console.log(`   ✅ Success! User: "${citizenAuth.user.name}" (${citizenAuth.user.role})`);
    console.log(`      • Phone: ${citizenAuth.user.phone}`);
  }

  // 3. Citizen Mobile Phone OTP Flow
  console.log('\n▶ [3/4] Testing Citizen Mobile Phone OTP Flow...');
  const otpRes = sendCitizenOtp('+919876543210');
  console.log(`   • OTP Sent: ${otpRes.message}`);
  const otpVerify = await verifyCitizenOtp('+919876543210', otpRes.demoOtp);
  console.log(`   ✅ OTP Verified! User: "${otpVerify.user.name}" (Role: ${otpVerify.user.role})`);

  // 4. HTTP API Login Route via Fetch
  console.log('\n▶ [4/4] Testing HTTP POST /api/auth/login Endpoint...');
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'officer@pravah.demo', password: 'demoPassword123!' }),
    });
    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');
    if (res.ok && data.success) {
      console.log(`   ✅ HTTP Login Endpoint 200 OK!`);
      console.log(`      • Authenticated User: "${data.user.name}" (${data.user.role})`);
      console.log(`      • Cookie Set: ${setCookie ? 'pravah_session HTTP-Only Cookie Received' : 'No cookie'}`);
    } else {
      console.log(`   ❌ HTTP Login failed:`, data);
    }
  } catch (err: any) {
    console.log(`   ⚠️ HTTP Fetch error: ${err.message}`);
  }

  console.log('\n==================================================\n');
}

testAuthSuite();
