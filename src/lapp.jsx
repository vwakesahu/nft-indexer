<Box w='100vw'>
	<Center>
		<Flex
			alignItems={'center'}
			justifyContent='center'
			flexDirection={'column'}>
			<Heading mb={0} fontSize={36}>
				NFT Indexer 🖼
			</Heading>
			<Text>
				Plug in an address and this website will return all of its NFTs!
			</Text>
		</Flex>
	</Center>
	<Flex
		w='100%'
		flexDirection='column'
		alignItems='center'
		justifyContent={'center'}>
		<Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
		<Input
			onChange={(e) => setUserAddress(e.target.value)}
			color='black'
			w='600px'
			textAlign='center'
			p={4}
			bgColor='white'
			fontSize={24}
		/>
		<Button fontSize={20} onClick={getNFTsForOwner} mt={36} bgColor='blue'>
			Fetch NFTs
		</Button>

		<Heading my={36}>Here are your NFTs:</Heading>

		{hasQueried ? (
			<SimpleGrid w={'90vw'} columns={4} spacing={24}>
				{results.ownedNfts.map((e, i) => {
					return (
						<Flex
							flexDir={'column'}
							color='white'
							bg='blue'
							w={'20vw'}
							key={e.id}>
							<Box>
								<b>Name:</b>{' '}
								{tokenDataObjects[i].title?.length === 0
									? 'No Name'
									: tokenDataObjects[i].title}
							</Box>
							<Image
								src={
									tokenDataObjects[i]?.rawMetadata?.image ??
									'https://via.placeholder.com/200'
								}
								alt={'Image'}
							/>
						</Flex>
					);
				})}
			</SimpleGrid>
		) : (
			'Please make a query! The query may take a few seconds...'
		)}
	</Flex>
</Box>;
