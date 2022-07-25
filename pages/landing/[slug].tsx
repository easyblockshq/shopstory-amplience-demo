import compile from '@shopstory/core/dist/client/compile'
import Shopstory from '@shopstory/core/dist/client/Shopstory'
import amplienceCompilationSetup from '@shopstory/core/dist/client/amplience/compilationSetup'
import type { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { PageWrapper } from '../../components/common/PageWrapper/PageWrapper'
import { fetchLandingPageContentItem } from '../../data/amplience/fetchLandingPageContentItem'
import { amplienceParams } from '../../shopstory/shopstoryAmplienceParams'
import { shopstoryCompilationConfig } from '../../shopstory/shopstoryCompilationConfig'
import { BannerSection } from '../../components/blocks/BannerSection/BannerSection'
import { LandingPage, SchemaToBlock } from '../../data/amplience/types'
import { Image } from 'dc-delivery-sdk-js'
import { ProductsGridSection } from '../../components/blocks/ProductsGridSection/ProductsGridSection'
import fetchCollectionByHandle from '../../data/shopify/fetchCollectionByHandle'
import { TwoColumnsSection } from '../../components/blocks/TwoColumnsSection/TwoColumnsSection'

type LandingPageProps = {
  blocks: Array<any>
}

const LandingPage: NextPage<LandingPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Demo store.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageWrapper>
        {/* Below we're simply rendering Shopstory compiled content */}
        {props.blocks.map((block, index) => {
          if (block.type === 'blockBanner') {
            return <BannerSection {...block.data} key={index} />
          } else if (block.type === 'blockProductsGrid') {
            return <ProductsGridSection {...block.data} key={index} />
          } else if (block.type === 'blockTwoColumns') {
            return <TwoColumnsSection {...block.data} key={index} />
          } else if (block.type === 'shopstoryBlock') {
            return <Shopstory src={block.shopstoryCompiledContent} key={index} />
          } else {
            throw new Error(`unknown block type: ${block.type}`)
          }
        })}
      </PageWrapper>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<LandingPageProps, { slug: string }> = async (context) => {
  let { params, preview, locale = 'en-GB' } = context

  if (!params) {
    return { notFound: true }
  }

  // Here we simply fetch Contentful entry of the type "Landing Page".
  const landingPageContentItem = await fetchLandingPageContentItem(params.slug, { locale })

  if (!landingPageContentItem) {
    return { notFound: true }
  }

  /**
   * Important!!! Shopstory compilation.
   *
   * This is a crucial step to integrate Shopstory but it is very simple. All you need to do is pass Shopstory-managed JSON field to the Shopstory compilation function. The returned object is "renderable".
   */

  const blocks = await Promise.all(
    landingPageContentItem.slot.blocks.map(async (block) => {
      if (isBlockOfSchemaType(block, 'https://shopstory.app/standard-banner')) {
        const imageUrl = new Image(block.image, amplienceParams).url().build()

        return {
          type: 'blockBanner',
          data: {
            title: block.title,
            description: block.description,
            image: {
              src: imageUrl
            },
            button: block.buttonLabel
              ? {
                  label: block.buttonLabel,
                  url: block.buttonLink
                }
              : null
          }
        }
      } else if (isBlockOfSchemaType(block, 'https://shopstory.app/standard-products-grid')) {
        const collection = await fetchCollectionByHandle(block.collection)

        return {
          type: 'blockProductsGrid',
          data: {
            title: block.title,
            products: collection?.products.slice(0, block.maxItems ?? 12)
          }
        }
      } else if (isBlockOfSchemaType(block, 'https://shopstory.app/standard-two-columns')) {
        return {
          type: 'blockTwoColumns',
          data: {
            leftText: block.leftText,
            rightText: block.rightText,
            button: block.buttonLabel
              ? {
                  label: block.buttonLabel,
                  url: block.buttonLink
                }
              : null
          }
        }
      } else if (isBlockOfSchemaType(block, 'https://shopstory.app/shopstory-content')) {
        const shopstoryCompiledContent = await compile(
          block.config,
          shopstoryCompilationConfig,
          amplienceCompilationSetup({ ...amplienceParams, useUnpublishedContent: true }),
          {
            locale
          }
        )

        return {
          type: 'shopstoryBlock',
          shopstoryCompiledContent
        }
      } else {
        throw new Error('Unknown block type!')
      }
    })
  )

  return {
    props: { blocks },
    revalidate: 10
  }
}

export default LandingPage

function isBlockOfSchemaType<Schema extends keyof SchemaToBlock>(
  block: LandingPage['slot']['blocks'][number],
  schema: Schema
): block is SchemaToBlock[Schema] {
  return block._meta.schema === schema
}
