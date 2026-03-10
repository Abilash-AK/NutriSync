const h = require('https');
const b = '{}';
const o = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d6nplon5r7bs73djt340/deploys',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rnd_WwHmXD6jZWWE9wZn3Dfn5TdwosPs',
    'Content-Type': 'application/json',
    'Content-Length': 2
  }
};
const r = h.request(o, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const j = JSON.parse(d);
    console.log('Deploy ID:', j.id);
    console.log('Status:', j.status);
  });
});
r.on('error', e => console.error('Error:', e.message));
r.write(b);
r.end();
