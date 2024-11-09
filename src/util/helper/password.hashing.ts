import * as bcrypt from 'bcrypt';

const hashPassword = async (plaintextPassword: string): Promise<string> => {
  if (!plaintextPassword) {
    throw new Error('Password cannot be empty');
  }
  try {
    const hash: string = await bcrypt.hash(plaintextPassword, 10);

    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

const comparePassword = async (
  plaintextPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(plaintextPassword, hashPassword);
  return result;
};

export default { hashPassword, comparePassword };
