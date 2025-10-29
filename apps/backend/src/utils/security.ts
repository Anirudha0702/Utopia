import * as bcrypt from 'bcrypt';
export const matchHash = async (value: string, encryptedText: string) => {
  return await bcrypt.compare(value, encryptedText);
};

export const hash = async (
  valueToBeHashed: string,
  saltRound: string | number,
) => {
  return await bcrypt.hash(valueToBeHashed, saltRound);
};
