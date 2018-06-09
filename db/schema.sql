-- Create the "smurph" database
create database smurph;
-- Select the "smurph" database where all the operations will be performed 
use smurph;
-- Create the "request_log" table where all message router configuration requests will get logged
create table request_log (
id int auto_increment primary key not null, -- primary key
request_timestamp timestamp default current_timestamp, -- timestamp which will automatically reflect the time that the insert statement is initiated
msgvpn varchar(100) not null, -- name of the message vpn (provided in the form)
app varchar(20) not null -- name of the application (provided in the form)
);