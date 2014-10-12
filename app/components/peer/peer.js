'use strict';

/**
 * The ploppen.peer.peer module provides the Peer service, which maintains the state of the local Peer
 */
angular.module('ploppen.peer.peer', [])
    .service('Peer', ['Config', function(Config) {

        var os = require('os');
        var dns = require('dns');

        /**
         * The interior object that holds Peer state variables
         * @type {{name: *, address: *, port: *, downloadingFiles: {}, availableFiles: {}}}
         */
        var myPeer = {

            // Local machine hostname
            name: os.hostname(),
            // Local machine network ip address
            address: getIPAddress(),
            // The local machine file transfer port
            port: Config.fileTransferPort(),
            // The object list maintaining files currently downloading.  Obsolete?
            downloadingFiles: {},
            // List of currently available files for download
            availableFiles: {}

        };

        /**
         * Return the interior state object
         * @returns {{name: *, address: *, port: *, downloadingFiles: {}, availableFiles: {}}}
         */
        this.myPeer = function() {

            return myPeer;

        };

        /**
         * Returns an array of currently available local ip addresses on the machine, including 127.0.0.1
         * @returns {Array}
         */
        function getLocalAddresses() {

            var ifaces = os.networkInterfaces();
            var iList = [];

            for (var dev in ifaces) {

                var alias = 0;
                ifaces[dev].forEach(function (details) {

                    if (details.family == 'IPv4') {

                        iList.push(details.address);
                        ++alias;

                    }

                })

            }

            return iList;

        }

        /**
         * Returns array of local ip addresses
         * @returns {Array}
         */
        this.localAddressList = function() {

            return getLocalAddresses();

        };

        /**
         * Returns the first machine network ip address
         * @returns {*}
         */
        this.ipAddress = function() {

            return getIPAddress();

        };

        /**
         * Returns the broadcast IP address to use for IP Broadcasting.  For use with networks where
         * UDP multicasting is not working
         * @returns {string}
         */
        this.broadcastAddress = function() {

            var lAddr = getIPAddress();
            return lAddr.substr(0, lAddr.indexOf('.')) + '.255.255.255';

        };

        /**
         * Get the first network ip address for the machines
         * @returns {*}
         */
        function getIPAddress() {

            var ifaces = getLocalAddresses();
            var count = 0;

            while(count < ifaces.length) {

                if(!(ifaces[count] == "127.0.0.1")) {

                    return ifaces[count];

                } else {

                    count++;

                }
            }

        }

    }]);