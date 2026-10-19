// Change this to the current USD to INR rate.
// If your amounts in orders.json are already meant to be rupees, set it to 1.
export const USD_TO_INR = 88

export const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(value)