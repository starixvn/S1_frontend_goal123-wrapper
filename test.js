const axios = require('axios');
const traits = {};
const total = {};

function addMore(data) {
  data.forEach(c => {
    c.attributes.forEach(a => {
      if (!traits[a.trait_type]) traits[a.trait_type] = [];

      // if (a.value !== 'none') {
      const index = traits[a.trait_type].findIndex(t => t.value === a.value);
      if (index > -1) {
        traits[a.trait_type][index].occurance += 1;
      } else {
        traits[a.trait_type].push({
          value: a.value,
          occurance: 1,
        });
      }
      // }
    });
  });

  Object.keys(traits).forEach(k => {
    traits[k].sort((a, b) => b.occurance - a.occurance);
    total[k] = traits[k].reduce((acc, c) => acc + c.occurance, 0);
  });

  return traits;
}

const urls = [
  'https://kryst.co/def/1.json',
  'https://kryst.co/def/2.json',
  'https://kryst.co/def/3.json',
  'https://kryst.co/def/4.json',
  'https://kryst.co/def/5.json',
  'https://kryst.co/def/6.json',
  'https://kryst.co/def/7.json',
  'https://kryst.co/def/8.json',
  'https://kryst.co/def/9.json',
  'https://kryst.co/def/10.json',
];
//['https://jsonkeeper.com/b/G6GP'];
//['https://kryst.co/asd/3.json'];

const promises = urls.map(async url => {
  console.log('requesting', url);
  return axios.get(url).catch(e => console.log('error', e));
});

async function finalize() {
  console.log('waiting all request');
  const resp = await Promise.all(promises);
  console.log('done request, formatting data...');
  resp.forEach(r => addMore(r.data));

  console.log(traits);
  console.log(total);
}

finalize();
