const { Client } = require('pg');
const config = require('./config');
const clr = require('./resources/color_codes');

const dbClient = new Client({
	user: config.DBuser,
	host: config.DBhost,
	database: config.DBname,
	password: config.DBpassword,
	port: config.DBport,
});

dbClient.connect()
    .then(async () => {
		console.log(`${clr.grn}[PG]	Connexion à PostgreSQL établie${clr.stop}`);
		try {
			await dbClient.query(`
				CREATE DATABASE IF NOT EXISTS merlinDB;
				GRANT ALL PRIVILEGES ON DATABASE merlinDB TO postgresuser;
			`);
			console.log(`${clr.grn}[PG]	DATABASE merlindb OK${clr.stop}`);
			await dbClient.query(`
				CREATE TABLE IF NOT EXISTS vip_users (
					user_id VARCHAR(50) PRIMARY KEY,
					expiration_time BIGINT NOT NULL
				);
			`);
			console.log(`${clr.grn}[PG]	TABLE vip_users OK${clr.stop}`);
		} catch (err) {
			console.error(`${clr.red}[PG]	Erreur lors de la création de la table vip_users${clr.stop}`, err);
		}
	})
	.catch(err => console.error(`${clr.red}[PG]	Erreur de connexion à PostgreSQL${clr.stop}`, err));

module.exports = dbClient;