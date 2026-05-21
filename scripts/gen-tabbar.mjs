import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../src/static/tabbar')
fs.mkdirSync(outDir, { recursive: true })

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

const names = [
  'home', 'home-active',
  'catalog', 'catalog-active',
  'cart', 'cart-active',
  'order', 'order-active',
  'user', 'user-active',
  'buy', 'buy-active',
  'wealth', 'wealth-active',
]

for (const name of names) {
  fs.writeFileSync(path.join(outDir, `${name}.png`), PNG)
}
console.log('Tabbar icons:', outDir)
