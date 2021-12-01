use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{
        Mint,
        Token,
        TokenAccount
    }  
};
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_studies {
    use super::*;
    pub fn mint_token(ctx: Context<MintToken>, mint_bump: u8) -> ProgramResult {
        anchor_spl::token::mint_to(
            CpiContext::new_with_signer(                
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::MintTo{
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.destination_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info()
                }, 
                &[&[&[], &[mint_bump]]]
            ),
            1
        )?;

        Ok(())
    }
}


#[derive(Accounts)]
#[instruction(mint_bump: u8)]
pub struct MintToken<'info> {
    #[account(
        init,
        payer = user,
        seeds = [],
        bump = mint_bump,
        mint::decimals =0,
        mint::authority = user,
    )]
    pub mint: Account<'info,Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub destination_account: Account<'info,TokenAccount>,

    pub system_program: Program<'info,System>,
    pub token_program: Program<'info,Token>,
    pub associated_token_program: Program<'info,AssociatedToken>,
    pub rent: Sysvar<'info,Rent>
}

#[derive(Accounts)]
pub struct Burn<'info>{
    #[account(mut)]
    pub mint: Account<'info,Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub source: Account<'info,TokenAccount>,
    pub user: Signer<'info>,

    pub token_program: Program<'info,Token>,
}
