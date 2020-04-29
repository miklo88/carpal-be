const express = require("express");
const router = express.Router();
const { Rides } = require("../Classes/rides");

const rides = new Rides();

router.get("/", async (req, res, next) => {
    try {
        const allRides = await rides.getDetail();
        const { start_location, end_location } = req.body;
        if (start_location && end_location) {
            const filteredRides = allRides.filter((ride) => {
                const isClose = (coor1, coor2) => {
                   return Math.abs(coor1 - coor2) < 0.6                     
                }
                const startLatDif = isClose(ride.start_location.lat, start_location.lat)
                const startLongDif = isClose(ride.start_location.long, start_location.long)
                const endLongDif = isClose(ride.end_location.long, end_location.long)
                const endLatDif = isClose(ride.end_location.lat, end_location.lat)
                if (startLatDif &&
                  startLongDif &&
                  endLongDif &&
                  endLatDif) {
                    return ride
                }
            })
            res.json(filteredRides)
        }
        res.json(allRides);
    } catch (err) {
        next(err);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        res.json(await rides.findBy({ id: req.params.id }));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
