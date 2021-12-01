import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { Program } from '@project-serum/anchor';
import { TokenStudies } from '../target/types/token_studies';

describe('token-studies', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TokenStudies as Program<TokenStudies>;
  const provider = program.provider;

  it('initializes a mint !', async () => {
    // first we find a PDA for our new mint
    const [mintId, mintBump] = await anchor.web3.PublicKey.findProgramAddress(
      [],
      program.programId
    )

    // maybe we need our associated token since the type must match in the struct
    // as destination account, we don't put OUR pubkey, we put the pubkey
    // of our account holding that mint belonging to the token program
    let ourAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      mintId,
      provider.wallet.publicKey,
    )

  
    
    // Add your test here.
    const tx = await program.rpc.mintToken(
      mintBump,
      {
        accounts: {
          mint: mintId,
          user: provider.wallet.publicKey,
          destinationAccount: ourAssociatedAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID ,
          associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID ,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },

      }
    );

    let ataDataPostMint = await getAtaInfos(ourAssociatedAccount);
    console.log(" balance is :"+ ataDataPostMint.toString());


  });

  async function getAccountBalance(accountId: anchor.web3.PublicKey){
    let balance = await provider.connection.getBalance(accountId);
    return balance;
  }

  async function getAtaInfos(accountId: anchor.web3.PublicKey){
    // let data = await provider.connection.getBalance(accountId);
    
    return data;
  }

});


