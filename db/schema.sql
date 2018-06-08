create database solace;
use solace;
create table request_log (
id int auto_increment primary key not null,
request_timestamp timestamp default current_timestamp,
msgvpn varchar(100) not null,
app varchar(20) not null,
description varchar(20) not null
);