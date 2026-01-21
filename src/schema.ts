import { defineArrayMember, defineField, defineType } from '@sanity/types'

export const schema = defineType({
  type: 'array',
  name: 'content',
  of: [
    defineArrayMember({
      type: 'block',
      of: [
        defineField({
          type: 'object',
          name: 'inlineTicker',
          fields: [
            defineField({
              type: 'string',
              name: 'symbol',
            }),
          ],
        }),
      ],
    }),
  ],
})
