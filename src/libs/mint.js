import axios from "axios";

export async function insertMint(pubkey, mint) {
    const response = await axios.post('http://146.71.79.134/branden_insert_mint', { data: {pubkey, mint}});
    return response.data;
}

export async function getPubkey(mint) {
    const response = await axios.post('http://146.71.79.134/branden_get_pubkey', { data: {mint}});
    const result = response.data;
    if (result && result.length > 0) {
        return result[0]['pubkey'];
    }
    return '';
}
