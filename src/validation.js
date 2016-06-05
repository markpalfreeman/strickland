import { every, filter, isArray, isObject, mapValues, keys } from 'lodash';

export function validate(value, validators) {
    if (isArray(validators)) {
        return {
            isValid: isValid(value, validators),
            results: getResults(value, validators),
            errors: getErrors(value, validators)
        };
    } else if (isObject(validators)) {
        return mapValues(
            validators,
            (fieldValidators, field) => validate(value && value[field], fieldValidators)
        );
    } else {
        return {
            isValid: true,
            results: [],
            errors: []
        };
    }
}

export function getResults(value, validators, invalidOnly) {
    if (isArray(validators)) {
        const results = validators.map((validator) => validator(value));

        if (invalidOnly) {
            return filter(results, (result) => !result.isValid);
        } else {
            return results;
        }
    } else if (isObject(validators)) {
        return mapValues(
            validators,
            (fieldValidators, field) => getResults(value && value[field], fieldValidators, invalidOnly)
        );
    } else {
        return [];
    }
}

export function getErrors(value, validators) {
    return getResults(value, validators, true);
}

function everyFieldIsValid(results) {
    if (isArray(results)) {
        return every(results, (result) => result.isValid);
    }

    return every(keys(results), (field) => {
        return everyFieldIsValid(results[field]);
    });
}

export function isValid(value, validators) {
    const results = getResults(value, validators);
    return everyFieldIsValid(results);
}
