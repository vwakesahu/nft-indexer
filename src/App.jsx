import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Container,
  extendTheme,
  ChakraProvider,
  Card,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
const customTheme = extendTheme({
  colors: {
    background: "#0B2447",
    cardColor: "#19376D",
    btnColor: "#576CBC",
    secondary: "#A5D7E8",
    bghover: "rgba(0, 0, 0, 0.1)",
  },

  shadows: {
    xs: "0 0 5px rgba(255, 0, 0, 0.5)",
    sm: "0 1px 2px rgba(0, 255, 0, 0.5)",
    base: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
    md: "0 8px 6px rgba(255, 0, 255, 0.5)",
    lg: "0 10px 15px rgba(255, 255, 0, 0.5)",
    xl: "0 20px 25px rgba(0, 255, 255, 0.5)",
    "2xl": "0 25px 50px rgba(255, 255, 255, 0.5)",
    "dark-lg": "0 20px 25px rgba(0, 0, 0, 0.5)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)",
  },
});

function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const toast = useToast();
  const { wallets } = useWallets();
  const w0 = wallets[0];

  useEffect(() => {
    if (ready && w0.address !== undefined && authenticated) {
      setUserAddress(w0.address);
    }
    if (!authenticated & ready) setUserAddress("");
  }, [w0]);

  async function getNFTsForOwner() {
    if (userAddress === "") {
      setShowError(true);
    } else {
      setShowError(false);
      setIsLoading(true);
      try {
        const config = {
          apiKey: import.meta.env.VITE_API_KEY,
          network: Network.ETH_MAINNET,
        };

        const alchemy = new Alchemy(config);
        const data = await alchemy.nft.getNftsForOwner(userAddress);
        setResults(data);

        const tokenDataPromises = [];

        for (let i = 0; i < data.ownedNfts.length; i++) {
          const tokenData = alchemy.nft.getNftMetadata(
            data.ownedNfts[i].contract.address,
            data.ownedNfts[i].tokenId
          );
          tokenDataPromises.push(tokenData);
        }

        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log("Failed to fetch data:", error);
        setIsLoading(false);
        toast({
          title: "An error occurred",
          description: " Alchemy API Request Failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }
  return (
    <ChakraProvider theme={customTheme}>
      <Box minHeight="100vh" w="100vw" bgColor="white">
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          height="50px"
          pt={5}
          px={3}
        >
          {authenticated ? (
            <Button
              bgColor="red"
              size="md"
              onClick={logout}
              focusBorderColor="none"
              color="white"
              _hover={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              {w0?.address?.slice(0, 8) + "...."}
            </Button>
          ) : (
            <Button
              bgColor="black"
              size="md"
              onClick={login}
              focusBorderColor="none"
              color="white"
              _hover={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              Connect
            </Button>
          )}
        </Box>
        <Center flexDirection={"column"} h={"75vh"}>
          <Flex
            alignItems={"center"}
            justifyContent="center"
            flexDirection={"column"}
            px={10}
            textAlign={"center"}
          >
            <Heading mb={0} fontSize={48} color="black">
              NFT Scout
            </Heading>
            <Text color="gray">
              Plug in an address and this website will return all of its NFTs!
            </Text>
          </Flex>
          <Box w="100%" mt={10}>
            <Center>
              <Flex flexDirection={"column"}>
                {showError && (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error:</AlertTitle>
                    Please enter an address
                  </Alert>
                )}
                <Input
                  color="black"
                  textAlign="center"
                  onChange={(e) => setUserAddress(e.target.value)}
                  p={4}
                  bgColor="white"
                  fontSize={24}
                  value={userAddress}
                  width={{ sm: "100%", md: "900px", lg: "900px" }}
                  size="lg"
                  mb={19}
                  placeholder="Enter an address"
                />

                <Button
                  fontSize={20}
                  shadow={"base"}
                  onClick={getNFTsForOwner}
                  mt={10}
                  bgColor="white"
                  color="black"
                  display={"block"}
                  width="350px"
                  textAlign={"center"}
                  size={"lg"}
                  m={"auto"}
                  _hover={{
                    backgroundColor: "bghover",
                  }}
                >
                  Fetch NFTs
                </Button>
              </Flex>
            </Center>
          </Box>
        </Center>
        <Box>
          {isLoading ? (
            <Center>
              <Oval
                height={80}
                width={80}
                color="#A5D7E8"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#A5D7E8"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </Center>
          ) : hasQueried ? (
            <Box px={10}>
              <Heading my={25} color="black" fontSize={28} textAlign={"center"}>
                Your NFTs
              </Heading>
              <SimpleGrid
                columns={4}
                spacingX={9}
                spacingY={8}
                minChildWidth="230px"
              >
                {results.ownedNfts.length === 0 ? (
                  <Box pb={"150px"}>
                    <Text color="red" fontSize={25} textAlign={"center"}>
                      You don't have any NFT!
                    </Text>
                  </Box>
                ) : (
                  results.ownedNfts.map((e, i) => {
                    return (
                      <Box position="relative">
                        <Box
                          position="absolute"
                          top={0}
                          right={0}
                          bottom={0}
                          left={0}
                          bg="rgba(0, 0, 0, 0.5)"
                          borderRadius={20}
                        />
                        <Image
                          src={tokenDataObjects[i].rawMetadata.image}
                          alt="Example Image"
                          w="321px"
                          h="321px"
                          borderRadius={20}
                          cursor={"pointer"}
                          fallbackSrc="https://via.placeholder.com/321"
                        />
                        <Text
                          position="absolute"
                          bottom="0"
                          color="white"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          width="100%"
                          padding="1rem"
                        >
                          {tokenDataObjects[i].title.length === 0
                            ? "No Name"
                            : tokenDataObjects[i].title}
                        </Text>
                      </Box>
                    );
                  })
                )}
              </SimpleGrid>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
