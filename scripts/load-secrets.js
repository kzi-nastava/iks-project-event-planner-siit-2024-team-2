const fs = require('fs');
const path = require('path');

const secretsPath = path.resolve(__dirname, '../secrets/google-maps-key.json');
const envPath = path.resolve(__dirname, '../src/environments/environment.ts');

if (fs.existsSync(secretsPath)) {
  const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf-8'));
  let envContent = fs.readFileSync(envPath, 'utf-8');
  envContent = envContent.replace(
    `googleMapsApiKey: ''`,
    `googleMapsApiKey: '${secrets.googleMapsApiKey}'`
  );
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log('API Key loaded successfully.');
} else {
  console.error('Secrets file not found. Please create it at "secrets/google-maps-key.json".');
}
