/*jslint node*/

export default Object.freeze(function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
});
