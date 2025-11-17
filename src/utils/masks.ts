/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export const maskCPF = (value: string): string => {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

/**
 * Aplica máscara de CNPJ: 00.000.000/0000-00
 */
export const maskCNPJ = (value: string): string => {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

/**
 * Aplica máscara de CEP: 00000-000
 */
export const maskCEP = (value: string): string => {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

/**
 * Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export const maskPhone = (value: string): string => {
  const numbers = onlyNumbers(value);
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Aplica máscara para número decimal (área em hectares)
 */
export const maskDecimal = (value: string): string => {
  // Remove tudo exceto números e ponto decimal
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Permite apenas um ponto decimal
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
};

/**
 * Aplica máscara para números inteiros
 */
export const maskInteger = (value: string): string => {
  return onlyNumbers(value);
};

/**
 * Hook para criar handler de máscara
 */
export const useMask = (maskFunction: (value: string) => string) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskFunction(e.target.value);
    return {
      ...e,
      target: {
        ...e.target,
        value: maskedValue,
      },
    };
  };
};

