import { ContentClient } from 'dc-delivery-sdk-js'
import { amplienceParams } from '../../shopstory/shopstoryAmplienceParams'

export function createAmplienceClient({
  locale,
  useUnpublishedContent
}: {
  locale: string
  useUnpublishedContent?: boolean
}) {
  const amplienceClient = new ContentClient({
    hubName: amplienceParams.hubName,
    stagingEnvironment: useUnpublishedContent ? amplienceParams.stagingEnvironment : undefined,
    locale
  })

  return amplienceClient
}
