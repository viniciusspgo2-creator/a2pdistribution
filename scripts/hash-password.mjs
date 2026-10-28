import bcrypt from 'bcryptjs';
const password = process.argv[2];
if (!password || password.length < 12) { console.error('Use uma palavra-passe com 12 ou mais caracteres. Ex.: npm run hash:password -- "MinhaSenhaLonga!"'); process.exit(1); }
console.log(await bcrypt.hash(password, 12));
