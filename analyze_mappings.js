const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, 'mappings.json'), 'utf8'));

console.log('--- WIX VIDEOS SUMMARY ---');
const uniqueVideos = {};
mappings.wixVideos.forEach(v => {
  if (v.videoId) {
    uniqueVideos[v.videoId] = v;
  }
});
console.log(`Unique video files: ${Object.keys(uniqueVideos).length}`);
Object.values(uniqueVideos).forEach(v => {
  console.log(`- Video ID: ${v.videoId}`);
  console.log(`  Width x Height: ${v.videoWidth}x${v.videoHeight}`);
  console.log(`  Qualities available: ${v.qualities.map(q => q.quality).join(', ')}`);
});

console.log('\n--- WIX IMAGES SUMMARY ---');
const uniqueImages = {};
mappings.wowImages.forEach(img => {
  if (img.imageData && img.imageData.uri) {
    uniqueImages[img.imageData.uri] = img.imageData;
  }
});
console.log(`Unique image files: ${Object.keys(uniqueImages).length}`);
Object.values(uniqueImages).slice(0, 15).forEach(img => {
  console.log(`- File URI: ${img.uri}`);
  console.log(`  Name: ${img.name || '(unnamed)'}`);
  console.log(`  Dimensions: ${img.width}x${img.height}`);
});

console.log('\n--- YOUTUBE VIDEOS ---');
console.log(mappings.youtubeIds);
