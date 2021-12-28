/**
 * Created by jrootham on 04/08/14.
 *
 * Copyright ©  2014 Jim Rootham
 *
 * Example
 *
 */

(function () {
    "use strict"

    var recruit = require("./recruit")
    var admin = require("./admin")

    var routeTable = {
        campaign: {
            canvasser: {
                signup: {
                    POST: recruit.signup
                }
            },
            admin: {
                enter: {
                    POST: admin.enter
                },

                searchRecruits: {
                    GET: admin.searchRecruits
                },

                signupRecruit: {
                    recruitId: {
                        match: {
                            maxLength: 23,
                            pattern: "\\d+"
                        },
                        next: {
                            POST: admin.signupRecruit
                        }
                    }
                },

                permission: {
                    options: {
                        GET: admin.permissionOptions
                    },

                    location: {
                        GET: admin.locationPermission
                    },

                    question: {
                        GET: admin.questionPermission
                    }
                }
            }
        }
    }

    exports.routeTable = routeTable
})()