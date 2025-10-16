import bcrypt from 'bcrypt';

const password = 'whatever';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});