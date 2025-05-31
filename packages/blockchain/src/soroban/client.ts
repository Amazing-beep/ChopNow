import { SorobanRpc, Contract, TransactionBuilder, Networks, Keypair, xdr } from 'soroban-client';
import BigNumber from 'bignumber.js';

/**
 * SorobanClient provides a wrapper around the Soroban SDK for ChopNow smart contract operations
 */
export class SorobanClient {
  private rpcServer: SorobanRpc.Server;
  private networkPassphrase: string;
  
  /**
   * Creates a new SorobanClient instance
   * @param rpcUrl The URL of the Soroban RPC server
   * @param isTestnet Whether to use testnet or public network
   */
  constructor(rpcUrl: string, isTestnet: boolean = true) {
    this.rpcServer = new SorobanRpc.Server(rpcUrl);
    this.networkPassphrase = isTestnet ? Networks.TESTNET : Networks.PUBLIC;
  }
  
  /**
   * Deploys a Soroban contract to the network
   * @param adminKeypair The keypair of the contract administrator
   * @param wasmBuffer The compiled WASM contract buffer
   * @returns Promise resolving to the contract ID
   */
  public async deployContract(adminKeypair: Keypair, wasmBuffer: Buffer): Promise<string> {
    try {
      // Get the account sequence number
      const account = await this.rpcServer.getAccount(adminKeypair.publicKey());
      
      // Create the contract deployment transaction
      const transaction = new TransactionBuilder(account, {
        fee: new BigNumber(100).toString(),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation({
          type: 'deployContract',
          source: adminKeypair.publicKey(),
          wasm: wasmBuffer,
        })
        .setTimeout(30)
        .build();
      
      // Sign the transaction
      transaction.sign(adminKeypair);
      
      // Submit the transaction
      const response = await this.rpcServer.sendTransaction(transaction);
      
      // Wait for confirmation
      const result = await this.waitForTransaction(response.hash);
      
      // Extract the contract ID from the result
      const contractId = result.returnValue.contractId;
      return contractId;
    } catch (error) {
      throw new Error(`Failed to deploy contract: ${error}`);
    }
  }
  
  /**
   * Waits for a transaction to be confirmed
   * @param transactionHash The hash of the transaction
   * @returns Promise resolving to the transaction result
   */
  private async waitForTransaction(transactionHash: string): Promise<any> {
    let status: SorobanRpc.GetTransactionStatus;
    
    // Poll until the transaction is confirmed or fails
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await this.rpcServer.getTransaction(transactionHash);
    } while (status.status === 'pending');
    
    if (status.status === 'success') {
      return status.result;
    } else {
      throw new Error(`Transaction failed: ${status.error}`);
    }
  }
  
  /**
   * Invokes a method on a deployed contract
   * @param contractId The ID of the deployed contract
   * @param method The name of the method to invoke
   * @param args The arguments to pass to the method
   * @param signerKeypair The keypair of the transaction signer
   * @returns Promise resolving to the method result
   */
  public async invokeContract(
    contractId: string,
    method: string,
    args: any[],
    signerKeypair: Keypair
  ): Promise<any> {
    try {
      // Get the account sequence number
      const account = await this.rpcServer.getAccount(signerKeypair.publicKey());
      
      // Convert arguments to XDR format
      const xdrArgs = args.map(arg => this.convertToXdr(arg));
      
      // Create the contract invocation transaction
      const transaction = new TransactionBuilder(account, {
        fee: new BigNumber(100).toString(),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation({
          type: 'invokeHostFunction',
          function: 'invokeContract',
          contractId,
          functionName: method,
          args: xdrArgs,
        })
        .setTimeout(30)
        .build();
      
      // Sign the transaction
      transaction.sign(signerKeypair);
      
      // Submit the transaction
      const response = await this.rpcServer.sendTransaction(transaction);
      
      // Wait for confirmation
      const result = await this.waitForTransaction(response.hash);
      
      // Parse and return the result
      return this.parseContractResult(result.returnValue);
    } catch (error) {
      throw new Error(`Failed to invoke contract: ${error}`);
    }
  }
  
  /**
   * Converts a JavaScript value to XDR format
   * @param value The value to convert
   * @returns The XDR representation of the value
   */
  private convertToXdr(value: any): xdr.ScVal {
    if (typeof value === 'string') {
      return xdr.ScVal.scvString(value);
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return xdr.ScVal.scvI32(value);
      } else {
        // Convert to u128 with 7 decimal places of precision
        const u128 = new BigNumber(value).times(10000000).toString();
        return xdr.ScVal.scvU128(u128);
      }
    } else if (typeof value === 'boolean') {
      return xdr.ScVal.scvBool(value);
    } else if (Buffer.isBuffer(value)) {
      return xdr.ScVal.scvBytes(value);
    } else if (Array.isArray(value)) {
      const vec = value.map(item => this.convertToXdr(item));
      return xdr.ScVal.scvVec(vec);
    } else if (value === null) {
      return xdr.ScVal.scvVoid();
    } else {
      throw new Error(`Unsupported value type: ${typeof value}`);
    }
  }
  
  /**
   * Parses a contract result from XDR format
   * @param xdrValue The XDR value to parse
   * @returns The parsed JavaScript value
   */
  private parseContractResult(xdrValue: xdr.ScVal): any {
    switch (xdrValue.switch()) {
      case xdr.ScValType.scvBool():
        return xdrValue.b();
      case xdr.ScValType.scvVoid():
        return null;
      case xdr.ScValType.scvI32():
        return xdrValue.i32();
      case xdr.ScValType.scvU32():
        return xdrValue.u32();
      case xdr.ScValType.scvI64():
        return xdrValue.i64().toString();
      case xdr.ScValType.scvU64():
        return xdrValue.u64().toString();
      case xdr.ScValType.scvI128():
        return xdrValue.i128().toString();
      case xdr.ScValType.scvU128():
        return xdrValue.u128().toString();
      case xdr.ScValType.scvString():
        return xdrValue.str();
      case xdr.ScValType.scvBytes():
        return Buffer.from(xdrValue.bytes());
      case xdr.ScValType.scvVec():
        return xdrValue.vec().map(item => this.parseContractResult(item));
      default:
        return `Unsupported XDR type: ${xdrValue.switch()}`;
    }
  }
  
  /**
   * Gets information about a deployed contract
   * @param contractId The ID of the contract
   * @returns Promise resolving to the contract information
   */
  public async getContractInfo(contractId: string): Promise<any> {
    try {
      const info = await this.rpcServer.getContractInfo(contractId);
      return info;
    } catch (error) {
      throw new Error(`Failed to get contract info: ${error}`);
    }
  }
}
