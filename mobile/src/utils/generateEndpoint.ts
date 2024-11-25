type Params = { [key: string]: string | number }

export const generateEndpoint = (baseUrl: string, params: Params): string => {
  let endpoint = baseUrl
  const paramsEntries = Object.entries(params)

  paramsEntries.forEach(([key, value]) => {
    endpoint = endpoint.replaceAll(`:${key}`, value.toString())
  })

  return endpoint
}
