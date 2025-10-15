const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('Using base URL:', base);

  // First message
  let res = await fetch(`${base}/api/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello, draft a short Facebook post about our new product.' }] }),
  });
  const data1 = await res.json();
  console.log('First reply:', data1.reply);
  const sessionId = data1.sessionId;
  if (!sessionId) {
    console.error('No sessionId returned');
    process.exit(2);
  }

  // Second message with same session
  res = await fetch(`${base}/api/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, messages: [{ role: 'user', content: 'Now make it more casual and include a CTA.' }] }),
  });
  const data2 = await res.json();
  console.log('Second reply:', data2.reply);

  if (data2.sessionId !== sessionId) {
    console.warn('SessionId changed across requests:', sessionId, '->', data2.sessionId);
  } else {
    console.log('Session persisted across requests.');
  }

  console.log('Test complete');
}

run().catch((e) => { console.error(e); process.exit(1); });
