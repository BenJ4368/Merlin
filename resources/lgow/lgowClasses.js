const Jimp = require('jimp');
const { EmbedBuilder, ButtonStyle } = require('discord.js');

function stealRole(role) {
	switch (role.getName()) {
		case 'Archer':
			return new Archer();
		case 'Servante':
			return new Servante();
		case 'Erudit':
			return new Erudit();
		default:
			return role;
	}
}

class GameInstance {
	constructor(players) {
		this.players = players;
		this.rolesPool = [Prouveur, Aveugle, Servante, Voleur, Bouffon,
							Erudit, Peureux, Agent, Star, Sniper, Archer,
							Parieur, Muet, Mercenaire, Cupidon, ChasseurDePrime];
		this.roles = new Map();
		this.points = new Map();
		this.winner = null;
	}
	getPlayers() { return this.players; }
	setPlayerRole(player, roles) { this.roles.set(player, roles); }
	getPlayerRoles(player) { return this.roles.get(player); }
	addPlayerRole(player, roles) {
		const currentRoles = this.roles.get(player) || [];
		currentRoles.push(roles);
		this.roles.set(player, currentRoles);
	}
	removePlayerRole(player, role) {
		const currentRoles = this.roles.get(player) || [];
		this.roles.set(player, currentRoles.filter(r => r !== role));
	}
	initPlayerPoints(player) {
		this.points.set(player, 0);
	}
	addPlayerPoints(player, points) {
		const currentPoints = this.points.get(player) || 0;
		this.points.set(player, currentPoints + points);
	}
	removePlayerPoints(player, points) {
		const currentPoints = this.points.get(player) || 0;
		this.points.set(player, currentPoints - points);
	}
	setWinner(winner) { this.winner = winner; }
	getWinner() { return this.winner; }

}

class BaseRole {
	constructor() {
		this.name = 'BaseRole';
		this.description = 'Description de base';
		this.color = '#000000';
	}

