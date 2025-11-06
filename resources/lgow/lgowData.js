const Jimp = require('jimp');
const { EmbedBuilder } = require('discord.js');

function stealRole(role) {
	switch (role.getName()) {
		case 'Archer':
			return new Archer();
		case 'Servante dévouée':
			return new Servante();
		case 'Erudit':
			return new Erudit();
		default:
			return role;
	}
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

class Prouveur extends BaseRole {
	constructor() {
		super();
		this.name = 'Prouveur';
		this.description = '**Objectif:** Soyez l\'action de la partie\n  **ou**\nAyez plus d\'éliminations que chacun de vos coequipier.';
		this.color = '#0066ff';
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
		this.name = 'Servante dévouée';
		this.description = '**Objectif:** Ayez le même nombre de morts que votre maître.\n';
		this.color = '#ff00ff';
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
		this.color = '#000066';
		this.target = null;
	}

	setTarget(player) { this.target = player }
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
		this.color = '#29a329';
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

	async setRandomWords() {
		const response = await fetch('https://trouve-mot.fr/api/random/3');
		if (!response.ok) {
			this.words = "vraiment, Super, Genial"
			console.error('Erreur lors de la récupération des mots.');
			return;
		}

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
		this.color = '#b38600';
	}
}

class Agent extends BaseRole {
	constructor() {
		super();
		this.name = this.setName();
		this.description = '**Objectif:** Jouez uniquement des héros qui appartiennent au camp attribué.';
		this.color = '#999999';
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
				{ name: "Tank:", value: "D.VA\nReinhardt\nWinston\nZarya", inline: true },
				{ name: "Dps:", value: "Bastion\nCassidy\nEcho\nGenji\nMei\nPharah\nSojourn\nSoldat76\nTorbjorn\nTracer", inline: true },
				{ name: "Supp:", value: "Ana\nAnge\nBrigitte\nLucio", inline: true }
			);
		else if (this.name == "Agent de la Griffe")
			embed.addFields(
				{ name: "Tank:", value: "Doomfist\nMauga\nSigma", inline: true },
				{ name: "Dps:", value: "Fatale\nFaucheur\nSombra", inline: true },
				{ name: "Supp:", value: "Moira", inline: true }
			);
		else if (this.name == "Agent du Secteur Zero")
			embed.addFields(
				{ name: "Tank:", value: "Orisa\nRamattra", inline: true },
				{ name: "Dps:", value: "Bastion\nEcho", inline: true },
				{ name: "Supp:", value: "Zenyatta", inline: true }
			);
		else if (this.name == "Agent Neutre")
			embed.addFields(
				{ name: "Tank:", value: "Bulldozer\nChopper\nReine des Junkers", inline: true },
				{ name: "Dps:", value: "Ashe\nChacal\nHanzo  Symmetra\nVenture", inline: true },
				{ name: "Supp:", value: "Juno\nBaptiste\nIllari\nKiriko\nVital", inline: true }
			);
		return embed;
	}
	async getImage() {
		if (this.name == 'Agent d\'Overwatch') {
			const image = await Jimp.read(`./resources/lgow/images/AgentOverwatch.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent de la Griffe") {
			const image = await Jimp.read(`./resources/lgow/images/AgentGriffe.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent du Secteur Zero") {
			const image = await Jimp.read(`./resources/lgow/images/AgentSecteurZero.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent Neutre") {
			const image = await Jimp.read(`./resources/lgow/images/AgentNeutre.png`);
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
		this.color = '#b300b3';
	}
}

class Archer extends BaseRole {
	constructor() {
		super();
		this.name = 'Archer';
		this.description = 'Ciblez un joueur et son rôle vous sera révéler.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#ff6600';
	}
	getEmbed() {
		const embed = super.getEmbed();
		embed.addFields(
				{ name: "Cibler un joueur :", value: " " }
			)
		return embed;
	}
}

module.exports = {
	stealRole, Imposteur, Prouveur, Aveugle, Servante, Voleur, Bouffon, Erudit, Peureux, Agent, Star, Sniper, Archer,
}