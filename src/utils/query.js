/**
 * @file 数据库查询封装
 * @author tangyida <530063113@qq.com>
 */
const pool = require('../../config/dbConfig');


// let query = function( sql, values ) {
//   return new Promise(( resolve, reject ) => {
//     pool.getConnection(function(err, connection) {
//       if (err) {
//         console.log(err);
//         reject( err )
//       } else {
//         connection.query(sql, values, ( err, rows) => {

//           if ( err ) {
//             reject( err )
//           } else {
//             resolve( rows )
//           }
//           connection.release()
//         })
//       }
//     })
//   })
// }

module.exports = query;
