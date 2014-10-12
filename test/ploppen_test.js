/**
 * Created by armin on 10/11/14.
 */
"use strict";

describe("ploppen Config service", function () {

    beforeEach(module("ploppen"));

    it('Should create the multicast Port to 8886 by default', inject(function (Config) {

        expect(Config.multicastPort()).toEqual(8886);

    }))

    it('Should create the multicast address to 224.3.3.100 by default', inject(function (Config) {

        expect(Config.multicastAddress()).toEqual('224.3.3.100');

    }))

    it('Should create the multicast Port to 9996 by default', inject(function (Config) {

        expect(Config.fileTransferPort()).toEqual(9996);

    }))

});
