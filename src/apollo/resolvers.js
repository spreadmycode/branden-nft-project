import { 
    insertMint,
    getPubkey,
    getAllMint
} from '../libs/mint';

export const resolvers = {
    Query: {
        async viewer(_parent, args, context, _info) {
            const pubkey = await getPubkey(args.input.code);
            return { pubkey };
        },
    },
    Mutation: {
        async insertMint(_parent, args, _context, _info) {
            const data = await insertMint(args.input.pubkey, args.input.mint);
            return { data };
        },
        async getPubkey(_parent, args, _context, _info) {
            const pubkey = await getPubkey(args.input.mint);
            return { pubkey };
        },
    },
};
