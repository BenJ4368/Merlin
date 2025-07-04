module.exports = {
    // Add your global variables here
    partyMode: false,
	festMode: false,

    // You can also add functions to manage the variables
    setPartyMode(value) {
        this.myGlobalVar = value;
    },
    getPartyMode() {
        return this.myGlobalVar;
    },
	setFestMode(value) {
		this.festMode = value;
	},
	getFestMode() {
		return this.festMode;
	},
};