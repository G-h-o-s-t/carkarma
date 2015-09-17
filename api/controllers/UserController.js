/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    list: function(req, res) {
       console.log( req.session ) ;

       return res.send(200, 'Welcome ))');
    }

};

