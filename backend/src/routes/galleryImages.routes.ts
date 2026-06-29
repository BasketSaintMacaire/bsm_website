import { Router } from 'express'
import { minioClient } from '../minio'
import { env } from '../env'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

// Same flat-array-of-paths shape the old build-time gallery-images.json scanner produced.
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const paths: string[] = []
    const stream = minioClient.listObjectsV2(env.MINIO_BUCKET, 'gallery/', true)
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) paths.push(`/${obj.name}`)
      })
      stream.on('end', () => resolve())
      stream.on('error', reject)
    })
    res.json(paths)
  }),
)

export default router
