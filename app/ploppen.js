'use strict';

// Declare app level module which depends on views, and components
angular.module('ploppen', [
    'ploppen.ui',
    'ploppen.peer.peer',
    'ploppen.peer.peerlist',
    'ploppen.peer.discovery.listener',
    'ploppen.peer.discovery.broadcaster',
    'ploppen.filetransfer'

])
    .service('Config', [function() {

        var multicastAddress = '224.3.3.100';
        var multicastPort = 8886;

        var fileTransferPort = 9996;

        this.multicastAddress = function () {
            return multicastAddress;
        };

        this.multicastPort = function () {
            return multicastPort;
        };

        this.fileTransferPort = function() {
            return fileTransferPort;
        }

    }]);

