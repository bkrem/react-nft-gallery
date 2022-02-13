import { OpenseaAsset } from './types/OpenseaAsset';

export const OPENSEA_API_OFFSET = 50;

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
    const result = await fetch(
      'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
      { method: 'POST', body: JSON.stringify({ query, variables }) }
    );
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
  offset,
  apiKey,
}: {
  owner: string | null;
  offset: number;
  apiKey?: string;
}): Promise<OpenseaAsset[]> => {
  try {
    const apiUrl = apiKey
      ? `https://api.opensea.io/api/v1/assets?limit=50&offset=${offset}${
          owner ? '&owner=' + owner : ''
        }`
      : `https://api.opensea.io/api/v1/assets?${
          owner ? '&owner=' + owner : ''
        }`;
    const result = await fetch(
      apiUrl,
      apiKey ? { headers: { 'X-API-KEY': apiKey } } : {}
    );
    if (result.status !== 200) {
      const error = await result.text();
      throw new Error(error);
    }
    const { assets } = await result.json();
    return assets;
  } catch (error) {
    console.error('fetchAssets failed:', error);
    return [];
  }
};
