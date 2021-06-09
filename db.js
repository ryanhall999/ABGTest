const pg = require("pg");
const { Client } = require("pg");
const faker = require("faker");
const fs = require("fs");
const sqls = require("./sql.js");

let sql1 = sqls.sql1;
let sql2 = sqls.sql2;
let sql3 = sqls.sql3;
let sql4 = sqls.sql4;
let sql5 = sqls.sql5;
let sql6 = sqls.sql6;
let sql7 = sqls.sql7;
// let sql8 = sqls.sql8;
// let sql9 = sqls.sql9;
// let sql10 = sqls.sql10;
// let sql11 = sqls.sql11;
// let sql12 = sqls.sql12;
// let sql13 = sqls.sql13;
// let sql14 = sqls.sql14;
// let sql15 = sqls.sql15;
let sql_2_1 = sqls.sql_2_1;
let sql_2_2 = sqls.sql_2_2;
let sql_2_3 = sqls.sql_2_3;
let sql_2_4 = sqls.sql_2_4;
let sql_2_5 = sqls.sql_2_5;
let sql_2_6 = sqls.sql_2_6;
let sql_2_7 = sqls.sql_2_7;

const client = new pg.Client(
	process.env.DATABASE_URL || "postgres://localhost/ABGdb"
);

client.connect();

const getProducts = (amount) => {
	let products = [];
	for (let i = 0; i < amount; i++) {
		//let NIIN = faker.datatype.number(9, 9);
		let NAME = faker.commerce.productName();
		let INC = faker.datatype.number(9, 5);
		let FSC = faker.datatype.number(9, 4);
		let FSG = faker.datatype.number(9, 2);
		let COUNTRY_CODE = faker.datatype.number(9, 2);
		let ITEM_NUMBER = faker.datatype.number(9, 3);
		let PUB_DATE = faker.date.past(25);
		let newProd = {
			//NIIN: NIIN,
			NAME: NAME,
			INC: INC,
			FSC: FSC,
			FSG: FSG,
			COUNTRY_CODE: COUNTRY_CODE,
			ITEM_NUMBER: ITEM_NUMBER,
			PUB_DATE: PUB_DATE,
		};
		products.push(newProd);
	}
	return products;
};

const products = {
	read: async () => {
		return (await client.query("SELECT * from nsn")).rows;
	},
	create: async ({
		//NIIN,
		NAME,
		INC,
		FSC,
		FSG,
		COUNTRY_CODE,
		ITEM_NUMBER,
		PUB_DATE,
	}) => {
		const SQL = `INSERT INTO nsn( NAME, INC, FSC, FSG, COUNTRY_CODE, ITEM_NUMBER, PUB_DATE) values($1, $2, $3, $4, $5, $6, $7) returning *`;
		return (
			await client.query(SQL, [
				//NIIN,
				NAME,
				INC,
				FSC,
				FSG,
				COUNTRY_CODE,
				ITEM_NUMBER,
				PUB_DATE,
			])
		).rows[0];
	},
};

const sync = async () => {
	const SQL = `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	DROP TABLE IF EXISTS nsn;
	DROP TABLE IF EXISTS nsn_flis_parts;

	CREATE TABLE nsn (
		niin             				INT NOT NULL,
	 	Name             				VARCHAR(80) NOT NULL,
	 	inc              				INT NOT NULL,
	 	fsc              				INT NOT NULL,
	 	fsg              				INT NOT NULL,
	 	country_code     				INT NOT NULL,
	 	item_number      				INT NOT NULL,
	 	publication_date 				VARCHAR(80) NOT NULL
	);
	
	CREATE TABLE nsn_flis_parts (
		id 											INT NOT NULL,
		niin 										INT NOT NULL,
		part_number 						VARCHAR(32) NOT NULL, 
		unpunctuated 						VARCHAR(64) NOT NULL, 
		cage_code 							VARCHAR(5) NOT NULL, 
		rncc										VARCHAR(1) NOT NULL,
 	  rnvc										VARCHAR(1) NOT NULL,
  	dac											VARCHAR(1) NOT NULL,
  	rnaac            				VARCHAR(2) NOT NULL,
  	status           				VARCHAR(1) NOT NULL,
  	msds             				VARCHAR(5) NOT NULL,
  	sadc             				VARCHAR(2) NOT NULL,
  	fsc              				INT NOT NULL,
  	publication_date 				VARCHAR(10) NOT NULL
	);
	
`;

	await client.query(SQL);

	await client.query(sql1);
	await client.query(sql2);
	await client.query(sql3);
	await client.query(sql4);
	await client.query(sql5);
	await client.query(sql6);
	await client.query(sql7);
	// await client.query(sql8);
	// await client.query(sql9);
	// await client.query(sql10);
	// await client.query(sql11);
	// await client.query(sql12);
	// await client.query(sql13);
	// await client.query(sql14);
	// await client.query(sql15);
	await client.query(sql_2_1);
	await client.query(sql_2_2);
	await client.query(sql_2_3);
	await client.query(sql_2_4);
	await client.query(sql_2_5);
	await client.query(sql_2_6);
	await client.query(sql_2_7);

	// const _products = getProducts(250);

	// const [foo, bar, bazz] = await Promise.all(
	// 	Object.values(_products).map((product) => products.create(product))
	// );
};

const readProductList = async () => {
	const SQL =
		"SELECT nsn.niin, name, inc, nsn.fsc, fsg, country_code, item_number, nsn.publication_date, nsn_flis_parts.id, nsn_flis_parts.part_number, nsn_flis_parts.unpunctuated, nsn_flis_parts.cage_code, nsn_flis_parts.rncc, nsn_flis_parts.rnvc, nsn_flis_parts.dac, nsn_flis_parts.rnaac, nsn_flis_parts.status, nsn_flis_parts.msds, nsn_flis_parts.sadc  FROM nsn INNER JOIN nsn_flis_parts ON nsn.niin = nsn_flis_parts.niin";
	return (await client.query(SQL)).rows;
};

const getIndvProd = async (prodId) => {
	return (
		await client.query(
			`SELECT nsn.niin, name, inc, nsn.fsc, fsg, country_code, item_number, nsn.publication_date, nsn_flis_parts.id, nsn_flis_parts.part_number, nsn_flis_parts.unpunctuated, nsn_flis_parts.cage_code, nsn_flis_parts.rncc, nsn_flis_parts.rnvc, nsn_flis_parts.dac, nsn_flis_parts.rnaac, nsn_flis_parts.status, nsn_flis_parts.msds, nsn_flis_parts.sadc  FROM nsn INNER JOIN nsn_flis_parts ON nsn.niin = nsn_flis_parts.niin WHERE nsn.niin=$1`,
			[prodId]
		)
	).rows[0];
};

module.exports = {
	sync,
	readProductList,
	getIndvProd,
};
