const { readdir, stat, mkdir, copyFile } = require('fs/promises');
const { join, dirname } = require('path');

async function copyModuleJsonFiles() {
  const srcModulesPath = join(__dirname, '..', 'src', 'modules');
  const distModulesPath = join(__dirname, '..', 'dist', 'modules');

  try {
    const entries = await readdir(srcModulesPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const moduleDir = join(srcModulesPath, entry.name);
      const moduleJsonPath = join(moduleDir, 'module.json');
      try {
        await stat(moduleJsonPath);
      } catch {
        // skip modules without module.json
        continue;
      }

      const targetDir = join(distModulesPath, entry.name);
      await mkdir(targetDir, { recursive: true });
      await copyFile(moduleJsonPath, join(targetDir, 'module.json'));
    }

    console.log('✅ Copied module.json files to dist/modules');
  } catch (err) {
    console.error('Failed to copy module.json files:', err);
    process.exit(1);
  }
}

copyModuleJsonFiles();

