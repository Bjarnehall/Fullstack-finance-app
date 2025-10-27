const { getInformation } = require("../models/metaData.model.js");

/*
Takes ticker as an argument in the url and use it with 
the getInformation model. Returns the data to user.
*/
const getMetaDataTicker = async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await getInformation(ticker);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to get Meta data" });
    }
};

module.exports = { getMetaDataTicker };
