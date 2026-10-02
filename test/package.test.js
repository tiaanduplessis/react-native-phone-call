const assert = require('node:assert/strict')
const { execFileSync, spawnSync } = require('node:child_process')
const { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join, resolve } = require('node:path')
const { after, before, test } = require('node:test')
const { SourceTextModule, SyntheticModule } = require('node:vm')

const root = resolve(__dirname, '..')
let temporaryDirectory
let packageDirectory
let tarballFiles

before(() => {
  temporaryDirectory = mkdtempSync(join(tmpdir(), 'phone-call-test-'))
  const output = execFileSync('npm', [
    'pack', '--ignore-scripts', '--json', '--pack-destination', temporaryDirectory
  ], {
    cwd: root,
    env: { ...process.env, npm_config_cache: join(temporaryDirectory, 'npm-cache') },
    encoding: 'utf8'
  })
  const [{ filename }] = JSON.parse(output)
  const tarball = join(temporaryDirectory, filename)
  tarballFiles = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' })
    .trim().split('\n').sort()
  packageDirectory = join(temporaryDirectory, 'node_modules', 'react-native-phone-call')
  mkdirSync(packageDirectory, { recursive: true })
  execFileSync('tar', ['-xzf', tarball, '--strip-components=1', '-C', packageDirectory])
})

after(() => {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true })
})

test('the tarball contains the runtime, declared types and package metadata', () => {
  assert.deepEqual(tarballFiles, [
    'package/LICENSE',
    'package/README.md',
    'package/index.d.ts',
    'package/index.js',
    'package/package.json'
  ].sort())
  const manifest = JSON.parse(readFileSync(join(packageDirectory, 'package.json'), 'utf8'))
  assert.equal(manifest.main, 'index.js')
  assert.equal(manifest.module, manifest.main)
  assert.equal(manifest.types, 'index.d.ts')
  assert.ok(tarballFiles.includes(`package/${manifest.main}`))
  assert.ok(tarballFiles.includes(`package/${manifest.types}`))
})

test('a strict TypeScript consumer resolves and checks the packed declaration', () => {
  copyFileSync(join(__dirname, 'fixtures', 'consumer.ts'), join(temporaryDirectory, 'consumer.ts'))
  const result = spawnSync(process.execPath, [
    require.resolve('typescript/bin/tsc'),
    '--strict', '--noEmit', '--target', 'ES2020',
    '--module', 'commonjs', '--moduleResolution', 'node', 'consumer.ts'
  ], { cwd: temporaryDirectory, encoding: 'utf8' })
  assert.equal(result.status, 0, result.error ? result.error.message : result.stdout + result.stderr)
})

// Link the actual packed ES module to a mock, without rewriting its source or
// loading React Native. No device APIs or phone calls run during these tests.
async function loadCall (os = 'ios', overrides = {}) {
  const checked = []
  const opened = []
  const Linking = {
    canOpenURL: async url => { checked.push(url); return true },
    openURL: async url => { opened.push(url) },
    ...overrides
  }
  const reactNative = new SyntheticModule(['Platform', 'Linking'], function () {
    this.setExport('Platform', { OS: os })
    this.setExport('Linking', Linking)
  })
  const runtime = new SourceTextModule(readFileSync(join(packageDirectory, 'index.js'), 'utf8'))
  await runtime.link(specifier => {
    assert.equal(specifier, 'react-native')
    return reactNative
  })
  await runtime.evaluate()
  return { call: runtime.namespace.default, checked, opened }
}

test('the required number and default options return a promise and prompt on iOS', async () => {
  const { call, checked, opened } = await loadCall()
  const result = call({ number: '1234567890' })
  assert.ok(result instanceof Promise)
  assert.equal(await result, undefined)
  assert.deepEqual(checked, ['telprompt:1234567890'])
  assert.deepEqual(opened, checked)
})

test('prompt=false and Android use the tel scheme', async () => {
  for (const [os, prompt] of [['ios', false], ['android', true]]) {
    const { call, checked, opened } = await loadCall(os)
    await call({ number: '123,,,4', prompt })
    assert.deepEqual(checked, ['tel:123,,,4'])
    assert.deepEqual(opened, checked)
  }
})

test('skipCanOpen=true bypasses the availability check', async () => {
  const { call, checked, opened } = await loadCall()
  await call({ number: '1234567890', prompt: false, skipCanOpen: true })
  assert.deepEqual(checked, [])
  assert.deepEqual(opened, ['tel:1234567890'])
})

test('invalid arguments reject without calling native APIs', async () => {
  const { call, checked, opened } = await loadCall()
  for (const [args, message] of [
    [undefined, 'no number provided'],
    [{}, 'no number provided'],
    [{ number: '' }, 'no number provided'],
    [{ number: 123 }, 'number should be string'],
    [{ number: '123', prompt: 'yes' }, 'prompt should be boolean'],
    [{ number: '123', skipCanOpen: 'yes' }, 'skipCanOpen should be boolean']
  ]) {
    const result = call(args)
    assert.ok(result instanceof Promise)
    await assert.rejects(result, { message })
  }
  assert.deepEqual(checked, [])
  assert.deepEqual(opened, [])
})

test('unavailable numbers reject without opening a URL', async () => {
  const { call, opened } = await loadCall('ios', { canOpenURL: async () => false })
  await assert.rejects(call({ number: '123' }), { message: 'invalid URL provided: telprompt:123' })
  assert.deepEqual(opened, [])
})

test('native availability and opening failures propagate to callers', async () => {
  const error = new Error('native API failed')
  for (const overrides of [
    { canOpenURL: async () => { throw error } },
    { openURL: async () => { throw error } }
  ]) {
    const { call } = await loadCall('ios', overrides)
    await assert.rejects(call({ number: '123' }), failure => failure === error)
  }
})
