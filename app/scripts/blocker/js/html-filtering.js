/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2017 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

'use strict';

/******************************************************************************/

µBlock.htmlFilteringEngine = (function() {
    var api = {};

    var µb = µBlock,
        filterDB = new µb.staticExtFilteringEngine.HostnameBasedDB(),
        pselectors = new Map(),
        duplicates = new Set(),
        acceptedCount = 0,
        discardedCount = 0,
        docRegister;

    var PSelectorHasTextTask = function(task) {
        var arg0 = task[1], arg1;
        if ( Array.isArray(task[1]) ) {
            arg1 = arg0[1]; arg0 = arg0[0];
        }
        this.needle = new RegExp(arg0, arg1);
    };
    PSelectorHasTextTask.prototype.exec = function(input) {
        var output = [];
        for ( var node of input ) {
            if ( this.needle.test(node.textContent) ) {
                output.push(node);
            }
        }
        return output;
    };

    var PSelectorIfTask = function(task) {
        this.pselector = new PSelector(task[1]);
    };
    PSelectorIfTask.prototype.target = true;
    Object.defineProperty(PSelectorIfTask.prototype, 'invalid', {
        get: function() {
            return this.pselector.invalid;
        }
    });
    PSelectorIfTask.prototype.exec = function(input) {
        var output = [];
        for ( var node of input ) {
            if ( this.pselector.test(node) === this.target ) {
                output.push(node);
            }
        }
        return output;
    };

    var PSelectorIfNotTask = function(task) {
        PSelectorIfTask.call(this, task);
        this.target = false;
    };
    PSelectorIfNotTask.prototype = Object.create(PSelectorIfTask.prototype);
    PSelectorIfNotTask.prototype.constructor = PSelectorIfNotTask;

    var PSelectorXpathTask = function(task) {
        this.xpe = task[1];
    };
    PSelectorXpathTask.prototype.exec = function(input) {
        var output = [],
            xpe = docRegister.createExpression(this.xpe, null),
            xpr = null;
        for ( var node of input ) {
            xpr = xpe.evaluate(
                node,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                xpr
            );
            var j = xpr.snapshotLength;
            while ( j-- ) {
                node = xpr.snapshotItem(j);
                if ( node.nodeType === 1 ) {
                    output.push(node);
                }
            }
        }
        return output;
    };

    var PSelector = function(o) {
        if ( PSelector.prototype.operatorToTaskMap === undefined ) {
            PSelector.prototype.operatorToTaskMap = new Map([
                [ ':has', PSelectorIfTask ],
                [ ':has-text', PSelectorHasTextTask ],
                [ ':if', PSelectorIfTask ],
                [ ':if-not', PSelectorIfNotTask ],
                [ ':xpath', PSelectorXpathTask ]
            ]);
        }
        this.raw = o.raw;
        this.selector = o.selector;
        this.tasks = [];
        var tasks = o.tasks;
        if ( !tasks ) { return; }
        for ( var task of tasks ) {
            var ctor = this.operatorToTaskMap.get(task[0]);
            if ( ctor === undefined ) {
                this.invalid = true;
                break;
            }
            var pselector = new ctor(task);
            if ( pselector instanceof PSelectorIfTask && pselector.invalid ) {
                this.invalid = true;
                break;
            }
            this.tasks.push(pselector);
        }
    };
    PSelector.prototype.operatorToTaskMap = undefined;
    PSelector.prototype.invalid = false;
    PSelector.prototype.prime = function(input) {
        var root = input || docRegister;
        if ( this.selector !== '' ) {
            return root.querySelectorAll(this.selector);
        }
        return [ root ];
    };
    PSelector.prototype.exec = function(input) {
        if ( this.invalid ) { return []; }
        var nodes = this.prime(input);
        for ( var task of this.tasks ) {
            if ( nodes.length === 0 ) { break; }
            nodes = task.exec(nodes);
        }
        return nodes;
    };
    PSelector.prototype.test = function(input) {
        if ( this.invalid ) { return false; }
        var nodes = this.prime(input), AA = [ null ], aa;
        for ( var node of nodes ) {
            AA[0] = node; aa = AA;
            for ( var task of this.tasks ) {
                aa = task.exec(aa);
                if ( aa.length === 0 ) { break; }
            }
            if ( aa.length !== 0 ) { return true; }
        }
        return false;
    };

    var applyProceduralSelector = function(details, selector) {
        var pselector = pselectors.get(selector);
        if ( pselector === undefined ) {
            pselector = new PSelector(JSON.parse(selector));
            pselectors.set(selector, pselector);
        }
        var nodes = pselector.exec(),
            i = nodes.length,
            modified = false;
        while ( i-- ) {
            var node = nodes[i];
            if ( node.parentNode !== null ) {
                node.parentNode.removeChild(node);
                modified = true;
            }
        }
        
        return modified;
    };

    var applyCSSSelector = function(details, selector) {
        var nodes = docRegister.querySelectorAll(selector),
            i = nodes.length,
            modified = false;
        while ( i-- ) {
            var node = nodes[i];
            if ( node.parentNode !== null ) {
                node.parentNode.removeChild(node);
                modified = true;
            }
        }
        
        return modified;
    };

    api.reset = function() {
        filterDB.clear();
        pselectors.clear();
        duplicates.clear();
        acceptedCount = 0;
        discardedCount = 0;
    };

    api.freeze = function() {
        duplicates.clear();
    };

    api.compile = function(parsed, writer) {
        let selector = parsed.suffix.slice(1).trim(),
            compiled = µb.staticExtFilteringEngine.compileSelector(selector);
        if ( compiled === undefined ) { return; }

        // 1002 = html filtering
        writer.select(1002);

        // TODO: Mind negated hostnames, they are currently discarded.

        for ( let hn of parsed.hostnames ) {
            if ( hn.charCodeAt(0) === 0x7E /* '~' */ ) { continue; }
            let hash = µb.staticExtFilteringEngine.compileHostnameToHash(hn);
            if ( parsed.exception ) {
                hash |= 0b0001;
            }
            writer.push([
                compiled.charCodeAt(0) !== 0x7B /* '{' */ ? 64 : 65,
                hash,
                hn,
                compiled
            ]);
        }
    };

    api.fromCompiledContent = function(reader) {
        // Don't bother loading filters if stream filtering is not supported.
        if ( µb.canFilterResponseBody === false ) { return; }

        // 1002 = html filtering
        reader.select(1002);

        while ( reader.next() ) {
            acceptedCount += 1;
            var fingerprint = reader.fingerprint();
            if ( duplicates.has(fingerprint) ) {
                discardedCount += 1;
                continue;
            }
            duplicates.add(fingerprint);
            var args = reader.args();
            filterDB.add(args[1], {
                type: args[0],
                hostname: args[2],
                selector: args[3]
            });
        }
    };

    api.retrieve = function(request) {
        let hostname = request.hostname;

        // https://github.com/gorhill/uBlock/issues/2835
        //   Do not filter if the site is under an `allow` rule.
        if (
            µb.userSettings.advancedUserEnabled &&
            µb.sessionFirewall.evaluateCellZY(hostname, hostname, '*') === 2
        ) {
            return;
        }

        let out = [];
        let domainHash = µb.staticExtFilteringEngine.makeHash(request.domain);
        if ( domainHash !== 0 ) {
            filterDB.retrieve(domainHash, hostname, out);
        }
        let entityHash = µb.staticExtFilteringEngine.makeHash(request.entity);
        if ( entityHash !== 0 ) {
            filterDB.retrieve(entityHash, request.entity, out);
        }
        filterDB.retrieve(0, hostname, out);

        // TODO: handle exceptions.

        if ( out.length !== 0 ) {
            return out;
        }
    };

    api.apply = function(doc, details) {
        docRegister = doc;
        var modified = false;
        for ( var entry of details.selectors ) {
            if ( entry.type === 64 ) {
                if ( applyCSSSelector(details, entry.selector) ) {
                    modified = true;
                }
            } else {
                if ( applyProceduralSelector(details, entry.selector) ) {
                    modified = true;
                }
            }
        }

        return modified;
    };

    api.toSelfie = function() {
        return filterDB.toSelfie();
    };

    api.fromSelfie = function(selfie) {
        filterDB = new µb.staticExtFilteringEngine.HostnameBasedDB(selfie);
        pselectors.clear();
    };

    Object.defineProperties(api, {
        acceptedCount: {
            get: function() {
                return acceptedCount;
            }
        },
        discardedCount: {
            get: function() {
                return discardedCount;
            }
        }
    });

    return api;
})();

/******************************************************************************/
