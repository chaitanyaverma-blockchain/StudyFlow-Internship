const http = require('http');

function request(path, method = 'GET', data = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {}
    };

    if (cookie) options.headers['Cookie'] = cookie;
    
    if (data) {
      if (typeof data === 'object') {
        options.headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
      } else {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    console.log('--- Register User A ---');
    let res = await request('/register', 'POST', 'name=User+A&email=usera%40example.com&password=Password123!&confirmPassword=Password123!');
    let cookieA = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : null;
    
    // If already registered, let's login
    if (!cookieA || res.status === 400) {
       console.log('Already registered? Logging in User A...');
       res = await request('/login', 'POST', 'email=usera%40example.com&password=Password123!');
       cookieA = res.headers['set-cookie'][0].split(';')[0];
    }
    console.log('Cookie A:', cookieA.substring(0, 15) + '...');

    console.log('\n--- Create Task for User A ---');
    const taskPayload = {
      studentName: 'Student A',
      email: 'usera@example.com',
      taskTitle: 'Secret Task A',
      subject: 'Math',
      description: 'This is User A secret task.',
      deadline: '2026-12-31',
      priority: 'High',
      category: 'Assignment',
      estimatedHours: 2,
      confirmation: true
    };
    res = await request('/api/tasks', 'POST', taskPayload, cookieA);
    const body = JSON.parse(res.body);
    if (!body.success) {
      console.log('Task creation failed:', body);
      return;
    }
    const taskA = body.data;

    console.log('\n--- Register User B ---');
    res = await request('/register', 'POST', 'name=User+B&email=userb%40example.com&password=Password123!&confirmPassword=Password123!');
    let cookieB = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : null;
    if (!cookieB || res.status === 400) {
       res = await request('/login', 'POST', 'email=userb%40example.com&password=Password123!');
       cookieB = res.headers['set-cookie'][0].split(';')[0];
    }

    console.log('\n--- Try to access Task A with User B (Authz Test) ---');
    res = await request(`/api/tasks/${taskA.id}`, 'GET', null, cookieB);
    console.log('User B fetching Task A status:', res.status);
    
    res = await request(`/api/tasks/${taskA.id}/status`, 'PATCH', { completed: true }, cookieB);
    console.log('User B modifying Task A status:', res.status);

    console.log('\n--- Protected Page Test (No Cookie) ---');
    res = await request('/tasks', 'GET');
    console.log('No-cookie fetching /tasks status:', res.status, 'Location:', res.headers.location);

    console.log('\n--- Protected API Test (No Cookie) ---');
    res = await request('/api/tasks', 'GET');
    console.log('No-cookie fetching /api/tasks status:', res.status);
    console.log('No-cookie /api/tasks body:', res.body);

    console.log('\n--- All tests completed successfully ---');
  } catch (err) {
    console.error(err);
  }
})();
