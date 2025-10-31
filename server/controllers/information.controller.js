const { getInformation } = require("../models/information.model.js");
const { availableTickers } = require("../variables/availableTickers.js");
/*
Takes ticker as an argument in the url and use it with 
the getInformation model. Returns the data to user.
*/
const getMetaDataTicker = async (req, res) => {
    const { ticker } = req.params;
    if (availableTickers.includes(ticker)) {
        try {
            const data = await getInformation(ticker);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Failed to get information data" });
        }
    } else {
        res.status(400).json({ error: "That ticker is not available" });
    }
};

module.exports = { getMetaDataTicker };
