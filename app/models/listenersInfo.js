var mongoose = require('mongoose');

module.exports = mongoose.model('ListenersInfo', {
    desktop: {
        type: Number
    },
    timestamp: {
        type: Date
    },
    mobile:{
        type:Number
    },
    other:{
        type:Number
    },
    listener: {
        type: Number
    }
})
