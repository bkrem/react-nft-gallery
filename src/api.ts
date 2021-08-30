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

export const fetchOpenseaAssets = async (
  owner: string | null,
  offset = 0
): Promise<OpenseaAsset[]> => {
  try {
    const result = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${owner}&limit=50&offset=${offset}`
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
