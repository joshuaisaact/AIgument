import '@testing-library/jest-dom'
import { Storage } from 'happy-dom'

// Node 22+ defines a native `localStorage` accessor that resolves to `undefined`
// unless the process is started with `--localstorage-file`. Vitest's happy-dom
// environment shares `globalThis` with `window`, so that accessor shadows
// happy-dom's own storage and every `localStorage` call throws. Install
// happy-dom's implementation explicitly so tests behave the same on any Node.
Object.defineProperty(globalThis, 'localStorage', {
  value: new Storage(),
  configurable: true,
  writable: true,
})
