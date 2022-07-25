import React from 'react'
import { Button } from '../components/common/Button/Button'
import Link from 'next/link'
import ProductCard from '../components/common/ProductCard/ProductCard'
import { ShopstoryProvider } from '@shopstory/core/dist/client/Shopstory'

const ShopstoryButton = React.forwardRef(({ label, ...restProps }: any, ref) => {
  const { traceId, traceClicks, traceImpressions, ...buttonProps } = restProps
  return <Button {...buttonProps}>{label}</Button>
})

ShopstoryButton.displayName = 'ShopstoryButton'

/**
 * Shopstory allows for custom "link actions". Here we define a link wrapper for next/link.
 */
function NextLinkProvider({ Component, componentProps, values }: any) {
  const { traceId, traceClicks, traceImpressions, ...restProps } = componentProps

  return (
    <Link href={values.pagePath} passHref={true}>
      <Component {...restProps} />
    </Link>
  )
}

export const MyShopstoryProvider: React.FC<{}> = ({ children }) => {
  return (
    <ShopstoryProvider
      components={{
        ProductCard,
        Button: ShopstoryButton
      }}
      links={{
        MyLink: NextLinkProvider
      }}
    >
      {children}
    </ShopstoryProvider>
  )
}
