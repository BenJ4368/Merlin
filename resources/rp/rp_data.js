class RPData {

	constructor() {
		this.status = 0; 
		this.gameMaster = null;
	}

	getStatus() { return this.status; }
	startSession(user) { 
		this.status = 1;
		this.gameMaster = user;
	}
	stopSession() { this.status = 0; }

	getGameMaster() { return this.gameMaster; }
};

const rpData = new RPData();
module.exports = rpData;