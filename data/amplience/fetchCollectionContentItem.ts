import { createAmplienceClient } from './createAmplienceClient'
import type { CollectionPage } from './types'

export async function fetchCollectionContentItem(
  slug: string,
  options: { locale?: string } = {}
): Promise<CollectionPage | undefined> {
  const locale = options.locale ?? 'en-GB'
  const client = createAmplienceClient({ locale, useUnpublishedContent: true })

  try {
    const collectionPages = await client
      .filterByContentType<CollectionPage>('https://shopstory.app/collection-page')
      // TODO: How to use it properly?!
      // .filterBy('/slug', slug)
      .request({
        format: 'inlined',
        depth: 'all'
      })

    const collectionPageBySlug = collectionPages.responses.find((response) => response.content.slug === slug)

    return collectionPageBySlug?.content
  } catch (err) {
    console.error(err)
    return
  }
}
