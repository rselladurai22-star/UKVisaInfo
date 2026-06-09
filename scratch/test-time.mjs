async function checkTime() {
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST' });
  const googleDateStr = response.headers.get('date');
  const googleTime = new Date(googleDateStr).getTime();
  const localTime = Date.now();
  const diffSeconds = Math.round((localTime - googleTime) / 1000);

  console.log('Google Server Time:', new Date(googleTime).toISOString());
  console.log('Local System Time: ', new Date(localTime).toISOString());
  console.log('Difference (seconds):', diffSeconds);
}

checkTime().catch(err => console.error(err));
