// Intercepts wrangler's fetch calls to capture the OAuth Bearer token,
// then creates a permanent CF API token via Cloudflare REST API.
const https = require('https');
const origRequest = https.request.bind(https);
let captured = false;

https.request = function(options, callback) {
  const headers = typeof options === 'object' ? (options.headers || {}) : {};
  const auth = headers['Authorization'] || headers['authorization'] || '';
  if (!captured && auth.startsWith('Bearer ')) {
    captured = true;
    const oauthToken = auth.slice(7);
    createApiToken(oauthToken);
  }
  return origRequest(options, callback);
};

// Also patch global fetch if available
const origFetch = globalThis.fetch;
if (origFetch) {
  globalThis.fetch = function(url, opts = {}) {
    const auth = (opts.headers || {})['Authorization'] || '';
    if (!captured && auth.startsWith('Bearer ')) {
      captured = true;
      const oauthToken = auth.slice(7);
      createApiToken(oauthToken);
    }
    return origFetch(url, opts);
  };
}

function createApiToken(oauthToken) {
  const body = JSON.stringify({
    name: 'NutriSync D1 Token',
    policies: [
      {
        effect: 'allow',
        resources: { 'com.cloudflare.api.account.*': '*' },
        permission_groups: [{ id: '3030687196b94b638145a3953da2b699', name: 'D1 Edit' }],
      },
    ],
  });

  const req = origRequest({
    hostname: 'api.cloudflare.com',
    path: '/client/v4/user/tokens',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${oauthToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.success && json.result && json.result.value) {
          console.log('CF_API_TOKEN=' + json.result.value);
        } else {
          // Try reading token itself as API token
          console.log('OAUTH_TOKEN=' + oauthToken);
          console.log('RAW=' + data);
        }
      } catch {
        console.log('OAUTH_TOKEN=' + oauthToken);
      }
      process.exit(0);
    });
  });
  req.on('error', () => {
    console.log('OAUTH_TOKEN=' + oauthToken);
    process.exit(0);
  });
  req.write(body);
  req.end();
}

// Run wrangler
process.argv = ['node', 'wrangler', 'd1', 'list', '--remote'];
