'use strict';

treeherder.controller('LogviewerCtrl',
    function Logviewer($anchorScroll, $scope, $rootScope, $location, $routeParams, $http, $timeout, thArtifact) {

        if ($location.$$search.hasOwnProperty("repo") &&
            $location.$$search.repo !== "") {
            $rootScope.repo = $location.$$search.repo;
        }
        if ($location.$$search.hasOwnProperty("id") &&
            $location.$$search.id !== "") {
            $scope.lvArtifactId= $location.$$search.id;
        }


        $scope.scrollTo = function(step, linenumber) {
            $location.hash('lv-line-'+linenumber);
            $anchorScroll();
        };

        // @@@ it may be possible to do this with the angular date filter?
        $scope.formatTime = function(sec) {
            var h = Math.floor(sec/3600);
            var m = Math.floor(sec%3600/60);
            var s = Math.floor(sec%3600 % 60);
            var secStng = sec.toString();
            var ms = secStng.substr(secStng.indexOf(".")+1, 2);
            return ((h > 0 ? h + "h " : "") + (m > 0 ? m + "m " : "") +
                   (s > 0 ? s + "s " : "") + (ms > 0 ? ms + "ms " : "00ms"));
        };

        $scope.displayTime = function(started, finished) {
            var start = started.substr(started.indexOf(" ")+1, 8);
            var end = finished.substr(finished.indexOf(" ")+1, 8);
            return start + "-" + end;
        };

        $scope.displayLog = function(step) {
            $scope.displayedStep = step;

            // @@@ we should display some kind of "loading" indicator in the
            // logs area in case the log is really large
            $scope.log_text = $scope.full_log[step.order];

            //so that all displayed steps are auto scrolled to top
            $timeout(function() {
                document.getElementById("lv-log-container").scrollTop = 0;
            });
        };

        $scope.init = function() {
            thArtifact.getArtifact($scope.lvArtifactId).
                success(function(data) {
                    $scope.jsonObj = data.blob;
                    $scope.logurl = data.blob.logurl;
                    console.log("logUrl: " + $scope.logurl);
                    $http.get($scope.logurl).
                        success(function(data) {
                            $scope.logData = data.split("\n");
                        });
                });
        };

    }
);
