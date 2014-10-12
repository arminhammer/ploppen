'use strict';

// Declare app level module which depends on views, and components
angular.module('ploppen.peer.peer', [])
    .service('Peer', ['Config', function(Config) {

        var os = require('os');
        var dns = require('dns');

        var myPeer = {

            name: os.hostname(),
            address: getIPAddress(),
            port: Config.fileTransferPort(),
            downloadingFiles: {},
            availableFiles: {}

        };

        function getLocalAddr() {

            var ifaces = os.networkInterfaces();
            var iList = [];

            for (var dev in ifaces) {
                //console.log("IFACE: " + ifaces[dev]);
                var alias = 0;
                ifaces[dev].forEach(function (details) {

                    if (details.family == 'IPv4') {

                        //console.log("DEETS: " + dev + (alias ? ':' + alias : ''), details.address);
                        iList.push(details.address);
                        ++alias;

                    }

                })

            }

            //console.log("iList: " + iList);
            return iList;

        }

        this.localAddr = function() {
            return getLocalAddr();
        };

        this.ipAddress = function() {
            return getIPAddress();
        };

        this.broadcastAddr = function() {
            var lAddr = getIPAddress();
            return lAddr.substr(0, lAddr.indexOf('.')) + '.255.255.255';
        };

        this.myPeer = function() {

            return myPeer;

        };

        function getIPAddress() {

            var ifaces = getLocalAddr();
            var count = 0;

            while(count < ifaces.length) {

                //console.log("NEXT IF: " + ifaces[count]);

                if(!(ifaces[count] == "127.0.0.1")) {

                    //console.log("INTERFACE: " + ifaces[count]);
                    return ifaces[count];

                } else {

                    count++;

                }
            }

            //console.log("INTERFACE: " + ifaces[0]);

            return ifaces[0];
        }

    }]);