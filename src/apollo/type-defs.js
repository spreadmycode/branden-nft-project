import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Mint {
    id: ID
    pubkey: String
    mint: String
  }

  input InsertMintInput {
    pubkey: String
    mint: String
  }

  type InsertMintPayload {
    mint: Mint
  }

  input MintInput {
    mint: String
  }

  type GetPubkeyPayload {
    pubkey: String
  }

  type Query {
    mint(id: ID!): Mint
    mints: [Mint]
    viewer: Mint
  }

  type Mutation {
    insertMint(input: InsertMintInput!): InsertMintPayload
    getPubkey(input: MintInput!): GetPubkeyPayload
  }
`
