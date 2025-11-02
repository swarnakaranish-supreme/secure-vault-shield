// Secure File Locker - Cryptography utilities using Web Crypto API

export type Algorithm = 'AES-256-GCM' | 'AES-256-CBC';

export interface EncryptionMetadata {
  version: string;
  algorithm: Algorithm;
  kdf: 'PBKDF2';
  salt: Uint8Array;
  iterations: number;
  iv: Uint8Array;
  originalName: string;
  size: number;
  createdAt: string;
}

export interface ProgressCallback {
  (progress: number): void;
}

// Default configuration
const DEFAULT_ITERATIONS = 310000; // PBKDF2 iterations
const DEFAULT_CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits for GCM

// Generate cryptographically secure random bytes
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// Derive key from password using PBKDF2
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number = DEFAULT_ITERATIONS
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: iterations,
      hash: 'SHA-256'
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt file data
export async function encryptFile(
  file: File,
  password: string,
  algorithm: Algorithm = 'AES-256-GCM',
  onProgress?: ProgressCallback
): Promise<{ encryptedData: Uint8Array; metadata: EncryptionMetadata }> {
  const salt = generateRandomBytes(SALT_LENGTH);
  const iv = generateRandomBytes(IV_LENGTH);
  const iterations = DEFAULT_ITERATIONS;
  
  // Derive encryption key
  const key = await deriveKey(password, salt, iterations);
  
  // Read file data
  const fileData = new Uint8Array(await file.arrayBuffer());
  
  // Encrypt using AES-GCM
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
      tagLength: 128
    },
    key,
    new Uint8Array(fileData)
  );
  
  const metadata: EncryptionMetadata = {
    version: '1.0',
    algorithm,
    kdf: 'PBKDF2',
    salt,
    iterations,
    iv,
    originalName: file.name,
    size: file.size,
    createdAt: new Date().toISOString()
  };
  
  onProgress?.(100);
  
  return {
    encryptedData: new Uint8Array(encryptedData),
    metadata
  };
}

// Decrypt file data
export async function decryptFile(
  encryptedData: Uint8Array,
  metadata: EncryptionMetadata,
  password: string,
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  // Derive decryption key
  const key = await deriveKey(password, metadata.salt, metadata.iterations);
  
  try {
    // Decrypt using AES-GCM
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(metadata.iv),
        tagLength: 128
      },
      key,
      new Uint8Array(encryptedData)
    );
    
    onProgress?.(100);
    
    return new Uint8Array(decryptedData);
  } catch (error) {
    throw new Error('Decryption failed. Please check your password.');
  }
}

// Create encrypted file package (.sfl format)
export function createEncryptedPackage(
  encryptedData: Uint8Array,
  metadata: EncryptionMetadata
): Uint8Array {
  // Convert metadata to JSON and encode
  const metadataJson = JSON.stringify({
    ...metadata,
    salt: Array.from(metadata.salt),
    iv: Array.from(metadata.iv)
  });
  
  const metadataBytes = new TextEncoder().encode(metadataJson);
  const metadataLength = metadataBytes.length;
  
  // Create package: [4 bytes length][metadata][encrypted data]
  const package_ = new Uint8Array(4 + metadataLength + encryptedData.length);
  const view = new DataView(package_.buffer);
  
  // Write metadata length
  view.setUint32(0, metadataLength, true);
  
  // Write metadata
  package_.set(metadataBytes, 4);
  
  // Write encrypted data
  package_.set(encryptedData, 4 + metadataLength);
  
  return package_;
}

// Parse encrypted file package
export function parseEncryptedPackage(packageData: Uint8Array): {
  metadata: EncryptionMetadata;
  encryptedData: Uint8Array;
} {
  const view = new DataView(packageData.buffer);
  const metadataLength = view.getUint32(0, true);
  
  // Extract metadata
  const metadataBytes = packageData.slice(4, 4 + metadataLength);
  const metadataJson = new TextDecoder().decode(metadataBytes);
  const parsedMetadata = JSON.parse(metadataJson);
  
  // Reconstruct Uint8Array from arrays
  const metadata: EncryptionMetadata = {
    ...parsedMetadata,
    salt: new Uint8Array(parsedMetadata.salt),
    iv: new Uint8Array(parsedMetadata.iv)
  };
  
  // Extract encrypted data
  const encryptedData = packageData.slice(4 + metadataLength);
  
  return { metadata, encryptedData };
}

// Generate strong password
export function generateStrongPassword(length: number = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

// Check password strength
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 12) score += 2;
  else feedback.push('Use at least 12 characters');
  
  if (password.length >= 16) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Add special characters');
  
  if (password.length >= 20) score += 1;
  
  return { score: Math.min(score, 5), feedback };
}