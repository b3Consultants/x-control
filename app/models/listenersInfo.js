var mongoose = require('mongoose');

module.exports = mongoose.model('ListenersInfo', {
    listeners: {
        type: Number
    },
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
    }
})
