const { shutdownData, getKnex, tables } = require('../src/data');

module.exports = async () => {
	await getKnex()(tables.gebruikers).delete();
	await getKnex()(tables.gewoontes).delete();
	await getKnex()(tables.taken).delete();
    await getKnex()(tables.stats).delete();
    await getKnex()(tables.stockmarket).delete();

	await shutdownData();
}