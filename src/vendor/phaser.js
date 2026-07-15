import * as PhaserNamespace from 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.esm.js';

// The Phaser ESM build only provides named exports (no `default`), so wrap
// the namespace as a default export to allow `import Phaser from './vendor/phaser.js'`
// everywhere else in the codebase, matching Phaser's usual documented style.
export default PhaserNamespace;
