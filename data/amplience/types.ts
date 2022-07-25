import type { ConfigComponent } from '@shopstory/core/dist/types'
import type { ContentBody, Media } from 'dc-delivery-sdk-js'

interface ShopstoryContent extends ContentBody {
  config: ConfigComponent
}

interface HomePage extends ContentBody {
  content: { config: ShopstoryContent }
}

interface CollectionPage extends ContentBody {
  slug: string
  collectionId: string
  config: ShopstoryContent
}

interface StandardBanner extends ContentBody {
  title: string
  description?: string
  image: Media
  buttonLabel?: string
  buttonLink?: string
}

interface StandardProductsGrid extends ContentBody {
  title: string
  collection: string
  maxItems: number
}

interface StandardTwoColumns extends ContentBody {
  leftText: string
  rightText?: string
  buttonLabel?: string
  buttonLink?: string
}

type SchemaToBlock = {
  'https://shopstory.app/standard-banner': StandardBanner
  'https://shopstory.app/standard-products-grid': StandardProductsGrid
  'https://shopstory.app/standard-two-columns': StandardTwoColumns
  'https://shopstory.app/shopstory-content': ShopstoryContent
}

interface LandingPage extends ContentBody {
  slug: string
  blocks: Array<ShopstoryContent | StandardBanner | StandardProductsGrid | StandardTwoColumns>
}

export type { CollectionPage, HomePage, LandingPage, SchemaToBlock }
