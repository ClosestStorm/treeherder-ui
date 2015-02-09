/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, you can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

testLog.directive('lvLogSteps', ['$timeout', '$q', function ($timeout, $q) {

    return {
        restrict: 'A',
        templateUrl: 'summary.html',
        link: function (scope, element, attr) {
            scope.scrollTo = function($event, step, linenumber) {
                scope.currentLineNumber = linenumber;

                scope.loadMore({}).then(function () {
                    $timeout(function () {
                        var raw = $('.lv-log-container')[0];
                        var line = $('.lv-log-line[line="' + linenumber + '"]');
                        raw.scrollTop += line.offset().top - $('.run-data').outerHeight() - 15 ;
                    });
                }, function () {
                    // there is an error so bomb out
                    return $q.reject();
                });

                if (scope.displayedStep && scope.displayedStep.order === step.order) {
                    $event.stopPropagation();
                }
            };

            scope.toggleSuccessfulSteps = function() {
                scope.showSuccessful = !scope.showSuccessful;

                var firstError = scope.artifact.step_data.steps.filter(function(step){
                    return step.result && step.result !== "success";
                })[0];

                if (!firstError) { return; }

                // scroll to the first error
                $timeout(function () {
                    var scrollTop = getOffsetOfStep(firstError.order);

                    $('.steps-data').scrollTop( scrollTop );
                });
            };

            scope.displayLog = function(line) {
                console.log(line);
                scope.currentLineNumber = line.serial;
//  Need to set the actual lines to load here.  Now it's
// just loading the first X lines.
// scope.loadMore({top: line.serial}).then(function () {

                scope.loadMore({}).then(function () {
                    $timeout(function () {
//                        var raw = $('.lv-log-container')[0];
//                        var line = $('.lv-log-line[line="' + line.serial + '"]');
//                        raw.scrollTop += line.offset().top - $('.run-data').outerHeight() - 15 ;
                    });
                });
            };
        }
    };
}]);
