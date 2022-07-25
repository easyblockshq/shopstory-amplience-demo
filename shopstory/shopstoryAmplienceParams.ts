if (!process.env.NEXT_PUBLIC_AMPLIENCE_HUB_NAME) {
  throw new Error('Missing NEXT_PUBLIC_AMPLIENCE_HUB_NAME environment variable')
}

if (!process.env.NEXT_PUBLIC_AMPLIENCE_STAGING_ENVIRONMENT) {
  throw new Error('Missing NEXT_PUBLIC_AMPLIENCE_STAGING_ENVIRONMENT environment variable')
}

const amplienceParams = {
  hubName: process.env.NEXT_PUBLIC_AMPLIENCE_HUB_NAME,
  stagingEnvironment: process.env.NEXT_PUBLIC_AMPLIENCE_STAGING_ENVIRONMENT
}

export { amplienceParams }
