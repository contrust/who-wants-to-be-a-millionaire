const constrains = require('../configs/constains.js');

function isStartUserParametersValid(req){
    return (typeof req.body.username === "string") &&
        req.body.username.length <= constrains.maxUsernameLength &&
        !isNaN(+req.body.milestoneLevel) &&
        req.body.milestoneLevel >= 1 &&
        req.body.milestoneLevel < constrains.levelsCount;
}

module.exports = {
    isStartUserParametersValid: isStartUserParametersValid
}