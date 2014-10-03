'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', ['$scope', 'PeerList', 'Peer', 'PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {

            $scope.$apply();

        });

        function setDialogListener(name) {

            var inputListener = $('#' + name + 'fileInputDialog');
            var saveListener = $('#' + name + 'fileSaveDialog');

            inputListener.change(function(evt) {

                var filePath = $(this).val();
                console.log("OFFER: " + name + " file " + filePath);
                //return $(this).val();

            });

        }

        //var fileInputDialogListener = setDialogListener('#fileInputDialog');
        //var fileSaveDialogListener = setDialogListener('#fileSaveDialog');

        $scope.inputDialogChange = function() {
            console.log("CHANGE FOUND");
            //var val = $('#' + peer.name + 'fileInputDialog').val();
            //console.log("VAL: " + val);
        }

        $scope.fileNameChanged = function(scopen) {
            console.log("select file " + scopen.name);
        }

        $scope.clickSendButton = function(clickEvent, peer) {

            console.log("Clicked Send Button!");
            console.log(clickEvent);

            //fileInputDialogListener.trigger('click');
            $('#' + peer.name + 'fileInputDialog').trigger('click');

        };

        $scope.clickDownloadButton = function(clickEvent, file, peer) {

            console.log("Clicked Download Button for " + file.name);
            console.log(clickEvent);

            var fileName = fileSaveDialogListener.trigger('click');
            console.log("THIS IS THE FILE: " + fileName);

        };

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });

        FileTransferServer.start(function() {

            console.log("Started File Transfer Server");

        });

        $scope.sendFile  = function() {
            console.log("BLAH");
        }

    }])
    .directive('onChange', function() {
        return {
            restrict: 'A',
            scope:{'onChange':'&' },
            link: function(scope, elm, attrs) {
                scope.$watch('onChange', function(nVal) { elm.val(nVal); });
                elm.bind('change', function() {
                    var currentValue = elm.val();
                    console.log("OMG IT WORKED " + elm.val());

                    scope.sendFile({peer: peer });
                    /*
                    scope.sendFile()
                    if( scope.onChange !== currentValue ) {
                        scope.$apply(function() {
                            console.log(scope + " OMG IT WORKED " + elm.val());
                            //scope.onChange = currentValue;
                        });
                    }
                    */
                });
            }
        };
    });;