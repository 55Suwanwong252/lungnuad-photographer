import http from 'https';

const videoIds = [
  "UHFBoMT-6yc",
  "l9cVB-k66Q0",
  "4X1IcSbIOz4",
  "KqFt0Uybb90"
];

function getYoutubeTitle(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id, title: json.title });
        } catch (e) {
          resolve({ id, title: 'Error or Private Video' });
        }
      });
    }).on('error', () => {
      resolve({ id, title: 'Network Error' });
    });
  });
}

console.log('Fetching YouTube video titles via oEmbed...');
Promise.all(videoIds.map(getYoutubeTitle)).then(results => {
  results.forEach(res => {
    console.log(`ID: ${res.id} -> Title: ${res.title}`);
  });
});
