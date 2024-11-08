import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const galleryDir = path.join(__dirname, '../../public/gallery') // Adjust path based on your structure
const outputFile = path.join(__dirname, '../../public/gallery-images.json')

// Allowed image extensions
const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg']

function getImages(dir) {
  const images = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const itemPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      images.push(...getImages(itemPath))
    } else if (extensions.includes(path.extname(item.name).toLowerCase())) {
      images.push(itemPath.split('public')[1].replace(/\\/g, '/'))
    }
  }
  return images
}

const images = getImages(galleryDir)
fs.writeFileSync(outputFile, JSON.stringify(images, null, 2))
console.log('Image list generated successfully!')
