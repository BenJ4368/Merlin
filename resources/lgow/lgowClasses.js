const Jimp = require('jimp');
const { EmbedBuilder, ButtonStyle } = require('discord.js');

function getPointSigns(points) {
	if (points > 0)
		return `🔹+${points}`;
	else if (points = 0)
		return `-`;
	else
		return `🔻${points}`;
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
	setPlayerRole(player, roles) { this.roles.set(player, [roles]); }
	getPlayerRoles(player) { return this.roles.get(player) || []; }
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
		this.image_path = `./resources/lgow/images/${this.name}.png`;
		this.points_win = +5;
		this.points_lose = -5;
		this.points_objective_success = 0;
		this.points_objective_fail = 0;
		this.points_vote_avoided = 0;
		this.points_vote_suffered = 0;
		this.points_vote_impostor_correct = +10;
		this.points_vote_impostor_incorrect = 0;
		this.points_vote_role_correct = +10;
		this.points_vote_role_incorrect = -10;
		this.score = 0;
	}

	getName() { return this.name; }
	getDescription() { return this.description; }
	getColor() { return this.color; }
	getImagePath() { return this.image_path; }

	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle("Loup Garou Overwatch")
			.setDescription(`_ _\nVous êtes...                        **${this.name.toUpperCase()}**\n_ _`)
			.addFields(
				{
				name: "Description:",
				value: `${this.description}\n_ _`,
				inline: false
				},
				{
					name: "Partie gagnée",
					value: getPointSigns(this.points_win),
					inline: true
				},
				{
					name: "Partie perdue",
					value: getPointSigns(this.points_lose),
					inline: true
				},
				{
					name: "",
					value: "",
					inline: true
				},
				{
					name: "Objectif validé",
					value: getPointSigns(this.points_objective_success),
					inline: true
				},
				{
					name: "Objectif raté",
					value: getPointSigns(this.points_objective_fail),
					inline: true
				},
				{
					name: "",
					value: "",
					inline: true
				},
				{
					name: "Vote évité",
					value: getPointSigns(this.points_vote_avoided),
					inline: true
				},
				{
					name: "Vote subis",
					value: getPointSigns(this.points_vote_suffered),
					inline: true
				},
				{
					name: "",
					value: "",
					inline: true
				},
				{
					name: "Vote imposteur correcte",
					value: getPointSigns(this.points_vote_impostor_correct),
					inline: true
				},
				{
					name: "Vote imposteur incorrecte",
					value: getPointSigns(this.points_vote_impostor_incorrect),
					inline: true
				},
				{
					name: "",
					value: "",
					inline: true
				},
				{
					name: "Vote rôle correcte",
					value: getPointSigns(this.points_vote_role_correct),
					inline: true
				},
				{
					name: "Vote rôle incorrecte",
					value: getPointSigns(this.points_vote_role_incorrect),
					inline: true
				},
				{
					name: "",
					value: "",
					inline: true
				},
			)
			.setImage(this.getImagePath())
			.setColor(this.color)
			.setFooter({
				text: "Merlin feras le calcul des points en toute fin de jeu.",
			});
		return embed;
	}
}

class Imposteur extends BaseRole {
	constructor() {
		super();
		this.name = 'Imposteur';
		this.description = 'Faites perdre la partie sans éveiller les soupçons de votre équipe.';
		this.color = '#ff0000';
		this.points_win = -20;
		this.points_lose = +20;
		this.points_vote_avoided = +10;
		this.points_vote_suffered = -10;
		this.points_vote_impostor_correct = 0;
	}
}

class Bot extends BaseRole {
	constructor() {
		super();
		this.name = 'Bot';
		this.description = 'Gagnez simplement la partie.';
		this.color = '#777777';
		this.points_win = +15;
	}
}

class Prouveur extends BaseRole {
	constructor() {
		super();
		this.name = 'Prouveur';
		this.description = 'Ayez plus d\'éliminations que chacun de vos coéquipier.';
		this.color = '#0400ff';
		this.points_objective_success = +15;
		this.points_objective_fail = -5;
	}
}

class Aveugle extends BaseRole{
	constructor() {
		super();
		this.name = 'Aveugle';
		this.description = 'Jouez sans aucune interface durant toute la partie.\nalt+z ou alt+w pour masquer l\'interface';
		this.color = '#ffffff';
		this.points_win = +10;
		this.points_vote_suffered = -5;
	}
}

class Servante extends BaseRole {
	constructor() {
		super();
		this.name = 'Servante';
		this.description = 'Ayez le même nombre de morts que votre maître.\n';
		this.color = '#68107e';
		this.master = null;
		this.points_objective_success = +10;
		this.points_objective_fail = -5;
	}

	setMaster(player) { this.master = player }
	getMaster() { return this.master }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;

