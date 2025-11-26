export const vnd = (amount: number | string) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'VND',
  }).format(+amount);
};

export const VNDUnits = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
export const VNDDigitText = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

export const vndText = (number: number) => {
  if (number === 0) return '';

  const units = VNDUnits;
  const digitText = VNDDigitText;

  // read exactly a triple (0..999). If showZeroHundred = true, and
  // hundred === 0 but (ten>0 || unit>0), we will output "không trăm".
  function readTriple(num: number, showZeroHundred: boolean): string {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;
    let parts: string[] = [];

    if (hundred > 0) {
      parts.push(digitText[hundred] + ' trăm');
    } else if (showZeroHundred && (ten > 0 || unit > 0)) {
      parts.push('không trăm');
    }

    if (ten > 1) {
      parts.push(
        digitText[ten] + ' mươi' + (unit === 1 ? ' mốt' : unit === 5 ? ' lăm' : unit > 0 ? ' ' + digitText[unit] : '')
      );
    } else if (ten === 1) {
      parts.push('mười' + (unit === 1 ? ' một' : unit === 5 ? ' lăm' : unit > 0 ? ' ' + digitText[unit] : ''));
    } else {
      // ten === 0
      if (hundred > 0 && unit > 0) {
        // ví dụ "trăm linh hai"
        parts.push('linh ' + digitText[unit]);
      } else if (hundred === 0 && unit > 0 && !showZeroHundred) {
        // lúc không cần "không trăm" (ví dụ số nhỏ, nhóm duy nhất): chỉ "hai"
        parts.push(digitText[unit]);
      } else if (hundred === 0 && unit > 0 && showZeroHundred) {
        // trường hợp nhóm không có trăm nhưng cần hiển thị "không trăm linh x"
        parts.push('linh ' + digitText[unit]);
      }
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  // Tạo các nhóm theo thứ tự ít-significant -> nhiều-significant
  const groups: number[] = [];
  let t = number;
  while (t > 0) {
    groups.push(t % 1000);
    t = Math.floor(t / 1000);
  }

  const partsOut: string[] = [];

  // Duyệt từ nhóm lớn nhất (cuối mảng) xuống nhỏ nhất (đầu mảng)
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    const unitText = units[i] ? ' ' + units[i] : '';

    // showZeroHundred = true nếu KHÔNG phải nhóm lớn nhất và nhóm này > 0 hoặc có nhóm nhỏ hơn khác 0
    const hasSmaller = groups.slice(0, i).some((v) => v > 0);
    const showZeroHundred = i < groups.length - 1 && (g > 0 || hasSmaller);

    if (g > 0 || showZeroHundred) {
      const groupText = readTriple(g, showZeroHundred);
      partsOut.push((groupText + unitText).trim());
    }
  }

  let text = partsOut.join(' ').replace(/\s+/g, ' ').trim();

  // một số tinh chỉnh ngôn ngữ
  text = text
    .replace(/mươi một/g, 'mươi mốt')
    .replace(/mươi năm/g, 'mươi lăm')
    .replace(/mười năm/g, 'mười lăm');

  return text;
};
