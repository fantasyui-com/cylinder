module.exports = [

  { name: 'Radio',      filter: i => i.tags.indexOf('Radio')!= -1 },
  { name: 'Audiobooks', filter: i => i.tags.indexOf('Audiobook')!=-1 },
  { name: 'Music',      filter: i => i.tags.indexOf('Music')!= -1 },
  { name: 'Movies',     filter: i => i.tags.indexOf('Movies')!=-1 },
  { name: 'Radio & Audiobooks', filter: i => (['Radio','Audiobook'].map(j=>i.tags.indexOf(j)).filter(j=>j>-1).length>0) },

];