		fields.splice(1, 0, {
			name: `Votre maître est :`,
			value: `**${this.master.username}**_ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class Voleur extends BaseRole {
	constructor() {
		super();
		this.name = 'Voleur';
		this.description = 'Volez le rôle d\'un joueur de votre choix.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#03520a';
		this.target = null;
		this.targetRole = null;
	}

	setTarget(player, role) { this.target = player; this.targetRole = role; }
	getTarget() { return this.target; }
	getTargetRole() { return this.targetRole; }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;
		fields.splice(1, 0, {
			name: `Choisissez un joueur parmis les choix sous ce message._ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class Bouffon extends BaseRole {
	constructor() {
		super();
		this.name = 'Bouffon';
		this.description = 'Trompez votre équipe pour qu\'elle vous vote Imposteur.';
		this.color = '#00ff00';
		this.points_win = 0;
		this.points_lose = 0;
		this.points_vote_avoided = -5;
		this.points_vote_suffered = +10;
	}
}

class Erudit extends BaseRole {
	constructor() {
		super();
		this.name = 'Erudit';
		this.description = 'Placez, à haute voix, les 3 mots aléatoire qui vous sont donnés.';
		this.color = '#00ccff';
		this.words = '';
		this.points_objective_success = +10;
		this.points_objective_fail = -5;
		this.points_vote_suffered = -5;
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
		const fields = embed.data.fields;

		fields.splice(1, 0, {
			name: `Placez les mots suivans:`,
			value: `**${this.words}**_ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class Peureux extends BaseRole {
	constructor() {
		super();
		this.name = 'Peureux';
		this.description = 'Ayez moins de morts que chacun de vos coequipiers à la fin de la partie.';
		this.color = '#462200';
		this.points_win = +5;
		this.points_lose = -5;
		this.points_objective_success = +15;
		this.points_objective_fail = -5;
		this.points_vote_avoided = 0;
		this.points_vote_suffered = 0;
		this.points_vote_role_revealed = +5;
	}
}

class Agent extends BaseRole {
	constructor() {
		super();
		this.name = this.setName();
		this.description = 'Ne jouez que des héros qui appartiennent au camp attribué.';
		this.color = '#808080';
		this.points_objective_fail = -5;
	}

	setName() {
		const names = ['Agent d\'Overwatch', 'Agent de la Griffe', 'Agent du Secteur Zero', 'Agent Neutre'];
		const index = Math.floor(Math.random() * names.length);
		return names[index];
	}
	getName() { return this.name }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;


		if (this.name == 'Agent d\'Overwatch') {
			this.points_objective_success = +10;
			fields.splice(1, 0, { name: "Tank:", value: "D.VA\nReinhardt\nWinston\nZarya\nOrisa", inline: true });
			fields.splice(2, 0, { name: "Dps:", value: "Bastion\nCassidy\nEcho\nGenji\nMei\nPharah\nSojourn\nSoldat76\nTorbjorn\nTracer", inline: true });
			fields.splice(3, 0, { name: "Supp:", value: "Ana\nAnge\nBrigitte\nLucio\nBaptiste\nJuno\nWuyang", inline: true });
			embed.setFields(fields);
		}
		else if (this.name == "Agent de la Griffe") {
			this.points_objective_success = +15;
			fields.splice(1, 0, { name: "Tank:", value: "Doomfist\nMauga\nSigma", inline: true });
			fields.splice(2, 0, { name: "Dps:", value: "Fatale\nFaucheur\nSombra", inline: true });
			fields.splice(3, 0, { name: "Supp:", value: "Moira\nAnge", inline: true });
			embed.setFields(fields);
		}
		else if (this.name == "Agent du Secteur Zero") {
			this.points_objective_success = +15;
			fields.splice(1, 0, { name: "Tank:", value: "Orisa\nRamattra", inline: true });
			fields.splice(2, 0, { name: "Dps:", value: "Bastion\nEcho", inline: true });
			fields.splice(3, 0, { name: "Supp:", value: "Zenyatta\nAna", inline: true });
			embed.setFields(fields);
		}
		else if (this.name == "Agent Neutre") {
			this.points_objective_success = +10;
			fields.splice(1, 0, { name: "Tank:", value: "Bulldozer\nChopper\nReine des Junkers\nHazard", inline: true });
			fields.splice(2, 0, { name: "Dps:", value: "Ashe\nChacal\nHanzo\nSymmetra\nVenture\nFreya", inline: true });
			fields.splice(3, 0, { name: "Supp:", value: "Illari\nKiriko\nVital", inline: true });
			embed.setFields(fields);
		}
		return embed;
	}
	getImagePath() {
		switch (this.name) {
			case 'Agent d\'Overwatch':
				return `./resources/lgow/images/AgentOverwatch.png`;
			case 'Agent de la Griffe':
				return `./resources/lgow/images/AgentGriffe.png`;
			case 'Agent du Secteur Zero':
				return `./resources/lgow/images/AgentSecteurZero.png`;
			default:
				return `./resources/lgow/images/AgentNeutre.png`;
		}
	}
}

class Star extends BaseRole {
	constructor() {
		super();
		this.name = 'Star';
		this.description = 'Soyez l\'Action de la partie.';
		this.color = '#ffff00';
		this.points_win = +10;
		this.points_objective_success = +25;
		this.points_objective_fail = -5;
	}
}

class Sniper extends BaseRole {
	constructor() {
		super();
		this.name = 'Sniper';
		this.description = 'Voter contre l\'Imposteur vous rapporte beaucoup plus de points.';
		this.color = '#5f0000';
		this.points_vote_impostor_correct = +25;
		this.points_vote_impostor_incorrect = -5;
		this.points_vote_role_correct = +10; // 15 ?
		this.points_vote_role_incorrect = -10; // -5 ?
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
		this.points_win = +10;
	}

	setTarget(player, role) { this.target = player; this.targetRole= role; }
	getTarget() { return this.target; }
	getTargetRole() { return this.targetRole; }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;
		fields.splice(1, 0, {
			name: `Choisissez un joueur parmis les choix sous ce message._ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class Parieur extends BaseRole {
	constructor() {
		super();
		this.name = 'Parieur';
		this.description = 'Pariez sur vos éliminations.\nGagnez des points si votre pari est juste.';
		this.color = '#dfa60b';
		this.bet = null;
		this.points_objective_success = +20;
		this.points_objective_fail = -10;
	}
	setBet(bet) { this.bet = bet }
	getBet() { return this.bet }
	getBets() { return ['0-9 kills', '10-19 kills', '20-29 kills', '30+ kills']; }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;
		fields.splice(1, 0, {
			name: `Choisissez un paris parmis les choix sous ce message._ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class Muet extends BaseRole {
	constructor() {
		super();
		this.name = 'Muet';
		this.description = 'Ne faites aucun son pendant 30 secondes, à trois reprises, pour gagner des points.';
		this.color = '#2c2c2c';
		this.points_objective_success = +10;
		this.points_vote_suffered = -5;
	}
}

class Mercenaire extends BaseRole {
	constructor() {
		super();
		this.name = 'Mercenaire';
		this.description = 'Portez le coup final à chaque adversaire au moins une fois.\nUne fois l\'objectif atteint, choisissez votre nouveau rôleentre Bot ou Imposteur.';
		this.color = '#ff3300';
		this.missionAccomplished = false;
		this.chosenRole = null;
		this.points_win = 0;
		this.points_lose = 0;
		this.points_objective_success = 0; // en fonction du role choisis, a faire
		this.points_objective_fail = -15;
		this.points_vote_impostor_correct = 0;
		this.points_vote_role_correct = 0;
		this.points_vote_role_incorrect = 0;
	}

	setMissionAccomplished(status) { this.missionAccomplished = status; }
	getMissionAccomplished() { return this.missionAccomplished; }
	setChosenRole(role) { this.chosenRole = role; }
	getChosenRole() { return this.chosenRole; }
		getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;
		fields.splice(1, 0, {
			name: `Signalez l'accomplissement de votre mission en cliquant sur le bouton sous ce message._ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}

}

class Cupidon extends BaseRole {
	constructor() {
		super();
		this.name = 'Cupidon';
		this.description = 'Ciblez deux joueurs qui deviendront amoureux.\nLes amoureux gagnent des points en ayant le même nombre de morts.\nVous gagnez la différence de morts des amoureux, fois 5.';
		this.color = '#ff52c5';
		this.lovers = new Map();
		this.points_objective_success = 5; // x le nombre de morts de differences des amoureux
		this.points_objective_fail = -5; // les amoureux ont les memes morts
	}

	setLovers(lover) { this.lovers.set(lover, 0); }
	getLovers() { return Array.from(this.lovers.keys()); }
	addLoverPoints(lover, points) {
		if (this.lovers.has(lover)) {
			this.lovers.set(lover, this.lovers.get(lover) + points);
		}
	}
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;
		fields.splice(1, 0, {
			name: `Selectionnez deux amoureux parmis les choix sous ce message._ _`,
			inline: false
		});
		embed.setFields(fields);
		return embed;
	}
}

class ChasseurDePrime extends BaseRole {
	constructor() {
		super();
		this.name = 'ChasseurDePrime';
		this.description = 'Une cible vous est designée.\nFaites en sorte que votre cible ait le plus grand nombre de morts de l\'équipe adverse pour gagner des points.';
		this.color = '#b84a0a';
		this.target = null;
		this.points_win = 0;
		this.points_objective_success = +20;
		this.points_objective_fail = -5;

		const targetList = ["Tank", "DPS 1", "Support 1", "DPS 2", "Support 2"];
        this.target = targetList[Math.floor(Math.random() * targetList.length)];
	}

	getTarget() { return this.target; }
	getEmbed() {
		const embed = super.getEmbed();
		const fields = embed.data.fields;

		fields.splice(1, 0, {
			name: `Votre cible est :`,
			value: `**${this.target}**_ _`,
		});
		embed.setFields(fields);
		return embed;
	}
}

module.exports = {
	GameInstance, Imposteur, Bot, Prouveur, Aveugle, Servante, Voleur, Bouffon, Erudit, Peureux, Agent, Star, Sniper, Archer, Parieur, Muet, Mercenaire, Cupidon, ChasseurDePrime
}