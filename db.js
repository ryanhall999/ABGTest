const pg = require("pg");
const sqls = require("./sql.js");

let sql1 = sqls.sql1;
let sql2 = sqls.sql2;
let sql3 = sqls.sql3;
let sql4 = sqls.sql4;
let sql5 = sqls.sql5;
let sql_2_1 = sqls.sql_2_1;
let sql_2_2 = sqls.sql_2_2;
let sql_2_3 = sqls.sql_2_3;
let sql_2_4 = sqls.sql_2_4;
let sql_2_5 = sqls.sql_2_5;
let sql_3_1 = sqls.sql_3_1;
let sql_3_2 = sqls.sql_3_2;
let sql_3_3 = sqls.sql_3_3;
let sql_3_4 = sqls.sql_3_4;
let sql_3_5 = sqls.sql_3_5;

const client = new pg.Client(
	process.env.DATABASE_URL || "postgres://localhost/ABGdb"
);

client.connect();

const sync = async () => {
	// Creates SQL tables
	const SQL = `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	DROP TABLE IF EXISTS nsn;
	DROP TABLE IF EXISTS nsn_flis_parts;
	DROP TABLE IF EXISTS nsn_characteristics;

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

	CREATE TABLE nsn_characteristics (
     id                     INT NOT NULL,
     niin                   INT NOT NULL,
     mrc                    VARCHAR(4) NOT NULL,
     requirements_statement VARCHAR(104) NOT NULL,
     clear_text_reply       VARCHAR(3117) NOT NULL,
     publication_date       VARCHAR(10) NOT NULL,
     uniqueid               VARCHAR(32) NOT NULL
  );  
	
	
`;

	await client.query(SQL);

	await client.query(sql1);
	await client.query(sql2);
	await client.query(sql3);
	await client.query(sql4);
	await client.query(sql5);

	await client.query(sql_2_1);
	await client.query(sql_2_2);
	await client.query(sql_2_3);
	await client.query(sql_2_4);
	await client.query(sql_2_5);

	await client.query(sql_3_1);
	await client.query(sql_3_2);
	await client.query(sql_3_3);
	await client.query(sql_3_4);
	await client.query(sql_3_5);
};

const readProductList = async () => {
	// Reads and combines all product tables
	const SQL = ` SELECT nsn.niin,
		NAME,
		inc,
		nsn.fsc,
		fsg,
		country_code,
		item_number,
		nsn.publication_date,
		nsn_flis_parts.id,
		nsn_flis_parts.part_number,
		nsn_flis_parts.unpunctuated,
		nsn_flis_parts.cage_code,
		nsn_flis_parts.rncc,
		nsn_flis_parts.rnvc,
		nsn_flis_parts.dac,
		nsn_flis_parts.rnaac,
		nsn_flis_parts.status,
		nsn_flis_parts.msds,
		nsn_flis_parts.sadc,
		nsn_characteristics.mrc,
		nsn_characteristics.requirements_statement,
		nsn_characteristics.clear_text_reply,
		nsn_characteristics.uniqueid
		FROM   nsn
		INNER JOIN nsn_flis_parts
						ON nsn.niin = nsn_flis_parts.niin
		INNER JOIN nsn_characteristics
						ON nsn.niin = nsn_characteristics.niin  `;
	return (await client.query(SQL)).rows;
};

const getIndvProd = async (prodId) => {
	// Finds product from search bar
	return (
		await client.query(
			` SELECT nsn.niin,
			NAME,
			inc,
			nsn.fsc,
			fsg,
			country_code,
			item_number,
			nsn.publication_date,
			nsn_flis_parts.id,
			nsn_flis_parts.part_number,
			nsn_flis_parts.unpunctuated,
			nsn_flis_parts.cage_code,
			nsn_flis_parts.rncc,
			nsn_flis_parts.rnvc,
			nsn_flis_parts.dac,
			nsn_flis_parts.rnaac,
			nsn_flis_parts.status,
			nsn_flis_parts.msds,
			nsn_flis_parts.sadc,
			nsn_characteristics.mrc,
			nsn_characteristics.requirements_statement,
			nsn_characteristics.clear_text_reply,
			nsn_characteristics.uniqueid
			FROM   nsn
			INNER JOIN nsn_flis_parts
							ON nsn.niin = nsn_flis_parts.niin
			INNER JOIN nsn_characteristics
							ON nsn.niin = nsn_characteristics.niin
	  	WHERE nsn.niin=$1`,
			[prodId]
		)
	).rows[0];
};

module.exports = {
	sync,
	readProductList,
	getIndvProd,
};
