import { Machine, interpret, sendParent, send, assign, spawn, createMachine } from "xstate";

const loggedInSuccess = () => true
const userAddedNotification = () => true
const assetAddedNotification = () => true
const podAddedNotification = () => true
const podUpdatedNotification = () => true
const addAssetMachine = {
    initial: "",
    states: {

    }
}
const hasOnboarded = (context, event) => context.user.hasOnboarded;
const remoteMachine = Machine({
    id: "remote",
    initial: "offline",
    states: {
        offline: {
            on: {
                WAKE: "online"
            }
        },
        online: {
            after: {
                3000: {
                    actions: sendParent("POD_UPDATED")
                }
            }
        }
    }
});
const hasOnBoardedMachine = {
    id: "hasOnboarded",
    context: { hasOnboarded: undefined },
    initial: "unknown",
    states: {
        unknown: {
            on: {
                // immediately take transition that satisfies conditional guard.
                // otherwise, no transition occurs
                "": [
                    { target: "#main", cond: hasOnboarded },
                    { target: "#onboarding", cond: !hasOnboarded }
                ]
            }
        }
    }
};

const rootMachine = Machine({
    id: "AcceleRun",
    initial: "loading",
    context: {
        retries: 0,
        auth: {},
        user: {
            hasOnboarded: false
        }
    },
    states: {
        loading: {
            on: {
                ONBOARDING: "onboarding",
                MAIN: "main"
            },
        },
        login: {
            invoke: {
                id: "authenticate-user",
                src: "authenticateUser",
                onDone: {
                    target: "loggedIn",
                    actions: assign({ user: (context, event) => event.data.user }),
                },
                onError: {
                    target: "failure",
                },
            },
        },
        failure: {
            type: "onboarding",
        },
        loggedIn: {
            on: {
                // immediately take transition that satisfies conditional guard.
                // otherwise, no transition occurs
                "": [
                    { target: "main", cond: hasOnboarded },
                    { target: "onboarding", cond: !hasOnboarded }
                ]
            }
        },
        onboarding: {
            id: "onboarding",
            initial: "start",
            meta: { path: "/onboarding" },
            states: {
                start: {
                    entry: () => console.log("entry start"),
                    exit: () => console.log("exit start"),
                    on: {
                        CONNECT: "connect"
                    }
                },
                connect: {
                    entry: () => console.log("entry connect"),
                    exit: () => console.log("exit connect"),
                    on: {
                        CONTRIBUTE: {
                            target: "contribute",
                            actions: [
                                () => console.log("connect to contribute"),
                                assign({ authUser: (context, event) => event.authUser }),
                            ]
                        }
                    }
                },
                contribute: {
                    entry: () => console.log("entry contribute"),
                    exit: () => console.log("exit contribute"),

                    on: {
                        HAVE_AN_IDEA: "idea",
                        HAV_SKILL: "skills"
                    }
                },
                idea: {
                    on: {
                        SUBMIT: "ideaFormComplete"
                    }
                },
                ideaFormComplete: {
                    on: {
                        HAVE_AN_IDEA: "idea",
                        HAV_SKILL: "skills",
                        DONE: "#postOnBoarding"
                    }
                },
                skills: {
                    on: {
                        SUBMIT: "skillFormComplete"
                    }
                },
                skillFormComplete: {
                    on: {
                        HAVE_AN_IDEA: "idea",
                        HAV_SKILL: "skills",
                        DONE: "#postOnBoarding"
                    }
                },
            }
        },
        postOnBoarding: {
            id: "postOnBoarding",
            invoke: {
                id: "update-user-onboarding-status",
                src: "updateUserOnboardingStatus",
                onDone: {
                    target: "#main",
                    actions: assign({ user: (context, event) => event.data.user }),
                },
                onError: {
                    target: "#onboarding",
                },
            },
        },
        main: {
            id: "main",
            initial: "idle",
            on: {
                LOGOUT: "onboarding"
            },
            context: {
                talentWrangler: {}
            },
            states: {
                idle: {
                    on: {
                        ADD_PROJECT: "addProjectForm",
                        PROJECT_CLICK: "projectView",
                        //A pod will automatically form by the system
                        POD_ADDED: "podAdded",
                        POD_UPDATED: "podUpdated",
                    }
                },
                addProjectForm: {
                    on: {
                        SUBMIT: "projectAdded"
                    }
                },
                projectAdded: {
                    entry: assign({
                        talentWrangler: () => spawn(remoteMachine)
                    }),
                    on: {
                        actions: send("WAKE", {
                            to: (context) => context.talentWrangler
                        }),
                        "": "#main",
                        POD_ADDED: "podAdded",
                        POD_UPDATED: "podUpdated",
                    }
                },
                podAdded: {
                    entry: podAddedNotification,

                },
                podUpdated: {
                    entry: podUpdatedNotification
                },
                projectView: {
                    id: "projectView",
                    initial: "idle",
                    on: {
                        POD_ADDED: "podAdded",
                        POD_UPDATED: "podUpdated",
                    },
                    states: {
                        idle: {
                            on: {
                                ADD_ASSET: "addAssetForm",
                                ASSET_ADDED: "assetAdded"
                            },
                        },
                        addAssetForm: {
                            on: {
                                SUBMIT: {
                                    target: "#projectView"
                                }
                            }
                        },
                        assetAdded: {
                            entry: assetAddedNotification
                        },
                    }
                },
            }
        }
    },
    services: {
        authenticateUser: (context, event) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ user: { name: "Roie", hasOnboarded: false } });
                }, 1000);
            });
        },
        updateUserOnboardingStatus: (context, event) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        user: {
                            name: "Roie",
                            hasOnboarded: true
                        },
                    });
                }, 2000);
            });
        }
    }
});


/** For test */
// const log = (context, event) => { console.log(context); }
// const promiseMachine = createMachine({
//     id: 'promise',
//     initial: 'pending',
//     context: {
//         user: {},
//         count: 0
//     },
//     states: {
//         pending: {
//             actions: log,
//             on: {
//                 RESOLVE: {
//                     target: 'resolved',
//                     actions: [
//                         log,
//                         assign({ count: (context) => context.count + 1 })
//                     ],
//                 },
//                 REJECT: 'rejected'
//             }
//         },
//         resolved: {
//             entry: [
//                 log,
//                 assign({ count: (context) => context.count + 1 })
//             ],
//             on: {
//                 rejected: {
//                     REJECT: "rejected"
//                 }
//             }
//         },
//         rejected: {
//             actions: (context, event) => console.log('actions'),
//             type: 'final'
//         }
//     },
//     actions: {

//     }
// });
// const promiseService = interpret(promiseMachine)
//     .onChange(context => console.log(context))
//     .onTransition(state => console.log(""));
// promiseService.start();
// setTimeout(() => {
//     const state = promiseService.send('RESOLVE');
//     console.log(state.context);
// }, 2000);


export default rootMachine;