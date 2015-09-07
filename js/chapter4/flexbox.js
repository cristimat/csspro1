var init = function () {
    'use strict';
    var form = document.querySelector('form'),
        chkbxes = document.querySelectorAll('[id|=flex-basis-auto]');
    
    // Functions
    var camelCaseProp,
        checkboxes,
        getStyleSheet,
        getClassName,
        getRuleIndex,
        preventSubmit,
        resetRules,
        setProp,
        setFlexProp,
        updateStyles;


    preventSubmit = function (e) {
        e.preventDefault();
    };

    getStyleSheet = function () {
        var idx, i = 0;

        while (i < document.styleSheets.length) {
            if ("FlexDemo" === document.styleSheets[i].title) {
                idx = i;
            }
            i++;
        }
        return document.styleSheets[idx];
    };

    camelCaseProp = function (cssprop) {
        var propSegments = cssprop.split('-'), propObj = {};

        if (propSegments.length > 1) {

            propSegments.map(function (seg, index, array) {
                if (index > 0) {
                    var cc = seg.replace(/^[a-z]/, seg.charAt(0).toUpperCase());
                    this[index] = cc;
                }
            }, propSegments);

            propObj.standard = propSegments.join('');
            propObj.prefixed = 'webkit' + propObj.standard.replace(/^[a-z]/, propObj.standard.charAt(0).toUpperCase());
        } else {
            propObj.standard = cssprop;
            propObj.prefixed = 'webkit' + cssprop.replace(cssprop.charAt(0), cssprop.charAt(0).toUpperCase());

        }
        return propObj;
    };

    /*
    Get the index of the rule that matches the selector
    passed in using item.
    */
    getRuleIndex = function (selector) {
        var rules, i, sel;

        rules = getStyleSheet().cssRules;
        i = 0;

        sel = (selector.charAt(0) === '.') ? selector : '.' + selector;

        while (i < rules.length) {
            if (sel === rules[i].selectorText) {
                return i;
            }
            i++;
        }
    };

    updateStyles = function (e) {
        var cn = getClassName(e.target.id)[0], idx, rule;

        if (e.target.id.indexOf("flex-basis-auto") > -1) {
            checkboxes(e.target);
            return;
        }

        if (e.target.dataset.prop.match(/flex-(grow|shrink|basis)/)) {
            setFlexProp(cn, e.target.dataset.prop, e.target.value);
            return;
        }
        setProp(cn, e.target.dataset.prop, e.target.value);
    };

    setProp = function (selector, property, value) {
        var ri = getRuleIndex(selector), ccprop = camelCaseProp(property), styles = getStyleSheet();

        if (ccprop.standard in styles.cssRules[ri].style) {
            styles.cssRules[ri].style[ccprop.standard] = value;
        } else {
            styles.cssRules[ri].style[ccprop.prefixed] = value;
        }
    };

    /* Return the class name */
    getClassName = function (str) {
        return str.match(/(demo|alpha|beta|gamma|delta|epsilon|zeta)/);
    };

    checkboxes = function (c) {
        var fb, nte;
        fb  = c.parentElement.previousElementSibling;
        nte = c.parentElement.parentElement.getElementsByClassName('flex-basis-auto-note')[0];

        if (c.checked) {
            fb.disabled = true;
            nte.hidden = true;
            nte.setAttribute('aria-hidden', 'true');
            fb.value = 'auto';

            setProp(getClassName(c.id)[0], 'flex-basis', 'auto');

        } else {
            fb.disabled = false;
            nte.hidden = false;
            nte.setAttribute('aria-hidden', 'false');
        }
    };

    resetRules = function (e) {
        var rules, i;
        rules = getStyleSheet();

        for (i = rules.cssRules.length; i > 0; i--) {
            rules.deleteRule(i - 1);
        }
    };

    setFlexProp = function (selector, fp, value) {
        var flexprop = fp.split('-'),
            flexvalue = [],
            shorthand = document.querySelectorAll('.flex-shorthand-' + selector + '> code'),
            propval = camelCaseProp('flex');

        flexvalue[0] = document.querySelector('#flex-grow-' + selector).value;
        flexvalue[1] = document.querySelector('#flex-shrink-' + selector).value;
        flexvalue[2] = document.querySelector('#flex-basis-' + selector).value;

        setProp(selector, 'flex', flexvalue.join(' '));


        shorthand[1].innerHTML = flexvalue[0];
        shorthand[2].innerHTML = flexvalue[1];
        shorthand[3].innerHTML = flexvalue[2];
    };

    form.addEventListener('click', function (evt) {
        if (evt.target.nextElementSibling) {
            if (evt.target.nextElementSibling.nodeName === 'DIV') {
                evt.target.parentElement.classList.toggle('closed');
            }
        }
    });
    form.addEventListener('submit', preventSubmit);
    form.addEventListener('reset', resetRules);

    [].map.call(document.querySelectorAll('.demo li'), function (fxb, ind) {
        var dp = document.querySelectorAll('[data-prop=flex-basis]');
        setProp(fxb.classList.item(0), 'flex-basis', dp[ind].value);
    });
    
    [].map.call(document.querySelectorAll('[id|=flex-basis-auto]'), function (cb) {
        checkboxes(cb);
    });

    [].map.call(document.querySelectorAll('select, [id|=flex-basis-auto]'), function (sel) {
        sel.addEventListener('change', updateStyles);
    });

    [].map.call(document.querySelectorAll('input:not([type=checkbox])'), function (sel) {
        sel.addEventListener('input', updateStyles);
    });

    setProp('.demo', 'align-items', document.getElementById('align-items-demo').value);

    document.querySelector('#same_height').addEventListener('change', function (evt) {
        [].map.call(document.querySelectorAll('li:nth-child(even)'), function (li) {
            li.classList.toggle('quarter');
        });
    });
};

window.addEventListener('load', init);
