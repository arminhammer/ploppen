/**
 * Created by armin on 10/12/14.
 */
"use strict";

describe("PeerList service", function () {

    //var ioc = require('socket.io-client');

    beforeEach(module('ploppen'));
    beforeEach(module('ploppen.peer.peerlist'));

    it('Should return an empty peer list by default', inject(function (PeerList) {

        expect(PeerList.list()).toEqual({});

    }));

    it('Should have contains() properly return whether a peer is added or not', inject(function (PeerList) {

        expect(PeerList.contains({ name: 'Peer1' })).toEqual(false);
        PeerList.list()['Peer1'] = { name: 'Peer1'};
        expect(PeerList.contains({ name: 'Peer1' })).toEqual(true);

    }));

    it('Should have count() return the proper number of peers in the list', inject(function (PeerList) {

        expect(PeerList.count()).toEqual(0);
        PeerList.list()['Peer1'] = { name: 'Peer1'};
        expect(PeerList.count()).toEqual(1);

    }));

    it('Should not add a peer if the peer is already in the list', inject(function (PeerList) {

        var peer = { name: 'Peer1'};
        PeerList.list()[peer.name] = peer;
        PeerList.addPeer(peer, function() {});
        expect(PeerList.count()).toEqual(1);

    }));

});
