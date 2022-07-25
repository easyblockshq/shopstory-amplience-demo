import amplienceCms from '@shopstory/core/dist/client/amplience/cms'
import Launcher from '@shopstory/core/dist/client/Launcher'
import { shopstoryEditorConfig } from '../shopstory/shopstoryEditorConfig'

/**
 * This is Shopstory "canvas page".
 *
 * When you open Shopstory editor in Contentful, this page is used as "canvas" for rendering content.
 *
 */
function ShopstoryEditorPage() {
  return <Launcher editorConfig={shopstoryEditorConfig} cms={amplienceCms()} />
}

export async function getStaticProps() {
  return {
    props: {
      noHeaderAndFooter: true
    }
  }
}

export default ShopstoryEditorPage
