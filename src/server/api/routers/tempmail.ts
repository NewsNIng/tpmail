import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { tempMailCreate, tempMailInbox } from '@/server/tempmail'

export const tempmailRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id ?? ''
    return await tempMailCreate({ userId })
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id ?? ''
    return await ctx.prisma.tempMail.findMany({
      where: { userId },
    })
  }),

  inbox: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // valid email owned by user
      const userId = ctx.session.user.id ?? ''
      const tempMail = await ctx.prisma.tempMail.findFirst({
        where: {
          userId,
          email: input.email,
        },
      })
      if (!tempMail) {
        throw new Error('Invalid email')
      }

      // get email inbox
      return await ctx.prisma.tempMailInbox.findMany({
        where: {
          to: input.email,
        },
      })

      // return await tempMailInbox({ email: input.email });
    }),

  // 刷新 inbox
  inboxRefresh: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // valid email owned by user
      const userId = ctx.session.user.id ?? ''
      const tempMail = await ctx.prisma.tempMail.findFirst({
        where: {
          userId,
          email: input.email,
        },
      })
      if (!tempMail) {
        throw new Error('Invalid email')
      }
      const inboxs = await tempMailInbox({ email: input.email })

      if (inboxs?.length) {
        for (const inbox of inboxs) {
          await ctx.prisma.tempMailInbox.upsert({
            where: { id: inbox.id },
            update: inbox,
            create: inbox,
          })
        }
      }
    }),
})
