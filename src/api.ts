import { OpenseaAssetsAndNextCursor } from './types/OpenseaAsset';

export const OPENSEA_API_OFFSET = 50;
const OPENSEA_URL = 'https://api.opensea.io';
const ENS_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

export const resolveEnsDomain = async (
  ensDomainName: string
): Promise<string | null> => {
  const query = `
  query lookup($name: String!) {
    domains(where: { name: $name }) {
      resolvedAddress {
        id
      }
    }
  }
  `;
  const variables = { name: ensDomainName };
  try {
    const result = await fetch(ENS_GRAPH_URL, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    });
    const { data } = await result.json();
    if (!data.domains.length) {
      throw new Error(`Could not resolve ${ensDomainName} via ENS.`);
    }
    const address = data.domains[0].resolvedAddress.id;
    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchOpenseaAssets = async ({
  owner,
  cursor,
  apiKey,
  isProxyApi,
  apiUrl,
}: {
  owner: string | null;
  cursor?: string;
  apiKey?: string;
  isProxyApi?: boolean;
  apiUrl?: string;
}): Promise<OpenseaAssetsAndNextCursor> => {
  try {
    const apiUrlFinal =
      apiKey || isProxyApi
        ? `${
            apiUrl ? apiUrl : OPENSEA_URL
          }/api/v1/assets?limit=50&cursor=${cursor}${
            owner ? '&owner=' + owner : ''
          }`
        : `${apiUrl ? apiUrl : OPENSEA_URL}/api/v1/assets?${
            owner ? '&owner=' + owner : ''
          }`;
    const result = await fetch(
      apiUrlFinal,
      apiKey ? { headers: { 'X-API-KEY': apiKey } } : {}
    );
    if (result.status !== 200) {
      const error = await result.text();
      throw new Error(error);
    }
    const response = await result.json();
    const { assets, next: nextCursor } = response;

    return {
      assets,
      nextCursor,
      hasError: false,
    };
  } catch (error) {
    console.error('fetchAssets failed:', error);
    return {
      assets: [],
      nextCursor: '',
      hasError: true,
    };
  }
};
