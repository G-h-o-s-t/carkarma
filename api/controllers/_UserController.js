/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    new: function (req, res) {
        return res.view('newUser');
    },

    list: function(req, res) {
        console.log( req.sessionID ) ;

        //User.update({id: loggedInUserId}, {currentSessionId: req.sessionID})
        //    .exec(function(err) {
        //        if (err) {return res.serverError(err);}
        //        // Continue your login action...
        //    });


       return res.send(200, 'Welcome ))');
    }

};

