/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var gm = require('gm'),
    async = require('async'),
    picSizes = [
        [118,118],
        [344,344],
        [236,236],
        [354,354],
        [688,688],
        [1032,1032],
        [1242,1242]
    ],
    arr =[];

module.exports = {

    upload: function (req, res) {

        // e.g.
        // 0 => infinite
        // 240000 => 4 minutes (240,000 miliseconds)
        // etc.
        //
        // Node defaults to 2 minutes.
        res.setTimeout(0);

        req.file('picture')
            .upload({

                // You can apply a file upload limit (in bytes)
                maxBytes: 10000000,
                dirname: sails.config.cc.appRoot                            //require('path').resolve( __dirname, '../../assets/uploads' )

            }, function whenDone(err, uploadedFiles) {
                if (err){ return res.serverError(err);}
                else {

                    Violation.findOne(req.param('id')).exec(function (err, vio){
                        if (err) return res.negotiate(err);
                        if (!vio) return res.notFound();

                        vio.name = req.param('name');


                        for(var i=0,l=uploadedFiles.length; i<l; i++){
                            var file = uploadedFiles[i],
                                filename = file.fd.split('/').pop(),
                                ext = filename.split('.').pop(),
                                nme = filename.split('.')[0];


                            for(var n=0; n<picSizes.length; n++){

                                arr.push(

                                    function(n, callback) {
                                        return function(callback){
                                            var size = picSizes[n];
                                                gm(file.fd)
                                                    .resize(size[0], size[1], '^').noProfile()
                                                    .gravity('Top')
                                                    .crop(size[0], size[1])
                                                    .write( sails.config.cc.appRoot+'/'+nme+'_'+size[0]+'x'+size[1]+'.'+ext, function (err) {
                                                        if(err) {
                                                            res.send(500, err);
                                                            console.log(err);
                                                        } else {
    //                                                        console.log('created: ', sails.config.cc.appRoot+'/'+nme+'_'+size[0]+'x'+size[1]+'.'+ext);
                                                            callback(null, '/uploads/'+nme+'_'+size[0]+'x'+size[1]+'.'+ext);

                                                        }
                                                    });
                                        }
                                    }(n)
                                );
                            }


                            async.parallelLimit( arr, 10, function(err, results) {
                                if(err) res.negotiate(err);
    //                            console.log('err:',err);
    //                            console.log('res:', results);

                                vio.content = {
                                    original : '/uploads/'+uploadedFiles[0].fd.split('/').pop(),
                                    images : results
                                };
                                vio.save(function (err, saved) {
                                    if(err) res.negotiate(err);
                                    console.log( saved );

                                    return res.json({
                                        original: uploadedFiles,
                                        textParams: req.params.all(),
                                        thumbs: results
                                    });
                                });

                            });
                        }


                    });
                }
            });
    },

    /**
     * `FileController.s3upload()`
     *
     * Upload file(s) to an S3 bucket.
     *
     * NOTE:
     * If this is a really big file, you'll want to change
     * the TCP connection timeout.  This is demonstrated as the
     * first line of the action below.
     */
    s3upload: function (req, res) {

        // e.g.
        // 0 => infinite
        // 240000 => 4 minutes (240,000 miliseconds)
        // etc.
        //
        // Node defaults to 2 minutes.
        res.setTimeout(0);

        req.file('avatar').upload({
            adapter: require('skipper-s3'),
            bucket: process.env.BUCKET,
            key: process.env.KEY,
            secret: process.env.SECRET
        }, function whenDone(err, uploadedFiles) {
            if (err) return res.serverError(err);
            else return res.json({
                files: uploadedFiles,
                textParams: req.params.all()
            });
        });
    },


    /**
     * FileController.download()
     *
     * Download a file from the server's disk.
     */
    download: function (req, res) {
        require('fs').createReadStream(req.param('path'))
            .on('error', function (err) {
                return res.serverError(err);
            })
            .pipe(res);
    }
};