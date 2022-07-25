/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-GB', 'de'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-GB'
  },
  images: {
    domains: ['cdn.media.amplience.net', 'kcdz62c7ygpi1th4bzrptv6z4.staging.bigcontent.io']
  }
}

module.exports = nextConfig
