import validator from './validator';
import { lte, gte } from 'lodash';

export default function valueValidator(min = 0, max = min, props) {
    props = props || {};

    if (lte(max, min)) {
        max = min;
    }

    if (min === max) {
        props.message = props.message || `Exactly ${min}`;
    } else {
        props.message = props.message || `Between ${min} and ${max}`;
    }

    return validator(
        (value) => (gte(value, min) && lte(value, max)),
        props
    );
}
