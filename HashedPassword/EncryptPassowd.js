import cryptojs from "crypto-js";


export const hashPassowrd = (password) => {
  const hash = cryptojs.SHA256(password).toString();
  return hash;
};

export const compareHashPassword = (password, hashedPassword) => {
  const hash = hashPassowrd(password);
  return hash === hashedPassword;
};
