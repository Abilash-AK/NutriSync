const d = require('./data/ingredients.json');
const s = new Set();
for (const i of d) { s.add(i.name.toLowerCase()); }
console.log('UNIQUE=' + s.size);
