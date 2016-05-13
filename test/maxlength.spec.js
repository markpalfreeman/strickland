import expect from 'expect';
import maxlength from '../src/maxlength';

describe('maxlength', () => {
    describe('recognizes empty values as valid', () => {
        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = maxlength(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values at most as long as max as valid', () => {
        [
            { max: 1, value: 'a', testName: 'a' },
            { max: 2, value: 'ab', testName: 'ab' },
            { max: 2, value: 'a', testName: 'a' },
            { max: 1, value: [ 0 ], testName: '[0]' },
            { max: 2, value: [ 0, 1 ], testName: '[0, 1]' },
            { max: 2, value: [ 0 ], testName: '[0]' }
        ].forEach(({ max, value, testName }) => {
            it(`max: ${max}; value: ${testName}`, () => {
                const result = maxlength(value, max);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values longer than max as invalid', () => {
        [
            { max: 1, value: 'ab', testName: 'ab' },
            { max: 2, value: 'abc', testName: 'abc' },
            { max: 1, value: [ 0, 1 ], testName: '[0, 1]' },
            { max: 2, value: [ 0, 1, 2 ], testName: '[0, 1, 2]' }
        ].forEach(({ max, value, testName }) => {
            it(`max: ${max}; value: ${testName}`, () => {
                const result = maxlength(value, max);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At most ${max} characters"', () => {
            const result = maxlength('a', 4);
            expect(result.message).toBe('At most 4 characters');
        });

        it('can be overridden through props as the 3rd argument', () => {
            const result = maxlength('a', 4, { message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });

        it('can be overridden through props as the 2nd argument', () => {
            const result = maxlength('a', { max: 4, message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const result = maxlength('a', { errorLevel: 10 });
            expect(result.errorLevel).toBe(10);
        });
    });
});
