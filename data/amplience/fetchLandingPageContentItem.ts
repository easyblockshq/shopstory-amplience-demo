import { createAmplienceClient } from './createAmplienceClient'
import type { LandingPage } from './types'

export async function fetchLandingPageContentItem(
  slug: string,
  options: { locale?: string } = {}
): Promise<LandingPage | undefined> {
  const locale = options.locale ?? 'en-US'

  const client = createAmplienceClient({ locale, useUnpublishedContent: true })

  try {
    const landingPageContentItems = await client
      .filterByContentType<LandingPage>('https://shopstory.app/landing-page')
      .request({
        format: 'inlined',
        depth: 'all'
      })

    return landingPageContentItems.responses.find((response) => response.content.slug === slug)?.content
  } catch (err) {
    return
  }
}
