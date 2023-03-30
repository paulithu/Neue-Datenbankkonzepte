var mongoosePaginate = require('mongoose-paginate')
var aggregatePaginate = require('mongoose-aggregate-paginate-v2')
let config = require('config') 

mongoosePaginate.paginate.options = {
  lean: config.lean,
  limit: config.pageSize
}

var Globals = {
  'paginate': mongoosePaginate,
  'aggregatePaginate': aggregatePaginate
}
module.exports = Globals
