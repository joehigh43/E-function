create database ecommrece;
use ecommrece ;
 
 
create table users(
UserID varchar(10) constraint PK_ID  primary key,
fullName varchar(100),
Email varchar(100) unique,
passwordHash varchar(255),
phone varchar(20),
Address text,
UserType varchar(15) constraint CHK_userstype check(UserType IN('trader','customer','admin')),
createdAt Time default current_timestamp
);
select * from users;

alter table users
alter column UserID varchar(10) not null ;

create table products(
productID varchar(10) constraint PK_PID primary key,
productName varchar(30),
description varchar(255),
price money,
wholePrice money,
stockQuantity int,
ImageURL varchar(500),
catagory varchar(30),
traderID varchar(10) constraint FK_TID foreign key references users(userID),
createdAt Time default current_timestamp
);
select * from products;

create table orders(
orderID varchar(10) constraint PK_OID primary key,
buyerID varchar(10) constraint FK_BID foreign key references users(userID),
totalAmount int,
paymentMethod varchar(15) constraint CHK_PM check(paymentMethod IN('cash','installement')),
address text,
createdAt Time default current_timestamp
);
select * from orders;

create table orederItems(
orderItemID varchar(10) constraint PK_OIID primary key,
orderID varchar(10) foreign key references orders(orderID),
productID varchar(10) foreign key references products(productID),
Quantity int,
price money,
totalPrice money
);
select * from orederItems;
