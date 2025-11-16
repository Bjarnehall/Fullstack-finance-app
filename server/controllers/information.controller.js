const { getInformation } = require("../models/information.model.js");
const { validateTicker, listAllTickers } = require("../helpers/checks.helper.js");

/*
Return meta data about single ticker
*/
const getMetaDataTicker = async (req, res) => {
    const { ticker } = req.params;
    
    if (validateTicker(ticker) === "not-valid") {
        return res.status(400).json("That ticker is not available");
    }

    try {
        const data = await getInformation(ticker);
        res.json(data.information);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

/*
Return all tickers available
*/
const getAvailableTickers = (req, res) => {
    const tickers = listAllTickers();
    res.status(200).json(tickers);
}

module.exports = {
    getMetaDataTicker,
    getAvailableTickers
};
