import {
    getHashedName,
    getNameAccountKey,
    NameRegistryState,
  } from '@bonfida/spl-name-service'
  import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
  
  const SOL_TLD_AUTHORITY = new PublicKey(
    '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
  )
  
  const username = "random"
  const solName = `${username}.sol`
  try {
    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    const hashedName = await getHashedName(username)
    const domainKey = await getNameAccountKey(
      hashedName,
      undefined,
      SOL_TLD_AUTHORITY
    )
    const { registry, nftOwner } = await NameRegistryState.retrieve(connection, domainKey)
    if (registry.owner !== null) {
      console.log({
        data: {
          exist: true,
          displayname: solName,
          href: `https://explorer.solana.com/address/${registry.owner.toBase58()}`,
        },
      })
    } else {
      console.log({ data: { exist: false, displayname: solName } })
    }
  } catch (error) {
    console.log('Error: ', error)
  }