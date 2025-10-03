#!/usr/bin/env node

/**
 * Living Nexus - Setup Verification Script
 * Checks that all files and dependencies are correctly installed
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Living Nexus Setup Verification\n');

// Files to check
const requiredFiles = [
  'src/app/nexus/page.js',
  'src/components/nexus/LivingNexusMap.jsx',
  'src/components/nexus/PopulationCores.jsx',
  'src/components/nexus/InfrastructureStreams.jsx',
  'src/components/nexus/ResourceWells.jsx',
  'src/components/nexus/ConnectionThread.jsx',
  'src/components/nexus/NexusController.jsx',
  'src/components/nexus/HolographicCard.jsx',
  'src/shaders/nexusShaders.js',
  'src/store/nexusStore.js',
];

// Check files
console.log('📁 Checking required files...\n');
let allFilesExist = true;

requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  
  if (!exists) allFilesExist = false;
});

console.log('');

// Check package.json dependencies
console.log('📦 Checking dependencies...\n');
const packageJson = require('./package.json');
const requiredDeps = [
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
  'three',
  'postprocessing',
  'zustand',
  'mapbox-gl',
  'framer-motion',
];

let allDepsInstalled = true;

requiredDeps.forEach((dep) => {
  const installed = packageJson.dependencies[dep];
  
  console.log(`  ${installed ? '✅' : '❌'} ${dep} ${installed ? `(${installed})` : '(NOT INSTALLED)'}`);
  
  if (!installed) allDepsInstalled = false;
});

console.log('');

// Check node_modules
console.log('📚 Checking node_modules...\n');
const nodeModulesExist = fs.existsSync(path.join(__dirname, 'node_modules'));

if (nodeModulesExist) {
  console.log('  ✅ node_modules directory exists');
} else {
  console.log('  ❌ node_modules directory missing');
  console.log('     Run: npm install');
}

console.log('');

// Final report
console.log('=' .repeat(50));
console.log('📊 VERIFICATION REPORT\n');

if (allFilesExist && allDepsInstalled && nodeModulesExist) {
  console.log('✅ ALL CHECKS PASSED!\n');
  console.log('🚀 You can now run:');
  console.log('   npm run dev');
  console.log('   Then visit: http://localhost:3000/nexus\n');
} else {
  console.log('❌ SOME CHECKS FAILED\n');
  
  if (!allFilesExist) {
    console.log('⚠️  Some files are missing. Please ensure all components are created.');
  }
  
  if (!allDepsInstalled) {
    console.log('⚠️  Some dependencies are missing. Run: npm install');
  }
  
  if (!nodeModulesExist) {
    console.log('⚠️  node_modules not found. Run: npm install');
  }
  
  console.log('');
}

console.log('=' .repeat(50));
