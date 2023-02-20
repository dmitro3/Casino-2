const { getOrCreateAssociatedTokenAccount, createTransferInstruction } = require("@solana/spl-token");
const { Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } = require("@solana/web3.js");
const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, Nft, Sft, toBigNumber } = require("@metaplex-foundation/js");
const bs58 = require("bs58");
const fs = require('fs');
const { nftStorage } = require("@metaplex-foundation/js-plugin-nft-storage");

const NFTList = require("../HashList.json");
const HouseEdge = require("../models/houseEdgeModel");

const log4js = require("log4js");
const NewNFT = require("../models/newNFTModel");
log4js.configure({
  appenders: { log4js: { type: "file", filename: "/home/jenkins/backend5.log" } },
  categories: { default: { appenders: ["log4js"], level: "ALL" } }
});

const logger = log4js.getLogger("default");

const SOLANA_CONNECTION = new Connection(process.env.QUICK_NODE);
// const WALLET = Keypair.fromSecretKey(new Uint8Array(bs58.decode(process.env.ADMIN_PRIV_KEY)));
const WALLET = Keypair.fromSecretKey(new Uint8Array(bs58.decode(process.env.CREATOR_PRIV_KEY)));
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: process.env.QUICK_NODE,
    timeout: 60000,
  }))
  .use(nftStorage());

const NEW_METADATA = {
  uploadPath: "uploads/",
  imgType: 'image/png',
  imgName: 'test',
  symbol: "TTT",
  description: 'This is only for mint test',
  seller_fee_basis_points: 500,
  external_url: "https://test.mint",
  attributes:
    [
      { trait_type: 'Background', value: 'Test Background' },
      { trait_type: 'Clothing', value: 'Test Cloth' },
      { trait_type: 'Eyes', value: 'Test Colored Eye' },
      { trait_type: 'Mouth', value: 'Test Mouth' },
      { trait_type: 'Head', value: 'Test Head' },
      { trait_type: 'Hand', value: 'Test Hand' },
    ],

  collectionName: "TEST",
  collectionFamily: "Turtles",
};

const uploadImage = async (filePath, fileName) => {
  console.log(`Step 1 - Uploading Image`);
  logger.info(`Step 1 - Uploading Image`);
  const imgBuffer = fs.readFileSync(filePath + `${fileName}.png`);
  const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
  const imgUri = await METAPLEX
    .storage()
    .upload(imgMetaplexFile);
  console.log(`   Image URI:`, imgUri);
  logger.info(`   Image URI:`, imgUri);
  return imgUri;
}

const uploadMetadata = async (
  nftName,
  symbol,
  description,
  seller_fee_basis_points,
  external_url,
  attributes,
  collectionName,
  collectionFamily,
  imgUri,
  imgType,
) => {
  console.log(`   Step 2 - Uploading New MetaData ${imgUri}`);
  logger.info(`   Step 2 - Uploading New MetaData ${imgUri}`);
  let uri
  while (1) {
    try {
      uri = await METAPLEX
        .nfts()
        .uploadMetadata({
          name: nftName,
          symbol: symbol,
          description: description,
          seller_fee_basis_points: seller_fee_basis_points,
          external_url: external_url,
          attributes: attributes,
          collection: {
            name: collectionName,
            family: collectionFamily
          },
          image: imgUri,
          properties: {
            files: [
              {
                type: imgType,
                uri: imgUri,
              },
            ]
          }

        });
        break;
    } catch (err) {
      console.log("error while uploading data", err)
      logger.debug("error while uploading data", err)
    }
  }
  console.log('       Metadata URI:', uri.uri);
  logger.info('       Metadata URI:', uri.uri);
  return uri.uri;
}

const mintNft = async (metadataUri, name, sellerFee, symbol, creators) => {
  console.log(`Step 3 - Minting NFT`);
  logger.info(`Step 3 - Minting NFT`);
  console.log(`   meadataUri => ${metadataUri}, name => ${name}, sellerFee => ${sellerFee}, symbol => ${symbol}, creators => ${creators}`)
  const { nft } = await METAPLEX
    .nfts()
    .create({
      uri: metadataUri,
      name: name,
      sellerFeeBasisPoints: sellerFee,
      symbol: symbol,
      creators: creators,
      isMutable: true,
      maxSupply: toBigNumber(1),
    },
      { commitment: "finalized" }
    );
  console.log(`   Success!🎉`);
  console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}`);
  logger.info(`   Minted NFT: https://explorer.solana.com/address/${nft.address}`);
  return nft.address;
}

