import { Machine, sendParent, send, assign, spawn } from 'xstate';

const loggedInSuccess = () => true
const userAddedNotification = () => true
const assetAddedNotification = () => true
const podAddedNotification = () => true
const podUpdatedNotification = () => true

const addAssetMachine = {
    initial: '',
    states: {

    }
}

const hasOnboarded = (context, event) => context.user.hasOnboarded;

const remoteMachine = Machine({
    id: 'remote',
    initial: 'offline',
    states: {
        offline: {
            on: {
                WAKE: 'online'
            }
        },
        online: {
            after: {
                3000: {
                    actions: sendParent('POD_UPDATED')
                }
            }
        }
    }
});

const hasOnBoardedMachine = {
    id: 'hasOnboarded',
    context: { hasOnboarded: undefined },
    initial: 'unknown',
    states: {
        unknown: {
            on: {
                // immediately take transition that satisfies conditional guard.
                // otherwise, no transition occurs
                '': [
                    { target: '#main', cond: hasOnboarded },
                    { target: '#onboarding', cond: !hasOnboarded }
                ]
            }
        }
    }
};

const rootMachine = Machine({
    id: 'AcceleRun',
    initial: 'landing',
    context: {
        retries: 0,
        user: {}
    },
    states: {
        landing: {
            on: {
                LOGIN: "login",
                ONBOARDING: "onboarding"
            }
        },
        login: {
            invoke: {
                id: "authenticate-user",
                src: "authenticateUser",
                onDone: {
                    target: "loggedIn",
                    actions: assign({
                        user: (context, event) =>
                            event.data.user,
                    }),
                },
                onError: {
                    target: "failure",
                },
            },
        },
        failure: {
            type: 'landing',
        },
        loggedIn: {
            on: {
                // immediately take transition that satisfies conditional guard.
                // otherwise, no transition occurs
                '': [
                    { target: 'main', cond: hasOnboarded },
                    { target: 'onboarding', cond: !hasOnboarded }
                ]
            }
        },
        onboarding: {
            id: "onboarding",
            initial: 'connect',
            states: {
                connect: {
                    on: {
                        CONTRIBUTE: "contribute"
                    }
                },
                contribute: {
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
                    actions: assign({
                        user: (context, event) =>
                            event.data.user,
                    }),
                },
                onError: {
                    target: "#onboarding",
                },
            },
        },
        main: {
            id: "main",
            initial: 'idle',
            on: {
                LOGOUT: "landing"
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
                        actions: send('WAKE', {
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
                    initial: 'idle',
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
    }
}, {
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

export default rootMachine;