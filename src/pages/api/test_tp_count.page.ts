import { prisma } from '@/server/db'

export default async function handler(req: any, res: any) {
  const count = await prisma.tempMail.count()
  res.status(200).json({ count })
}
