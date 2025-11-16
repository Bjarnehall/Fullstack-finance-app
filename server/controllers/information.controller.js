const { getInformation } = require("../models/information.model.js");
const { availableTickers } = require("../variables/availableTickers.js");
/*
Takes ticker as an argument in the url and use it with 
the getInformation model. Returns the data to user.
*/
const getMetaDataTicker = async (req, res) => {
    const { ticker } = req.params;
    console.log(`api/ticker/get/information/${ticker} was called`);

    if (availableTickers.includes(ticker)) {
        try {
            const data = await getInformation(ticker);
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message});
        }
    } else {
        res.status(400).json({ error: "That ticker is not available" });
    }
};

/*
Return all tickers available in API.
*/
const getAvailableTickers = (req, res) => {
    console.log("api/ticker/get/available was called");
    res.status(200).json(availableTickers);
}


module.exports = {
    getMetaDataTicker,
    getAvailableTickers
};
