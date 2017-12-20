import expect from 'expect';
import deepFreeze from 'deep-freeze';
import maxLength from '../src/maxLength';

describe('maxLength', () => {
    describe('throws', () => {
        it('when maxLength is non-numeric', () => {
            const validate = maxLength('non-numeric');
            expect(() => validate()).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = maxLength({maxLength: 3, message: 'Custom message'});
        const result = validate('123');

        it('uses the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = maxLength(3, {message: 'Custom message'});
        const result = validate('123');

        it('sets the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('returns the length on the result', () => {
        const validate = maxLength(5);

        it('when the value is a string', () => {
            const result = validate('1234');
            expect(result.length).toBe(4);
        });

        it('when the value is null', () => {
            const result = validate(null);
            expect(result.length).toBe(0);
        });

        it('when the value is an empty string', () => {
            const result = validate('');
            expect(result.length).toBe(0);
        });

        it('when the value is 0 as a string', () => {
            const result = validate('0');
            expect(result.length).toBe(1);
        });

        it('when the value has leading spaces', () => {
            const result = validate('   1234');
            expect(result.length).toBe(7);
        });

        it('when the value has trailing spaces', () => {
            const result = validate('1234   ');
            expect(result.length).toBe(7);
        });

        it('when the value has leading and trailing spaces', () => {
            const result = validate('   1234   ');
            expect(result.length).toBe(10);
        });
    });

    describe('with maxLength as a function', () => {
        let getMaxLengthCalls = 0;

        const getMaxLength = () => {
            return ++getMaxLengthCalls;
        };

        beforeEach(() => {
            getMaxLengthCalls = 0;
        });

        it('does not call the function during validator construction', () => {
            maxLength(getMaxLength);
            expect(getMaxLengthCalls).toBe(0);
        });

        it('the function is called at the time of validation', () => {
            const validate = maxLength(getMaxLength);
            validate('A');

            expect(getMaxLengthCalls).toBe(1);
        });

        it('validates using the function result', () => {
            getMaxLengthCalls = 5;

            const validate = maxLength(getMaxLength);
            const result = validate('1234');

            expect(result).toMatchObject({
                isValid: true,
                maxLength: 6,
                value: '1234',
                length: 4
            });
        });
    });

    describe('validates', () => {
        const validate = maxLength(() => 3);

        it('with the string length equal to the maxLength, it is valid', () => {
            const result = validate('123');
            expect(result.isValid).toBe(true);
        });

        it('with the string length less than the maxLength, it is valid', () => {
            const result = validate('12');
            expect(result.isValid).toBe(true);
        });

        it('with the string length greater than the maxLength, it is invalid', () => {
            const result = validate('1234');
            expect(result.isValid).toBe(false);
        });

        it('with a null value, it is valid', () => {
            const result = validate(null);
            expect(result.isValid).toBe(true);
        });

        it('with an undefined value, it is valid', () => {
            const result = validate();
            expect(result.isValid).toBe(true);
        });
    });

    describe('with props passed into validation', () => {
        it('allows the maxLength value to be specified at time of validation', () => {
            const validatorProps = {maxLength: 5};
            const validate = maxLength(validatorProps);
            const result = validate('123456', {maxLength: 6});

            expect(result).toMatchObject({
                isValid: true,
                maxLength: 6
            });
        });
    });

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {maxLength: 5};
            deepFreeze(props);

            expect(() => maxLength(props)('12345')).not.toThrow();
        });

        it('when a maxLength value and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => maxLength(5, props)('12345')).not.toThrow();
        });
    });
});
