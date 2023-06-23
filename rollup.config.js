const typescript = require('rollup-plugin-typescript2')
const { getBabelOutputPlugin } = require('@rollup/plugin-babel')
const fs = require('fs')
const pkg = require('./package.json')
const { join } = require('path')

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]
const tsplug = function (declaration = false) {
  return typescript({
    useTsconfigDeclarationDir: declaration,
    tsconfigOverride: { compilerOptions: { declaration } },
  })
}
const babelplug = function (runtime = true, esm = true) {
  return getBabelOutputPlugin({
    presets: ['@babel/preset-env'],
    plugins: runtime
      ? [['@babel/plugin-transform-runtime', { useESModules: esm, version: '7.10.5' }]]
      : [],
  })
}

const getFileList = dir => {
  const files = []
  fs.readdirSync(dir).forEach(ff => {
    const path = join(dir, ff)
    const isdir = fs.statSync(path).isDirectory()
    if (!isdir) return files.push(path)
    files.push(...getFileList(path))
  })
  return files
}

const files = getFileList('./src/').map(file => ({
  input: file,
  external,
  output: { file: file.replace(/^src/, 'dist').replace(/\.ts$/g, '.js'), format: 'cjs' },
  plugins: [tsplug(), babelplug(true, false)],
}))

module.exports = [...files]
