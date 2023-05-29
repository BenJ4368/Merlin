const config = require("./config");
const fs = require('node:fs');
const Hirez = require('@joshmiquel/hirez');

/* image d'un spell */
// async function test() {
// 	const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
// 	const test = await hirez.getGods()
// 	console.log(test[0].godAbility1_URL);
// }
// test()


async function test() {
	const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
	const player = await hirez.getPlayer("Skylox4368");
	console.log(player)
	const test = await hirez.getGodRanks()
	console.log(test);
}
test()