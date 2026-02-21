export const formatNumberToNaira = (amount: number): string => {
    return  (Number(amount || 0)).toLocaleString('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                    minimumFractionDigits: 0
                                });
}