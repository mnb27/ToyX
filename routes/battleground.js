/*
    /battleground/enter takes to the login page for battleground
    /battleground is where the game is played
*/
const express = require('express');
const router = express.Router();
const ColoredLog = require('../utils/coloredlogger').ColoredLog
const RoomStaticUtils = require('../battleground/socketEventSetup').RoomStaticUtils

router.get('/enter', function (req, res) {

    res.render('battlegroundEntry', {
        visibility: 'hidden',
        msg: null
    });

});

router.post('/enter', function (req, res) {

    var roomname = req.body.roomname;
    var username = req.body.username;
    const joinedRoomname = RoomStaticUtils.getJoinedRoomname(username);
    console.log(ColoredLog.red("joinedRoomname: " + joinedRoomname + " by username: " + username, true))

    if (!roomname || roomname.indexOf(' ') > -1 || roomname.length === 0) {
        res.send({
            visibility: 'visible',
            msg: 'Invalid Roomname'
        });

    } else if (!username || username.length === 0) {
        res.send({
            visibility: 'visible',
            msg: 'Invalid Username'
        });

    } else if (joinedRoomname) {
        let msg2ndLine = "Cannot join 2 rooms at once!"

        if (joinedRoomname === roomname) {
            msg2ndLine = "Cannot rejoin same room from different tabs!"
        }

        res.send({
            visibility: 'visible',
            msg: `User ${username} already in Room ${joinedRoomname}! \n${msg2ndLine}`
        });

    } else {
        // res.redirect(`/battleground?roomname=${roomname}&username=${username}`)

        // check if the room alreaddy has a gameType

        let roomGameType = RoomStaticUtils.getRoomGameType(roomname); // todo: replace by some util to find the type of room, should return null if room doesn't exists!
        if (!roomGameType) {
            // redirect to the same url without gameType
            //  this will show UI to ask for `gametype`
            res.redirect(`/battleground/enter?roomname=${roomname}&username=${username}`)

        } else {
            // no need to ask for roomGameType, directly forward to battleground
            res.redirect(`/battleground?roomname=${roomname}&username=${username}&gameType=${roomGameType}`)
        }
    }

});


router.get('/', function (req, res) {
    let username = req.query.username
    let roomname = req.query.roomname

    if (!username || !roomname) {
        res.redirect("/battleground/enter")
        return;
    }

    res.render('battleground', {
        roomname: roomname,
        username: username
    });
});


// Exports

module.exports = router
