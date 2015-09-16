/**
 * Thankyou Global Variables
 *
 *
 */

module.exports.cc = {

    appRoot       : require('path').resolve( __dirname, '../assets/uploads' ) ,            // root sails folder for UPLOAD files..
    staticDir     : require('path').resolve( __dirname, '../.tmp' ),        // куда монтируем статику ( /home/www/.tmp/[upload] )
    clientNoImage : '/img/blank_avatar.jpg',        // использовать Эту картинку, если клиент ничего не загрузил.
    defaultTitle :  'Car Karma site',
//    maxDbQueries : 15,                            // максимальное количество обращений к базе за один запрос,
                                                    // используется в async.queue(worker,maxDbQueries) для большого количества запросов

//// e-mail sending opts
//    emailService :  'gmail',                     // hotmail, smtp, yandex.ru etc., see nodemailer docs..
//    emailLogin:     'support@thankyou.ru',
//    emailPass:      'CahSw5v5'

};
