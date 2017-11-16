const byKey = require('natural-sort-by-key');

module.exports = [
  
  { name: 'Natural', icon:'sort-alpha-asc', sorter: list => list.sort(byKey('name')) },
  { name: 'Reverse', icon:'sort-alpha-desc', sorter: list => list.sort(byKey('name')).reverse() },

];
