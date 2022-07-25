import { createAmplienceClient } from './createAmplienceClient'
import type { HomePage } from './types'

type FetchHomePageEntryOptions = {
  locale: string
}

export async function fetchHomepageContentItem({ locale }: FetchHomePageEntryOptions): Promise<HomePage | undefined> {
  const client = createAmplienceClient({ locale, useUnpublishedContent: true })

  try {
    const homepageContent = await client.filterByContentType<HomePage>('https://shopstory.app/homepage').request({
      depth: 'all',
      format: 'inlined'
    })

    return homepageContent.responses[0]?.content
  } catch (err) {
    return
  }
}
