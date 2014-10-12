'use strict';

/**
 * The ploppen module is the main entry point into the application
 *
 * ploppen.ui handles the UI part of the application.  The main controller resides there
 * ploppen.peer.peer maintains the state of the local peer
 * ploppen.peer.peerlist handles the state of the other peers as they join and leave the network
 * ploppen.peer.discovery.listener listens for UDP discovery messages from other peers, and tries to add
 *  them to the network
 *  ploppen.peer.discovery.broadcaster sends UDP discovery messages to try and find other peers on the network
 *  ploppen.filetransfer handles serving file downloads to other peers
*/
angular.module('ploppen', [
    'ploppen.ui',
    'ploppen.peer.peer',
    'ploppen.peer.peerlist',
    'ploppen.peer.discovery.listener',
    'ploppen.peer.discovery.broadcaster',
    'ploppen.filetransfer'

])
/**
 * The Config service maintains the state of some important application state variables.
 */
    .service('Config', [function() {

        var multicastAddress = '224.3.3.100';
        var multicastPort = 8886;
        var fileTransferPort = 9996;

        /**
         * The address to broadcast and listen for peer discovery messages
         * @returns {string}
         */
        this.multicastAddress = function () {
            return multicastAddress;
        };

        /**
         * Port to broadcast and listen for peer discovery messages
         * @returns {number}
         */
        this.multicastPort = function () {
            return multicastPort;
        };

        /**
         * Port to use to upload files
         * @returns {number}
         */
        this.fileTransferPort = function() {
            return fileTransferPort;
        };

    }])
/**
 * The Init service initializes the network services
 */
    .service('Init', ['PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function(PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });

        FileTransferServer.start(function() {

            console.log("Started File Transfer Server");

        });

    }]);

