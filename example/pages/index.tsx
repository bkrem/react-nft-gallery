import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { NftGallery } from 'react-nft-gallery';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';

const Home: NextPage = () => {
  const [wcProvider, setWcProvider] = useState<WalletConnectProvider>();
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider>();
  const [walletAddr, setWalletAddr] = useState<string>();

  const connectWallet = async () => {
    try {
      //  Enable session (triggers QR Code modal)
      const wc = new WalletConnectProvider({
        infuraId: '0fb70b3861104a29bb2f497a45cb34eb',
      });
      setWcProvider(wc);
      setWeb3Provider(new providers.Web3Provider(wc));
      await wc.enable();
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = async () => {
    await wcProvider?.disconnect();
  };

  const onReset = () => {
    setWcProvider(undefined);
    setWeb3Provider(undefined);
    setWalletAddr(undefined);
  };

  useEffect(() => {
    const getWalletAddr = async () => {
      const accounts = await web3Provider?.listAccounts();
      console.log(accounts);

      if (accounts?.[0] && accounts[0] !== walletAddr) {
        setWalletAddr(accounts[0]);
      }
    };

    if (web3Provider) {
      // web3Provider.on('accountsChanged', (accounts: string[]) => {
      //   console.log('accountsChanged: ', accounts);
      // });
      getWalletAddr();
    }
  }, [web3Provider, walletAddr]);

  const hasWalletAddr = typeof walletAddr === 'string';

  return (
    <div>
      <Head>
        <title>react-nft-gallery</title>
        <meta
          name="description"
          content="Demo application for react-nft-gallery"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading as="h1" textAlign="center">
          🖼 react-nft-gallery
        </Heading>
        {hasWalletAddr && (
          <VStack alignItems="flex-end" p="8">
            <Button variant="outline">
              Wallet: {walletAddr!.length ? walletAddr : '<none>'}
            </Button>
            <Button onClick={onReset}>Change Wallet</Button>
            {web3Provider && (
              <Button
                onClick={() => {
                  disconnectWallet();
                  onReset();
                }}
              >
                Disconnect Wallet
              </Button>
            )}
          </VStack>
        )}

        {hasWalletAddr ? (
          <NftGallery ownerAddress={walletAddr!} darkMode />
        ) : (
          <VStack
            maxWidth="33%"
            height="100vh"
            margin="auto"
            justifyContent="center"
            alignItems="center"
            spacing="6"
          >
            <Button onClick={connectWallet} px="6">
              <Image
                src="/walletconnect-logo.svg"
                alt="WalletConnect Logo"
                height="4"
                pr="2"
              />
              Connect Wallet
            </Button>
            <span>OR</span>
            <Input
              placeholder="Enter ETH address (0x...) or ENS domain (vitalik.eth)"
              onChange={debounce(
                (evt) => setWalletAddr(evt.target.value),
                1000
              )}
            />
            <span>OR</span>
            <Button onClick={() => setWalletAddr('')}>See Latest Mints</Button>
          </VStack>
        )}
      </main>
    </div>
  );
};

export default Home;
