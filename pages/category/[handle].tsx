import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import ProductListing from '../../components/sections/ProductListing/ProductListing'
import fetchCollectionByHandle from '../../data/shopify/fetchCollectionByHandle'
import { filterCollection } from '../../data/shopify/filterCollection'
import { PLPProps } from '../../types'
import { decomposeHandle } from '../../utils/collectionsHandle'
import { fetchCollectionContentItem } from '../../data/amplience/fetchCollectionContentItem'

import compile from '@shopstory/core/dist/client/compile'
import amplienceCompilationSetup from '@shopstory/core/dist/client/amplience/compilationSetup'
import { shopstoryCompilationConfig } from '../../shopstory/shopstoryCompilationConfig'
import { amplienceParams } from '../../shopstory/shopstoryAmplienceParams'

const Page: NextPage<PLPProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.collection.title}</title>
      </Head>
      <ProductListing {...props} key={props.collection.handle} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PLPProps> = async ({ params, preview, locale }) => {
  if (!params?.handle) throw new Error('Catch all accessed without given [handle]')
  if (typeof params.handle !== 'string') throw new Error('Catch all accessed with wrong type of [handle]')

  const { handle, values } = decomposeHandle(params.handle)

  if (!handle) {
    return {
      notFound: true
    }
  }

  const collectionEntry = await fetchCollectionContentItem(handle, { locale })
  const shopifyCollectionHandle = collectionEntry?.collectionId ?? handle
  const fullCollection = await fetchCollectionByHandle(shopifyCollectionHandle)

  if (!fullCollection) {
    return {
      notFound: true
    }
  }

  const shopstoryCompiledContent = await compile(
    collectionEntry?.config.config,
    shopstoryCompilationConfig,
    amplienceCompilationSetup({ ...amplienceParams, useUnpublishedContent: true }),
    {
      locale: locale ?? 'en-GB',
      mode: 'grid'
    }
  )

  const { filters, collection, pagination, numberOfItems } = filterCollection(fullCollection, values)

  return {
    props: {
      fullCollection,
      collection,
      filters,
      pagination,
      numberOfItems,
      shopstoryCompiledContent
    },
    revalidate: 60
  }
}

export default Page
