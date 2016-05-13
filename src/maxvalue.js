import ValidationResult from './ValidationResult';
import { isObject } from 'lodash';

export default function maxvalue(value, max = 0, props = {}) {
    if (isObject(max)) {
        props = max;
        max = props.max;
    }

    props.message = props.message || `At most ${max}`;

    const isValid = !value || value <= max;
    return new ValidationResult(isValid, props);
}
