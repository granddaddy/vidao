# query for first occurence replace only
select 
cast(CONCAT(LEFT(id_dec, INSTR(id_dec, id_salt) - 1), '', SUBSTRING(id_dec FROM INSTR(id_dec, id_salt) + CHAR_LENGTH(id_salt))) as unsigned) as id,
CONCAT(LEFT(name_dec, INSTR(name_dec, name_salt) - 1), '', SUBSTRING(name_dec FROM INSTR(name_dec, name_salt) + CHAR_LENGTH(name_salt))) as name,
CONCAT(LEFT(phone_dec, INSTR(phone_dec, phone_salt) - 1), '', SUBSTRING(phone_dec FROM INSTR(phone_dec, phone_salt) + CHAR_LENGTH(phone_salt))) as phone
from
(
select 
cast(aes_decrypt(id_enc, <<KEY>>) as char) as id_dec, id_salt,
cast(aes_decrypt(name_enc, <<KEY>>) as char) as name_dec, name_salt,
cast(aes_decrypt(phone_enc, <<KEY>>) as char) as phone_dec, phone_salt
from user_encrypted
) decrypt

