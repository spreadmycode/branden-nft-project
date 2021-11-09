import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { CURRENT_NFT_COLLECTION_NAME, PRESALE_NFT_COLLECTION_NAME } from '../utils/constant';
import useWalletNfts from './use-wallet-nfts';

const presalePeriod = (Number(process.env.NEXT_PUBLIC_PRESALE_PERIOD) == 1);

const usePresale = () => {
  const wallet = useWallet();
  const [isLoading, nfts]: any = useWalletNfts();
  const [isPossibleMint, setIsPossibleMint] = useState(false);
  const [filterNFTCount, setFilterNFTCount] = useState(0);
  const [currentNFTCount, setCurrentNFTCount] = useState(0);
  const [possibleNFTCount, setPossibleNFTCount] = useState(0);

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

        setIsPossibleMint(false);

        if (presalePeriod) {
            let filterNFTCount = 0;
            let currentNFTCount = 0;
            for (let i = 0; i < nfts.length; i++) {
                const nft = nfts[i];
                console.log(`NFT ${i}`, nft);
                if (nft.collection?.name == PRESALE_NFT_COLLECTION_NAME) {
                    filterNFTCount++;
                }
                if (nft.collection?.name == CURRENT_NFT_COLLECTION_NAME) {
                    currentNFTCount++;
                }
            }
            if (filterNFTCount > 0) {
                if (currentNFTCount >= filterNFTCount * 2) {
                    setIsPossibleMint(false);
                } else {
                    setIsPossibleMint(true);
                }
            }

            setCurrentNFTCount(currentNFTCount);
            let possibleCount = 2 * filterNFTCount - currentNFTCount;
            if (possibleCount < 0) possibleCount = 0;
            setPossibleNFTCount(possibleCount);
            setFilterNFTCount(filterNFTCount);
        } else {
            setIsPossibleMint(true);
        }
    })();
  }, [wallet, isLoading]);

  return [isLoading, isPossibleMint, currentNFTCount, possibleNFTCount, filterNFTCount];
}

export default usePresale;