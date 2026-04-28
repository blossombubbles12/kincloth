async function getKey() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:9000/auth/user/emailpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@scroll.com', password: 'password123' }),
    });

    const loginData = await loginRes.json();
    console.log('LOGIN_DATA:', JSON.stringify(loginData, null, 2));

    const cookie = loginRes.headers.get('set-cookie');
    
    // 2. Fetch API Keys
    const keysRes = await fetch('http://localhost:9000/admin/api-keys', {
      headers: { 
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json' 
      }
    });

    const data = await keysRes.json();
    console.log('DATA:', JSON.stringify(data, null, 2));
    
    const publishableKey = data.api_keys?.find(k => k.type === 'publishable');
    
    console.log('--------------------');
    console.log('KEY:' + (publishableKey?.token || 'NOT FOUND'));
    console.log('--------------------');
  } catch (e) {
    console.error('Failed to get key:', e);
  }
}

getKey();
