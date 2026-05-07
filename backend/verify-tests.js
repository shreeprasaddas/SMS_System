/**
 * Test Verification Script
 * Checks if testing infrastructure is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('\n================================');
console.log('SMS Backend Testing Setup Verification');
console.log('================================\n');

const requiredFiles = [
  'jest.config.js',
  'jest.setup.js',
  '__tests__/fixtures/testHelpers.js',
  '__tests__/unit/services/auth.service.test.js',
  '__tests__/unit/services/student.service.test.js',
  '__tests__/unit/services/fee.service.test.js',
  '__tests__/unit/services/attendance.service.test.js',
  '__tests__/unit/services/grade.service.test.js',
  '__tests__/unit/services/curriculum.service.test.js',
  '__tests__/unit/services/analytics.service.test.js',
  '__tests__/unit/middleware/middleware.test.js',
  '__tests__/unit/models/model.test.js',
  '__tests__/integration/api.integration.test.js',
  '__tests__/integration/database.integration.test.js',
  'TESTING.md',
  'TESTING-SETUP.md',
  'run-tests.sh',
  'run-tests.bat',
];

let filesFound = 0;
let filesMissing = 0;

console.log('Checking for test files...\n');

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file}`);
    filesFound++;
  } else {
    console.log(`❌ ${file}`);
    filesMissing++;
  }
});

console.log('\n================================');
console.log(`Files Found: ${filesFound}/${requiredFiles.length}`);
console.log(`Files Missing: ${filesMissing}/${requiredFiles.length}`);
console.log('================================\n');

// Check package.json scripts
console.log('Checking npm scripts...\n');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const requiredScripts = ['test', 'test:watch', 'test:coverage', 'test:unit', 'test:integration', 'test:debug'];

let scriptsFound = 0;
requiredScripts.forEach((script) => {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm run ${script}`);
    scriptsFound++;
  } else {
    console.log(`❌ npm run ${script}`);
  }
});

console.log('\n================================');
console.log(`Scripts Found: ${scriptsFound}/${requiredScripts.length}`);
console.log('================================\n');

// Summary
if (filesMissing === 0 && scriptsFound === requiredScripts.length) {
  console.log('✅ Testing infrastructure is properly configured!\n');
  console.log('Next steps:');
  console.log('1. npm install --save-dev jest supertest');
  console.log('2. npm test');
  console.log('3. Implement test cases\n');
} else {
  console.log('⚠️  Some components are missing.\n');
  console.log('Files missing: ' + filesMissing);
  console.log('Scripts missing: ' + (requiredScripts.length - scriptsFound) + '\n');
}

console.log('Documentation:');
console.log('- TESTING.md - Full testing guide');
console.log('- TESTING-SETUP.md - Setup summary\n');
