import type { NextPage } from 'next'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import compile from '@shopstory/core/dist/client/compile'
import amplienceCompilationSetup from '@shopstory/core/dist/client/amplience/compilationSetup'
import { shopstoryCompilationConfig } from '../shopstory/shopstoryCompilationConfig'
import { CompilationOutput } from '@shopstory/core/dist/client/types'
import Shopstory from '@shopstory/core/dist/client/Shopstory'
import { fetchHomepageContentItem } from '../data/amplience/fetchHomepageContentItem'
import { PageWrapper } from '../components/common/PageWrapper/PageWrapper'
import { amplienceParams } from '../shopstory/shopstoryAmplienceParams'

type HomeProps = {
  shopstoryCompiledContent: CompilationOutput
}

const Home: NextPage<HomeProps> = (props) => {
  return (
    <>
      <Head>
        <title>Demo store.</title>
      </Head>

      <PageWrapper>
        <Shopstory src={props.shopstoryCompiledContent} />
      </PageWrapper>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeProps, { slug: string }> = async (context) => {
  let { preview, locale = 'en-GB' } = context

  const homepageContentItem = await fetchHomepageContentItem({ locale })

  if (!homepageContentItem) {
    return { notFound: true }
  }

  const shopstoryCompiledContent = await compile(
    homepageContentItem.content.config.config,
    shopstoryCompilationConfig,
    amplienceCompilationSetup({ ...amplienceParams, useUnpublishedContent: true }),
    {
      locale
    }
  )

  return {
    props: { shopstoryCompiledContent },
    revalidate: 10
  }
}

export default Home