const getNumberDecimals = async (mintAddress) => {
  const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(mintAddress));
  const result = (info.value?.data).parsed.info.decimals;
  return result;
}

const transferNFT = async (walletAddress, nftAddress) => {
  const DESTINATION_WALLET = walletAddress;
  const MINT_ADDRESS = nftAddress; //You must change this value!
  const TRANSFER_AMOUNT = 1;
  console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(WALLET.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
  logger.info(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(WALLET.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
  //Step 1
  console.log(`1 - Getting Source Token Account`);
  logger.info(`1 - Getting Source Token Account`);
  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    SOLANA_CONNECTION,
    WALLET,
    new PublicKey(MINT_ADDRESS),
    WALLET.publicKey
  );
  console.log(`    Source Account: ${sourceAccount.address.toString()}`);

  //Step 2
  console.log(`2 - Getting Destination Token Account`);
  logger.info(`2 - Getting Destination Token Account`);
  let destinationAccount;
  while (1) {
    try {
      destinationAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION,
        WALLET,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET)
      );
      console.log(`    Destination Account: ${destinationAccount.address.toString()}`);
      break;
    } catch (err) {
      logger.debug("Error on get destination account", err)
      console.log("Error on get destination account", err)
    }
  }
  //Step 3
  console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
  logger.info(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
  const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
  console.log(`    Number of Decimals: ${numberDecimals}`);

  //Step 4
  console.log(`4 - Creating and Sending Transaction`);
  logger.info(`4 - Creating and Sending Transaction`);
  const tx = new Transaction();
  tx.add(createTransferInstruction(
    sourceAccount.address,
    destinationAccount.address,
    WALLET.publicKey,
    TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
  ))

  const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');
  tx.recentBlockhash = await latestBlockHash.blockhash;
  const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [WALLET]);
  console.log(
    '\x1b[32m', //Green Text
    `   Transaction Success!🎉`,
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
  logger.info(`===Mint NFT succeed===`)
}

const mint = async (walletAddress) => {
  for (let i = 1; i < 2; i++) {
    const houseEdgeData = await HouseEdge.find({});
    let remain = houseEdgeData[0].remainedNFT;
    if (remain > 0) {
      //Step 1 - Fetch existing NFT
      const imgUri = await uploadImage(NEW_METADATA.uploadPath, NEW_METADATA.imgName);

      //Step 2 - Upload Metadata
      const newUri = await uploadMetadata(
        NEW_METADATA.imgName,
        NEW_METADATA.symbol,
        NEW_METADATA.description,
        NEW_METADATA.seller_fee_basis_points,
        NEW_METADATA.external_url,
        NEW_METADATA.attributes,
        NEW_METADATA.collectionName,
        NEW_METADATA.collectionFamily,
        imgUri,
        NEW_METADATA.imgType,
      );

      //Step 3 - Mint new NFT
      const nftAddress = await mintNft(newUri, NEW_METADATA.imgName, NEW_METADATA.seller_fee_basis_points, NEW_METADATA.symbol, [{ address: WALLET.publicKey, share: 100 }]);
      // const nftAddress = "EKa8e5JAk2WJXb78m6zsjvWWpFxeLKbcChah8puvYMZV"

      //Step 4 - Transfer to user
      transferNFT(walletAddress, nftAddress);

      remain -= 1;
      const update = {
        $set: {
          remainedNFT: remain
        }
      }
      const options = { $upsert: true }
      await HouseEdge.findOneAndUpdate({}, update, options);
      const newNFT = new NewNFT({
        NFTAddress: nftAddress,
        date: Date.now()
      });
      newNFT.save();
    }
    console.log("=====Success !🎉=====", i)
    logger.info(`===New NFT minted successfully by ${walletAddress}===`)
    return true
  }
}

module.exports = {
  mint,
  transferNFT
}