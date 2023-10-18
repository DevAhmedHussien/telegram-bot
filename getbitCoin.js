
let bitcoinValueInRUB
async function getBitcoinValueInRUB  () {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=rub');
            bitcoinValueInRUB = response.data.bitcoin.rub;
        return bitcoinValueInRUB
        } catch (error) {
        console.error('Error:', error.message);
    
        }
    };
    module.exports = getBitcoinValueInRUB