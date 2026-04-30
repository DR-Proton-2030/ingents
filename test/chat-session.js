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
  console.log('Test complete');
}

run().catch((e) => { console.error(e); process.exit(1); });

// Additional quick checks: image and video intents
async function runMediaTests() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('\nRunning media intent checks...');

  // Image intent
  let res = await fetch(`${base}/api/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Create an image of a modern festive Diwali poster with fireworks.' }] }),
  });
  const d1 = await res.json();
  console.log('Image intent reply sample:', d1.reply?.slice?.(0,120));
  console.log('Image URL present:', Boolean(d1.imageUrl));

  // Video intent (may take longer; just check that endpoint accepts request and returns sessionId)
  res = await fetch(`${base}/api/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Generate a short promotional video about our new product.' }] }),
  });
  const d2 = await res.json();
  console.log('Video intent reply sample:', d2.reply?.slice?.(0,120));
  console.log('Video URL present (may be null if generation queued):', Boolean(d2.videoUrl));
  console.log('Media tests complete');
}

runMediaTests().catch((e) => { console.error(e); process.exit(1); });
