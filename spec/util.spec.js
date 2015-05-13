/*global MediumEditor, Util, describe, it, expect, spyOn,
         afterEach, beforeEach, setupTestHelpers */

describe('Util', function () {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
    });

    afterEach(function () {
        this.cleanupTest();
    });

    describe('Exposure', function () {

        it('is exposed on the MediumEditor ctor', function () {
            expect(MediumEditor.util).toBeTruthy();
            expect(MediumEditor.util).toEqual(Util);
        });

    });

    describe('Extend', function () {
        it('should overwrite values from right to left', function () {
            var objOne = { one: 'one' },
                objTwo = { one: 'two', three: 'three' },
                objThree = { three: 'four', five: 'six' },
                objFour,
                result = MediumEditor.util.extend({}, objOne, objTwo, objThree, objFour);
            expect(result).toEqual({ one: 'two', three: 'four', five: 'six' });
        });
    });

    describe('Defaults', function () {
        it('should overwrite values from left to right', function () {
            var objOne = { one: 'one' },
                objTwo = { one: 'two', three: 'three' },
                objThree = { three: 'four', five: 'six' },
                objFour,
                result = MediumEditor.util.defaults({}, objOne, objTwo, objThree, objFour);
            expect(result).toEqual({ one: 'one', three: 'three', five: 'six' });
        });
    });

    describe('Deprecated', function () {
        it('should warn when a method is deprecated', function () {

            var testObj = {
                newMethod: function () {}
            };
            spyOn(testObj, 'newMethod').and.callThrough();
            spyOn(Util, 'warn').and.callThrough();
            Util.deprecatedMethod.call(testObj, 'test', 'newMethod', ['arg1', true], 'some version');
            expect(testObj.newMethod).toHaveBeenCalledWith('arg1', true);
            expect(Util.warn).toHaveBeenCalledWith(
                'test is deprecated, please use newMethod instead. Will be removed in some version'
            );
        });

        it('should warn when an option is deprecated', function () {

            spyOn(Util, 'warn').and.callThrough();
            Util.deprecated('oldOption', 'sub.newOption');
            expect(Util.warn).toHaveBeenCalledWith(
                'oldOption is deprecated, please use sub.newOption instead.'
            );
        });

        it('should allow passing a version when the removal will happen', function () {
            spyOn(Util, 'warn').and.callThrough();
            Util.deprecated('old', 'new', '11tybillion');
            expect(Util.warn).toHaveBeenCalledWith(
                'old is deprecated, please use new instead. Will be removed in 11tybillion'
            );
        });
    });

    describe('getobject', function () {

        it('should get nested objects', function () {
            var obj = { a: { b: { c: { d: 10 } } } };
            expect(Util.getObject('a.b.c.d', false, obj)).toBe(10);
            expect(Util.getObject('a.b.c', false, obj)).toEqual({ d: 10 });
            expect(Util.getObject('a', false, obj)).toEqual({ b: { c: { d: 10 } } });
        });

        it('should create a path if told to', function () {
            var obj = {};
            expect(Util.getObject('a.b.c.d', true, obj)).toEqual({});
            expect(obj.a.b.c.d).toBeTruthy();
        });

        it('should NOT create a path', function () {
            var obj = {};
            expect(Util.getObject('a.b.c.d.e.f.g', false, obj)).toBe(undefined);
            expect(obj.a).toBe(undefined);
        });

    });

    describe('setobject', function () {

        it('sets returns the value', function () {
            var obj = {};
            expect(Util.setObject('a.b.c', 10, obj)).toBe(10);
            expect(obj.a.b.c).toBe(10);
        });

    });

    describe('settargetblank', function () {

        it('sets target blank on a A element from a A element', function () {
            var el = this.createElement('a', '', 'lorem ipsum');
            el.attributes.href = 'http://0.0.0.0/bar.html';

            Util.setTargetBlank(el);

            expect(el.target).toBe('_blank');
        });

        it('sets target blank on a A element from a DIV element', function () {
            var el = this.createElement('div', '', '<a href="http://1.1.1.1/foo.html">foo</a> <a href="http://0.0.0.0/bar.html">bar</a>');

            Util.setTargetBlank(el, 'http://0.0.0.0/bar.html');

            var nodes = el.getElementsByTagName('a');

            expect(nodes[0].target).not.toBe('_blank');
            expect(nodes[1].target).toBe('_blank');
        });

    });

    describe('warn', function () {

        it('exists', function () {
            expect(typeof Util.warn).toBe('function');
        });

        it('ends up calling console.warn', function () {
            // IE9 mock for SauceLabs
            if (window.console === undefined) {
                window.console = {
                    warn: function (msg) {
                        return msg;
                    }
                };
            } else if (typeof window.console.warn !== 'function') {
                window.console.warn = function (msg) {
                    return msg;
                };
            }

            var spy = spyOn(window.console.warn, 'apply').and.callThrough();
            Util.warn('message');
            expect(spy).toHaveBeenCalled();
        });

    });
});
