import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { getNftsForOwner } from '../utils/candy-machine';
import { useMutation, gql } from '@apollo/client';

const InsertMintMutation = gql`
  mutation InsertMintMutation($pubkey: String, $mint: String) {
    insertMint(input: { pubkey: $pubkey, mint: $mint }) {
      mint {
          id
          pubkey
          mint
      }
    }
  }
`;

const GetPubkeyMutation = gql`
  mutation GetPubkeyMutation($mint: String) {
    getPubkey(input: { mint: $mint}) {
        pubkey
    }
  }
`;

const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const useWalletNfts = () => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [insertMint] = useMutation(InsertMintMutation);
  const [getPubkey] = useMutation(GetPubkeyMutation);

  const [nfts, setNfts] = useState<Array<any>>([])

  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return;
      }

      setIsLoading(true);

      const nftsForOwner = await getNftsForOwner(connection, wallet.publicKey);
      let nfts = [];

      for (let i = 0; i < nftsForOwner.length; i++) {
        const nft = nftsForOwner[i];
        const getPubkeyMut = await getPubkey({variables: { mint: nft.mint }});
        const pubkey = getPubkeyMut.data.getPubkey.pubkey;
        
        if (pubkey == '') {
          await insertMint({variables: {pubkey: wallet.publicKey.toBase58(), mint: nft.mint}});
          nfts.push(nft);
        } else {
          if (pubkey == wallet.publicKey.toBase58()) {
            nfts.push(nft);
          }
        }
      }

      setNfts(nftsForOwner as any);
      setIsLoading(false);
    })();
  }, [wallet])

  return [isLoading, nfts];
}

export default useWalletNfts;