'use strict';

angular.module('node-teiler.version', [
  'node-teiler.version.interpolate-filter',
  'node-teiler.version.version-directive'
])

.value('version', '0.1');
