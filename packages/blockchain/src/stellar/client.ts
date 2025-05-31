import { Keypair, Server, TransactionBuilder, Networks, Operation, Asset, Account } from 'stellar-sdk';
import BigNumber from 'bignumber.js';

/**
 * StellarClient provides a wrapper around the Stellar SDK for ChopNow payment operations
 */
export class StellarClient {
  private server: Server;
  private networkPassphrase: string;
  
  /**
   * Creates a new StellarClient instance
   * @param horizonUrl The URL of the Horizon server
   * @param isTestnet Whether to use testnet or public network
   */
  constructor(horizonUrl: string, isTestnet: boolean = true) {
    this.server = new Server(horizonUrl);
    this.networkPassphrase = isTestnet ? Networks.TESTNET : Networks.PUBLIC;
  }
  
  /**
   * Creates a new Stellar account
   * @returns The newly created keypair
   */
  public createAccount(): Keypair {
    return Keypair.random();
  }
  
  /**
   * Funds a testnet account using Friendbot
   * @param publicKey The public key of the account to fund
   * @returns Promise resolving to the funding transaction response
   */
  public async fundTestnetAccount(publicKey: string): Promise<any> {
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fund testnet account: ${error}`);
    }
  }
  
  /**
   * Gets account details from the Stellar network
   * @param publicKey The public key of the account
   * @returns Promise resolving to the account details
   */
  public async getAccount(publicKey: string): Promise<Account> {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account;
    } catch (error) {
      throw new Error(`Failed to load account: ${error}`);
    }
  }
  
  /**
   * Sends a payment from one account to another
   * @param sourceKeypair The keypair of the sending account
   * @param destinationPublicKey The public key of the receiving account
   * @param amount The amount to send
   * @param assetCode The asset code (default: XLM)
   * @param assetIssuer The asset issuer (for non-native assets)
   * @returns Promise resolving to the transaction response
   */
  public async sendPayment(
    sourceKeypair: Keypair,
    destinationPublicKey: string,
    amount: string,
    assetCode: string = 'XLM',
    assetIssuer?: string
  ): Promise<any> {
    try {
      const sourceAccount = await this.getAccount(sourceKeypair.publicKey());
      
      // Determine the asset (native XLM or custom asset)
      let asset;
      if (assetCode === 'XLM' && !assetIssuer) {
        asset = Asset.native();
      } else if (assetIssuer) {
        asset = new Asset(assetCode, assetIssuer);
      } else {
        throw new Error('Asset issuer is required for non-native assets');
      }
      
      // Build the transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: new BigNumber(100).toString(), // 100 stroops per operation
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: destinationPublicKey,
            asset,
            amount,
          })
        )
        .setTimeout(30) // 30 seconds
        .build();
      
      // Sign the transaction
      transaction.sign(sourceKeypair);
      
      // Submit the transaction
      const transactionResult = await this.server.submitTransaction(transaction);
      return transactionResult;
    } catch (error) {
      throw new Error(`Payment failed: ${error}`);
    }
  }
  
  /**
   * Creates a trustline for a custom asset
   * @param accountKeypair The keypair of the account creating the trustline
   * @param assetCode The asset code
   * @param assetIssuer The asset issuer
   * @param limit Optional trustline limit
   * @returns Promise resolving to the transaction response
   */
  public async createTrustline(
    accountKeypair: Keypair,
    assetCode: string,
    assetIssuer: string,
    limit?: string
  ): Promise<any> {
    try {
      const account = await this.getAccount(accountKeypair.publicKey());
      const asset = new Asset(assetCode, assetIssuer);
      
      // Build the transaction
      const transaction = new TransactionBuilder(account, {
        fee: new BigNumber(100).toString(),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset,
            limit,
          })
        )
        .setTimeout(30)
        .build();
      
      // Sign the transaction
      transaction.sign(accountKeypair);
      
      // Submit the transaction
      const transactionResult = await this.server.submitTransaction(transaction);
      return transactionResult;
    } catch (error) {
      throw new Error(`Failed to create trustline: ${error}`);
    }
  }
  
  /**
   * Creates a new asset on the Stellar network
   * @param issuerKeypair The keypair of the asset issuer
   * @param distributorKeypair The keypair of the asset distributor
   * @param assetCode The asset code
   * @param initialSupply The initial supply of the asset
   * @returns Promise resolving to the transaction response
   */
  public async createAsset(
    issuerKeypair: Keypair,
    distributorKeypair: Keypair,
    assetCode: string,
    initialSupply: string
  ): Promise<any> {
    try {
      // 1. Create trustline from distributor to issuer
      await this.createTrustline(
        distributorKeypair,
        assetCode,
        issuerKeypair.publicKey()
      );
      
      // 2. Send initial supply from issuer to distributor
      const issuerAccount = await this.getAccount(issuerKeypair.publicKey());
      const asset = new Asset(assetCode, issuerKeypair.publicKey());
      
      const transaction = new TransactionBuilder(issuerAccount, {
        fee: new BigNumber(100).toString(),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: distributorKeypair.publicKey(),
            asset,
            amount: initialSupply,
          })
        )
        .setTimeout(30)
        .build();
      
      transaction.sign(issuerKeypair);
      const transactionResult = await this.server.submitTransaction(transaction);
      return transactionResult;
    } catch (error) {
      throw new Error(`Failed to create asset: ${error}`);
    }
  }
  
  /**
   * Gets the transaction history for an account
   * @param publicKey The public key of the account
   * @param limit The maximum number of transactions to return
   * @returns Promise resolving to the transaction records
   */
  public async getTransactionHistory(publicKey: string, limit: number = 10): Promise<any> {
    try {
      const transactions = await this.server
        .transactions()
        .forAccount(publicKey)
        .limit(limit)
        .order('desc')
        .call();
      
      return transactions;
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error}`);
    }
  }
  
  /**
   * Gets the balance for an account
   * @param publicKey The public key of the account
   * @returns Promise resolving to the account balances
   */
  public async getBalances(publicKey: string): Promise<any[]> {
    try {
      const account = await this.getAccount(publicKey);
      return account.balances;
    } catch (error) {
      throw new Error(`Failed to get balances: ${error}`);
    }
  }
}
