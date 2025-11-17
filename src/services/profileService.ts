import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
} from 'firebase/firestore';
import { db } from '../libs/firebase';
import type { UserProfile } from '../types/profile';

// Criar ou atualizar perfil do usuário
export const saveUserProfile = async (
  uid: string, 
  profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const existingProfile = await getDoc(profileRef);
    
    if (existingProfile.exists()) {
      // Atualizar perfil existente
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Criar novo perfil
      await setDoc(profileRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    throw error;
  }
};

// Buscar perfil do usuário
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

// Atualizar campos específicos do perfil
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

// Criar perfil inicial no registro
export const createInitialProfile = async (
  uid: string,
  accountType: 'farm' | 'operator' | 'consultant',
  baseData: {
    fullName: string;
    email: string;
    phone?: string;
    region?: string;
  }
): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    
    // Verifica se o perfil já existe
    const existingProfile = await getDoc(profileRef);
    if (existingProfile.exists()) {
      // Perfil já existe, não cria novamente
      return;
    }
    
    const baseProfile = {
      uid,
      accountType,
      ...baseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Adiciona campos específicos por tipo
    if (accountType === 'farm') {
      await setDoc(profileRef, {
        ...baseProfile,
        cnpj: '',
      });
    } else if (accountType === 'operator') {
      await setDoc(profileRef, {
        ...baseProfile,
        cpf: '',
      });
    } else if (accountType === 'consultant') {
      await setDoc(profileRef, {
        ...baseProfile,
        cpf: '',
      });
    }
  } catch (error) {
    console.error('Erro ao criar perfil inicial:', error);
    throw error;
  }
};

