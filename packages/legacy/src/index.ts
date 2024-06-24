// import { ContractSpec, Address } from '@stellar/stellar-sdk';
// import { Buffer } from "buffer";
// import {
//   AssembledTransaction,
//   ContractClient,
//   ContractClientOptions,
// } from '@stellar/stellar-sdk/lib/contract_client/index.js';
// import type {
//   u32,
//   i32,
//   u64,
//   i64,
//   u128,
//   i128,
//   u256,
//   i256,
//   Option,
//   Typepoint,
//   Duration,
// } from '@stellar/stellar-sdk/lib/contract_client';
// import { Result } from '@stellar/stellar-sdk/lib/rust_types/index.js';
// export * from '@stellar/stellar-sdk'
// export * from '@stellar/stellar-sdk/lib/contract_client/index.js'
// export * from '@stellar/stellar-sdk/lib/rust_types/index.js'

// if (typeof window !== 'undefined') {
//     //@ts-ignore Buffer exists
//     window.Buffer = window.Buffer || Buffer;
// }


// export const networks = {
//   testnet: {
//     networkPassphrase: "Test SDF Network ; September 2015",
//     contractId: "CB4M3SUWJVARQO4TB35VC2V3KRCRQQA2B4LTAPUJSENZG4NAQOCQKT5G",
//   }
// } as const


// export interface Benificary {
//   benificary: string;
//   token: string;
//   value: i128;
// }


// export interface BenificaryStorage {
//   benificary: string;
//   claimed: boolean;
//   token: string;
//   value: i128;
// }


// export interface Admin {
//   admins: Array<Buffer>;
// }


// export interface Asset {
//   claimed: boolean;
//   from: string;
//   token: string;
//   value: i128;
// }

// export const Errors = {
  
// }

// export interface Client {
//   /**
//    * Construct and simulate a add_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
//    */
//   add_admin: ({admin_adress}: {admin_adress: Buffer}, options?: {
//     /**
//      * The fee to pay for the transaction. Default: BASE_FEE
//      */
//     fee?: number;

//     /**
//      * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
//      */
//     timeoutInSeconds?: number;

//     /**
//      * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
//      */
//     simulate?: boolean;
//   }) => Promise<AssembledTransaction<null>>

//   /**
//    * Construct and simulate a add_multiple_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
//    */
//   add_multiple_asset: ({data, from}: {data: Array<Benificary>, from: string}, options?: {
//     /**
//      * The fee to pay for the transaction. Default: BASE_FEE
//      */
//     fee?: number;

//     /**
//      * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
//      */
//     timeoutInSeconds?: number;

//     /**
//      * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
//      */
//     simulate?: boolean;
//   }) => Promise<AssembledTransaction<null>>

//   /**
//    * Construct and simulate a claim_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
//    */
//   claim_asset: ({from, claimer, message, address, signature}: {from: string, claimer: string, message: Buffer, address: Buffer, signature: Buffer}, options?: {
//     /**
//      * The fee to pay for the transaction. Default: BASE_FEE
//      */
//     fee?: number;

//     /**
//      * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
//      */
//     timeoutInSeconds?: number;

//     /**
//      * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
//      */
//     simulate?: boolean;
//   }) => Promise<AssembledTransaction<null>>

//   /**
//    * Construct and simulate a test_admin_sign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
//    */
//   test_admin_sign: (options?: {
//     /**
//      * The fee to pay for the transaction. Default: BASE_FEE
//      */
//     fee?: number;

//     /**
//      * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
//      */
//     timeoutInSeconds?: number;

//     /**
//      * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
//      */
//     simulate?: boolean;
//   }) => Promise<AssembledTransaction<boolean>>

//   /**
//    * Construct and simulate a test_approval transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
//    */
//   test_approval: ({token_address, from, amount}: {token_address: string, from: string, amount: i128}, options?: {
//     /**
//      * The fee to pay for the transaction. Default: BASE_FEE
//      */
//     fee?: number;

//     /**
//      * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
//      */
//     timeoutInSeconds?: number;

//     /**
//      * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
//      */
//     simulate?: boolean;
//   }) => Promise<AssembledTransaction<null>>

// }
// export class Client extends ContractClient {
//   constructor(public readonly options: ContractClientOptions) {
//     super(
//       new ContractSpec([ "AAAAAQAAAAAAAAAAAAAACkJlbmlmaWNhcnkAAAAAAAMAAAAAAAAACmJlbmlmaWNhcnkAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAL",
//         "AAAAAQAAAAAAAAAAAAAAEUJlbmlmaWNhcnlTdG9yYWdlAAAAAAAABAAAAAAAAAAKYmVuaWZpY2FyeQAAAAAAEwAAAAAAAAAHY2xhaW1lZAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABXZhbHVlAAAAAAAACw==",
//         "AAAAAQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAGYWRtaW5zAAAAAAPqAAAD7gAAACA=",
//         "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAABAAAAAAAAAAHY2xhaW1lZAAAAAABAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAV2YWx1ZQAAAAAAAAs=",
//         "AAAAAAAAAAAAAAAJYWRkX2FkbWluAAAAAAAAAQAAAAAAAAAMYWRtaW5fYWRyZXNzAAAD7gAAACAAAAAA",
//         "AAAAAAAAAAAAAAASYWRkX211bHRpcGxlX2Fzc2V0AAAAAAACAAAAAAAAAARkYXRhAAAD6gAAB9AAAAAKQmVuaWZpY2FyeQAAAAAAAAAAAARmcm9tAAAAEwAAAAA=",
//         "AAAAAAAAAAAAAAALY2xhaW1fYXNzZXQAAAAABQAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB2NsYWltZXIAAAAAEwAAAAAAAAAHbWVzc2FnZQAAAAAOAAAAAAAAAAdhZGRyZXNzAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQAAAAAA=",
//         "AAAAAAAAAAAAAAAPdGVzdF9hZG1pbl9zaWduAAAAAAAAAAABAAAAAQ==",
//         "AAAAAAAAAAAAAAANdGVzdF9hcHByb3ZhbAAAAAAAAAMAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==" ]),
//       options
//     )
//   }
//   public readonly fromJSON = {
//     add_admin: this.txFromJSON<null>,
//         add_multiple_asset: this.txFromJSON<null>,
//         claim_asset: this.txFromJSON<null>,
//         test_admin_sign: this.txFromJSON<boolean>,
//         test_approval: this.txFromJSON<null>
//   }
// }