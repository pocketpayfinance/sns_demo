import { Connection, PublicKey } from "@solana/web3.js";
import { getSolRecord } from "./record";
import { getDomainKey } from "./utils";
import { NameRegistryState } from "./NewFile";
import { sign } from "tweetnacl";
import { Record } from "./types/record";

/**
 * This function can be used to verify the validity of a SOL record
 * @param record The record data to verify
 * @param signedRecord The signed data
 * @param pubkey The public key of the signer
 * @returns
 */
export const checkSolRecord = (
  record: Uint8Array,
  signedRecord: Uint8Array,
  pubkey: PublicKey
) => {
  return sign.detached.verify(record, signedRecord, pubkey.toBytes());
};

/**
 * This function can be used to resolve a domain name to transfer funds
 * @param connection The Solana RPC connection object
 * @param domain The domain to resolve
 * @returns
 */
export const resolve = async (connection: Connection, domain: string) => {
  const { pubkey } = await getDomainKey(domain);

  console.log(pubkey.toBase58() , "resolve pubkey")

  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    pubkey
  );

  console.log(registry , "registry")
  console.log(nftOwner , "nftOwner")

  if (nftOwner) {
    return nftOwner;
  }

  try {
    const recordKey = await getDomainKey(Record.SOL + "." + domain, true);
    console.log(recordKey.pubkey.toBase58() , "recordKey")

    const solRecord = await getSolRecord(connection, domain);
    console.log(solRecord , "solRecord")

    if (solRecord.data?.length !== 96) {
      throw new Error("Invalid SOL record data");
    }

    const encoder = new TextEncoder();
    const expectedBuffer = Buffer.concat([
      solRecord.data.slice(0, 32),
      recordKey.pubkey.toBuffer(),
    ]);
    const expected = encoder.encode(expectedBuffer.toString("hex"));

    const valid = checkSolRecord(
      expected,
      solRecord.data.slice(32),
      registry.owner
    );

    if (!valid) {
      throw new Error("Signature invalid");
    }

    return new PublicKey(solRecord.data.slice(0, 32));
  } catch (err) {
    console.log(err);
  }

  return registry.owner;
};