	getName() { return this.name; }
	getDescription() { return this.description; }
	getColor() { return this.color; }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/${this.name}.png`);
		if (!image)
			throw new Error(`Image du role ${this.name} introuvable.`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Imposteur extends BaseRole {
	constructor() {
		super();
		this.name = 'Imposteur';
		this.description = 'Faites perdre la partie sans éveiller les soupçons de votre équipe.';
		this.color = '#ff0000';
	}
}

class Bot extends BaseRole {
	constructor() {
		super();
		this.name = 'Bot';
		this.description = 'Gagnez simplement la partie pour gagnez des points.';
		this.color = '#777777';
	}
}

class Prouveur extends BaseRole {
	constructor() {
		super();
		this.name = 'Prouveur';
		this.description = '**Objectif:** Soyez l\'action de la partie\n  **ou**\nAyez plus d\'éliminations que chacun de vos coequipier.';
		this.color = '#0400ff';
	}
}

class Aveugle extends BaseRole{
	constructor() {
		super();
		this.name = 'Aveugle';
		this.description = 'Jouez sans aucune interface durant toute la partie.\nalt+z ou alt+w pour masquer l\'interface';
		this.color = '#ffffff';
	}
}

class Servante extends BaseRole {
	constructor() {
		super();
		this.name = 'Servante';
		this.description = '**Objectif:** Ayez le même nombre de morts que votre maître.\n';
		this.color = '#68107e';
		this.master = null;
	}

	setMaster(player) { this.master = player }
	getMaster() { return this.master }
	getEmbed() {
		const embed = super.getEmbed();
		embed.addFields(
			{ name: 'Votre maître pour cette partie est :', value: `${this.master.username}`, inline: true }
		);
		return embed;
	}
}

class Voleur extends BaseRole {
	constructor() {
		super();
		this.name = 'Voleur';
		this.description = 'Volez le role d\'un joueur de votre choix.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#03520a';
		this.target = null;
		this.targetRole = null;
	}

	setTarget(player, role) { this.target = player; this.targetRole = role; }
	getTarget() { return this.target; }
	getTargetRole() { return this.targetRole; }
	getEmbed() {
		const embed = super.getEmbed();
		embed.addFields(
				{ name: 'Choisissez votre cible :', value: " " }
			);
		return embed;
	}
}

class Bouffon extends BaseRole {
	constructor() {
		super();
		this.name = 'Bouffon';
		this.description = 'Trompez votre équipe pour qu\'elle vous vote Imposteur.';
		this.color = '#00ff00';
	}
}

class Erudit extends BaseRole {
	constructor() {
		super();
		this.name = 'Erudit';
		this.description = '**Objectif:** Placez, à haute voix, les 3 mots aléatoire qui vous sont donnés.';
		this.color = '#00ccff';
		this.words = '';
	}

	async initEruditWords() {
		const response = await fetch('https://trouve-mot.fr/api/random/3');
		if (!response.ok)
			throw new Error('Erreur lors de la récupération des mots.');

		const responseJson = await response.json();
		const randomWords = responseJson.map(mot => mot.name).join(', ');
		this.words = randomWords;
	}
	getWords() { return this.words }
	getEmbed() {
		const embed = super.getEmbed();
			embed.addFields([
				{ name: "Vos mots sont:", value: this.words, inline: true }
			]);
		return embed;
	}
}

class Peureux extends BaseRole {
	constructor() {
		super();
		this.name = 'Peureux';
		this.description = '**Objectif:** Ayez moins de morts que chacun de vos coequipier à la fin de la partie.';
		this.color = '#462200';
	}
}

class Agent extends BaseRole {
	constructor() {
		super();
		this.name = this.setName();
		this.description = '**Objectif:** Jouez uniquement des héros qui appartiennent au camp attribué.';
		this.color = '#808080';
	}

	setName() {
		const names = ['Agent d\'Overwatch', 'Agent de la Griffe', 'Agent du Secteur Zero', 'Agent Neutre'];
		const index = Math.floor(Math.random() * names.length);
		return names[index];
	}
	getName() { return this.name }
	getEmbed() {
		const embed = super.getEmbed();
		if (this.name == 'Agent d\'Overwatch')
			embed.addFields(
				{ name: "Tank:", value: "D.VA\nReinhardt\nWinston\nZarya\nOrisa", inline: true },
				{ name: "Dps:", value: "Bastion\nCassidy\nEcho\nGenji\nMei\nPharah\nSojourn\nSoldat76\nTorbjorn\nTracer", inline: true },
				{ name: "Supp:", value: "Ana\nAnge\nBrigitte\nLucio\nBaptiste\nJuno\nWuyang", inline: true }
			);
		else if (this.name == "Agent de la Griffe")
			embed.addFields(
				{ name: "Tank:", value: "Doomfist\nMauga\nSigma", inline: true },
				{ name: "Dps:", value: "Fatale\nFaucheur\nSombra", inline: true },
				{ name: "Supp:", value: "Moira\nAnge", inline: true }
			);
		else if (this.name == "Agent du Secteur Zero")
			embed.addFields(
				{ name: "Tank:", value: "Orisa\nRamattra", inline: true },
				{ name: "Dps:", value: "Bastion\nEcho", inline: true },
				{ name: "Supp:", value: "Zenyatta\nAna", inline: true }
			);
		else if (this.name == "Agent Neutre")
			embed.addFields(
				{ name: "Tank:", value: "Bulldozer\nChopper\nReine des Junkers\nHazard", inline: true },
				{ name: "Dps:", value: "Ashe\nChacal\nHanzo\nSymmetra\nVenture\nFreya", inline: true },
				{ name: "Supp:", value: "Illari\nKiriko\nVital", inline: true }
			);
		return embed;
	}
	async getImage() {
		if (this.name == 'Agent d\'Overwatch') {
			const image = await Jimp.read(`./resources/lgow/images/AgentOverwatch.png`);
			if (!image) throw new Error(`Image du role ${this.name} introuvable.`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent de la Griffe") {
			const image = await Jimp.read(`./resources/lgow/images/AgentGriffe.png`);
			if (!image) throw new Error(`Image du role ${this.name} introuvable.`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent du Secteur Zero") {
			const image = await Jimp.read(`./resources/lgow/images/AgentSecteurZero.png`);
			if (!image) throw new Error(`Image du role ${this.name} introuvable.`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent Neutre") {
			const image = await Jimp.read(`./resources/lgow/images/AgentNeutre.png`);
			if (!image) throw new Error(`Image du role ${this.name} introuvable.`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
	}

}

class Star extends BaseRole {
	constructor() {
		super();
		this.name = 'Star';
		this.description = '**Objectif:** Soyez l\'Action de la partie.';
		this.color = '#ffff00';
	}
}

class Sniper extends BaseRole {
	constructor() {
		super();
		this.name = 'Sniper';
		this.description = 'Votre vote contre l\'Imposteur vous rapporte 3x plus de points.';
		this.color = '#5f0000';
	}
}

class Archer extends BaseRole {
	constructor() {
		super();
		this.name = 'Archer';
		this.description = 'Ciblez un joueur et son rôle vous sera révéler.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#ffc548';
		this.target = null;
		this.targetRole = null;
	}

	setTarget(player, role) { this.target = player; this.targetRole = role; }
	getTarget() { return this.target; }
	getTargetRole() { return this.targetRole; }
	getEmbed() {
		const embed = super.getEmbed();
		embed.addFields(
				{ name: "Cibler un joueur :", value: " " }
			)
		return embed;
	}
}

class Parieur extends BaseRole {
	constructor() {
		super();
		this.name = 'Parieur';
		this.description = 'Pariez sur le montant de vos kills.\nGagnez des points si votre pari est juste.';
		this.color = '#dfa60b';
		this.bet = null;
	}
	setBet(bet) { this.bet = bet }
	getBets() { return ['0-9 kills', '10-19 kills', '20-29 kills', '30+ kills']; }
}

class Muet extends BaseRole {
	constructor() {
		super();
		this.name = 'Muet';
		this.description = 'Ne faites aucun son pendant 30 secondes, à trois reprises, pour gagner des points.';
		this.color = '#2c2c2c';
	}
}

class Mercenaire extends BaseRole {
	constructor() {
		super();
		this.name = 'Mercenaire';
		this.description = 'Portez le coup final à chaque adversaire au moins une fois.\nUne fois l\'objectif atteint, changez de rôle pour Bot ou Imposteur.';
		this.color = '#ff3300';
	}
}

class Cupidon extends BaseRole {
	constructor() {
		super();
		this.name = 'Cupidon';
		this.description = 'Choisissez deux personnes qui deviendront amoureuses.\nElles doivent avoir le même nombre de morts pour gagner des points. Sinon, vous gagnez la différence.';
		this.color = '#ff52c5';
	}
}

class ChasseurDePrime extends BaseRole {
	constructor() {
		super();
		this.name = 'ChasseurDePrime';
		this.description = 'Une cible vous est designée.\nFaites en sorte que votre cible ait le plus grand nombre de morts dans l\'équipe adverse pour gagner des points.';
		this.color = '#b84a0a';
	}
}

module.exports = {
	stealRole, GameInstance, Imposteur, Bot, Prouveur, Aveugle, Servante, Voleur, Bouffon, Erudit, Peureux, Agent, Star, Sniper, Archer, Parieur, Muet, Mercenaire, Cupidon, ChasseurDePrime
}