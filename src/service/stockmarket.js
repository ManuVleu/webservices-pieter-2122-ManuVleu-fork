const { getChildLogger } = require('../core/logging');
//Ophalen data hier. const STOCKMARKETS
//getGebruikersID

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('stockmarket-service');
	this.logger.debug(message, meta);
};

const getAll = () => {
	debugLog('Ophalen van alle STOCKMARKETS');
	return { data: STOCKMARKETS, count: STOCKMARKETS.length };
};

const getById = (id) => {
	debugLog(`Ophalen stockmarket met id ${id}`);
	return STOCKMARKETS.filter((stockmarket) => stockmarket.id === id)[0];
};

const create = () => {
    
	const newStockmarket = { id: getGebruikerID(), bedrijfA: 0, bedrijfB: 0, bedrijfC: 0 };
	debugLog('Nieuwe stockmarket gemaakt', newStockmarket);
	//Voeg stockmarket toe aan STOCKMARKETS
	return newStockmarket;
};

const updateById = (id, { bedrijfA, bedrijfB, bedrijfC }) => {
	debugLog(`Updating stockmarket met id ${id}`, { bedrijfA, bedrijfB, bedrijfC });
    //index van stockmarket in STOCKMARKETS
	//const index = STOCKMARKETS.findIndex((stockmarket) => stockmarket.id === id);

    /*
	if (index < 0) return null;

	const stockmarket = STOCKMARKETS[index];
	stockmarket.naam = naam;
	stockmarket.eindDatum = eindDatum;
    stockmarket.punten = punten;
    */
	return stockmarket;
};

const deleteById = (id) => {
	debugLog(`Verwijderen van stockmarket met id ${id}`);
	//STOCKMARKETS = STOCKMARKETS.filter((stockmarket) => stockmarket.id !== id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
