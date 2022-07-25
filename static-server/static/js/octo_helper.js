const onlyNumbers = (str) => /^[0-9]+$/.test(str);
const allEqual = (arr, match) => arr.every(val => val === match);
const listOfGameNamesToIds = (names, dict) => names.map(name => dict[name]);

/**
 * Works out which method to query based on user input.
 * @param  {string} input [The user input]
 * @return {string} url [The url to the steam api]
 */
function get_query_from_input(input) {
    if (input.length == 17 && onlyNumbers(input)) {
        return '/user/id/' + input;
    }

    if (input.includes('steamcommunity.com/id/')) {

        var index = input.indexOf('steamcommunity.com/id/');
        var id = input.substring(index + 22);

        if (id.includes('/')) id = id.substring(0, id.indexOf('/'));
        if (id.includes('?')) id = id.substring(0, id.indexOf('?'));

        return '/user/name/' + id;
    }

    return '/user/name/' + input;
}