/**
 * Utility to convert numeric Indian Currency (INR) amounts into words.
 * Follows the Indian numbering system: Crores, Lakhs, Thousands, Hundreds.
 * Example: 45500 -> "Forty-Five Thousand Five Hundred Rupees Only"
 * Example: 125050.75 -> "One Lakh Twenty-Five Thousand Fifty Rupees and Seventy-Five Paise Only"
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n) {
  let word = '';
  if (n >= 100) {
    word += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      word += ONES[n] + ' ';
    } else {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      word += TENS[ten] + (one > 0 ? '-' + ONES[one] : '') + ' ';
    }
  }
  return word.trim();
}

export function convertAmountToWords(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Zero Rupees Only';
  }

  const num = Math.abs(Number(amount));
  if (num === 0) return 'Zero Rupees Only';

  const parts = num.toFixed(2).split('.');
  let rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let result = '';

  // Crores (1,00,00,000)
  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000);
    result += convertAmountToWordsWithoutSuffix(crores) + ' Crore ';
    rupees %= 10000000;
  }

  // Lakhs (1,00,000)
  if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000);
    result += convertBelowThousand(lakhs) + ' Lakh ';
    rupees %= 100000;
  }

  // Thousands (1,000)
  if (rupees >= 1000) {
    const thousands = Math.floor(rupees / 1000);
    result += convertBelowThousand(thousands) + ' Thousand ';
    rupees %= 1000;
  }

  // Hundreds and remaining (<1,000)
  if (rupees > 0) {
    result += convertBelowThousand(rupees) + ' ';
  }

  result = result.trim();
  if (result.length > 0) {
    result += ' Rupees';
  } else {
    result = 'Zero Rupees';
  }

  if (paise > 0) {
    result += ' and ' + convertBelowThousand(paise) + ' Paise';
  }

  result += ' Only';
  return result;
}

function convertAmountToWordsWithoutSuffix(num) {
  let res = '';
  if (num >= 10000000) {
    const cr = Math.floor(num / 10000000);
    res += convertBelowThousand(cr) + ' Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    const lk = Math.floor(num / 100000);
    res += convertBelowThousand(lk) + ' Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    const th = Math.floor(num / 1000);
    res += convertBelowThousand(th) + ' Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    res += convertBelowThousand(num);
  }
  return res.trim();
}

/**
 * Format Indian Currency format (e.g., ₹ 45,500.00)
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

