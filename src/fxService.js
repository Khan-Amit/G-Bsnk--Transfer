/**
 * G-Bsnk--Transfer Currency Exchange Service
 * Handles the arithmetic for exchanging foreign currency balances (USD/EUR) 
 * into local Thai Baht (THB) for merchant settlement.
 */

// Simulated internal conversion base rates against 1 THB
const FIXER_RATES = {
    'THB': 1.00,
    'USD': 34.50, // 1 USD = 34.50 THB
    'EUR': 37.20, // 1 EUR = 37.20 THB
    'XMR': 5120.00,
    'BTC': 2450000.00
};

/**
 * Calculates exchange settlement from base currency to local THB
 * @param {number} amount - The transaction amount input by user
 * @param {string} fromCurrency - The source asset ticker (e.g., 'USD', 'EUR')
 * @param {number} commissionRate - Platform fee percentage deducted from calculation
 * @returns {Object} Calculated transaction breakdown payload
 */
function calculateLocalSettlement(amount, fromCurrency, commissionRate = 2.5) {
    const asset = fromCurrency.toUpperCase();
    
    // Fallback to 1-to-1 if asset is unknown
    const baseRate = FIXER_RATES[asset] || 1.00;
    
    // Gross conversion value into Thai Baht
    const grossTHB = amount * baseRate;
    
    // Fee breakdown processing
    const feeAmountTHB = grossTHB * (commissionRate / 100);
    const finalSettlementTHB = grossTHB - feeAmountTHB;

    return {
        sourceAmount: amount,
        sourceCurrency: asset,
        exchangeRate: baseRate,
        grossLocalValueTHB: parseFloat(grossTHB.toFixed(2)),
        feeChargedTHB: parseFloat(feeAmountTHB.toFixed(2)),
        netVendorSettlementTHB: parseFloat(finalSettlementTHB.toFixed(2)),
        timestamp: new Date().toISOString()
    };
}

module.exports = { calculateLocalSettlement };
