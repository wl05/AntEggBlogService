// success
exports.success = (ctx, result = null, message = "Succeed") => {
    ctx.body = {
        code : 0,
        message : message,
        data : result
    };
};

// error
exports.error = (ctx, code, message) => {
    ctx.body = {
        code : code,
        message : message
    };
};