export type AccountType = 'farm' | 'operator' | 'consultant';

export interface BaseProfile {
  uid: string;
  accountType: AccountType;
  fullName: string;
  email: string;
  phone?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Perfil de Fazenda/Produtor
export interface FarmProfile extends BaseProfile {
  accountType: 'farm';
  cnpj: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  area?: string; // Área total da fazenda
  mainCrops?: string[]; // Principais culturas
  description?: string;
}

// Perfil de Operador
export interface OperatorProfile extends BaseProfile {
  accountType: 'operator';
  cpf: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  specialties?: string[]; // Especialidades
  certifications?: string[]; // Certificações
  experience?: string; // Anos de experiência
  description?: string;
  availableForHire?: boolean;
}

// Perfil de Consultor Agronômico
export interface ConsultantProfile extends BaseProfile {
  accountType: 'consultant';
  cpf?: string; // Opcional para pessoa física
  cnpj?: string; // Opcional para pessoa jurídica
  companyName?: string; // Se tiver CNPJ
  crc?: string; // Registro no Conselho Regional
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  specialties?: string[]; // Áreas de especialização
  certifications?: string[]; // Certificações técnicas
  yearsOfExperience?: number;
  description?: string;
  website?: string;
}

export type UserProfile = FarmProfile | OperatorProfile | ConsultantProfile;

