create database ecommrece;
use ecommrece ;
/*drop database ecommrece;
use Company;*/

create table users(
UserID int identity(1,1) constraint PK_ID  primary key not null,
fullName varchar(100) not null,
Email varchar(100) unique not null,
passwordHash varchar(255) not null,
phone varchar(20) not null,
Address text,
UserType varchar(15) constraint CHK_userstype check(UserType IN('Male','Female')),
createdAt DateTime DEFAULT CURRENT_TIMESTAMP
);
select * from users;

create table products(
productID int identity(1,1) constraint PK_PID primary key,
productName varchar(30) not null,
description varchar(255),
price money not null,
stockQuantity int default 0,
ImageURL varchar(500),
category varchar(30) not null,
createdAt DateTime DEFAULT CURRENT_TIMESTAMP,
adminID int constraint FK_AID foreign key references users(UserID)
);
select * from products;

create table orders(
orderID int identity(1,1)  constraint PK_OID primary key,
buyerID int constraint FK_BID foreign key references users(userID),
totalAmount int,
paymentMethod varchar(15) constraint CHK_PM check(paymentMethod IN('cash','installement')),
address text,
createdAt DateTime DEFAULT CURRENT_TIMESTAMP
);
select * from orders;

create table orederItems(
orderItemID int identity(1,1) constraint PK_OIID primary key,
orderID int foreign key references orders(orderID),
productID int foreign key references products(productID),
Quantity int not null,
totalPrice money
);
select * from orederItems;



create table carts (
    cartID int identity(1,1) constraint PK_CID primary key,
    customerID int foreign key references users(UserID),
    CreatedAt DateTime DEFAULT CURRENT_TIMESTAMP
);
select * from carts;

create table cartItems (
    CartItemID int identity(1,1) primary key,
    CartID int foreign key references carts(CartID),
    ProductID int foreign key references products(ProductID),
    Quantity INt
);
select * from cartItems;