import jwt from 'jsonwebtoken'
import { createApp } from '../src/app'

export const app = createApp()

export function authHeader(): string {
  const token = jwt.sign({ sub: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
  return `Bearer ${token}`
}
