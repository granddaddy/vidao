CREATE TABLE `user_from_dump_encrypted` (
  `id_enc` longblob,
  `id_salt` varchar(64) CHARACTER SET utf8 DEFAULT NULL,
  `name_enc` longblob DEFAULT NULL,
  `name_salt` varchar(64) CHARACTER SET utf8 DEFAULT NULL,
  `phone_enc` longblob DEFAULT NULL,
  `phone_salt` varchar(64) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into `user_from_dump_encrypted`
select 
cast(aes_encrypt(id_salted, <<KEY>>) as BINARY) as id_enc, id_salt,
cast(aes_encrypt(name_salted, <<KEY>>) as BINARY) as name_enc, name_salt,
cast(aes_encrypt(phone_salted, <<KEY>>) as BINARY) as phone_enc, phone_salt
from
(
select 
concat(cast(id_salt as char), id) id_salted, id_salt, 
concat(cast(name_salt as char), name) as name_salted, name_salt, 
concat(cast(phone_salt as char), phone) as phone_salted, phone_salt
from
(
select *, sha2(rand(), 256) as id_salt, sha2(rand(), 256) as name_salt, sha2(rand(), 256) as phone_salt
from user_from_dump
) salt
) salted;