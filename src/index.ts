import { PublicKey } from '@solana/web3.js';

export * from './gem-bank';
export * from './gem-farm';
export * from './gem-common';

export const GEM_BANK_PROG_ID = new PublicKey(
  'GDAKvxLZkCRwq1RfypRZtMXaYJCLeBytJHESgzEMC2SL'
);
export const GEM_FARM_PROG_ID = new PublicKey(
  '35Yh7myS5thCSTiySvcTcsRXAPfw1dddDjuQsA8MvKXt'
);
