/**
 * Created by armin on 10/12/14.
 */
"use strict";

describe("Peer service", function () {

    beforeEach(module('ploppen'));
    beforeEach(module('ploppen.peer.peer'));

    it('Should return the host ip address', inject(function (Peer) {

        var os = require('os');

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }

        expect(Peer.ipAddress()).toEqual(addresses[0]);

    }));

    it('Should return a correctly formed myPeer', inject(function (Peer) {

        var peer = Peer.myPeer();

        expect(peer.availableFiles).toEqual({});

    }));

    it('Should return the full list of local addresses', inject(function (Peer) {

        var os = require('os');

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4') {
                    addresses.push(address.address);
                }
            }
        }

        expect(Peer.localAddressList()).toEqual(addresses);

    }));

    it('Should return the correct broadcast ip address, *.255.255.255', inject(function (Peer) {

        var os = require('os');

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }

        expect(Peer.broadcastAddress()).toEqual(addresses[0].substr(0, addresses[0].indexOf('.')) + '.255.255.255');

    }));

});
