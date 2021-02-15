import { Machine, sendParent, send, assign, spawn } from "xstate";
import api from './graphql/api'

const loggedInSuccess = () => false
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

const haveAnIdea = (context, event) => context.user.contributionType === "haveAnIdea";
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
                "": [
                    { target: "#main", cond: hasOnboarded },
                    { target: "#onboarding", cond: !hasOnboarded }
                ]
            }
        }
    }
};

const setContributionType = (context, event) => context.user.contributionType = event.contributionType;

const setIdea = (context, event) => {
    context.user.idea = event.idea;
    context.user.hasOnboarded = true;
}

const setUser = (context, event) => {
    context.user.name = event.user.name;
    context.user.lastName = event.user.lastName;
    context.user.email = context.authUser.email;
    context.user.imageSource = event.user.imageSource;
    context.user.positions = event.user.positions;
    context.user.skills = event.user.skills;
}

const postOnboarding = (context, event) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("onboarding done, saving user");
            resolve();
        }, 2000);
    });
}

const authenticateUser = (context, event) => {
    return new Promise(async (resolve) => {
        console.log("authenticateUser");
        resolve();
    });
}

const contributionType = {
    haveAnIdea: 0,
    haveSkills: 1
}

const idea = {
    idea: "",
    pitch: "",
    ideaCategory: [],
    neededTeamSkills: []
}

const authUser = {};

const user = {
    hasOnboarded: false,
    contributionType: contributionType.haveAnIdea,
    name: "",
    lastName: "",
    email: "",
    skills: null,
    idea: null
};

const context = {
    authUser,
    user
}

const rootMachine = Machine({
    id: "AcceleRun",
    initial: "loading",
    context: context,
    states: {
        loading: {
            on: {
                MAIN: "main",
                LANDING: "landing"
            }
        },
        landing: {
            id: "landing",
            initial: "home",
            states: {
                home: {
                    on: {
                        LOGIN: "login",
                        ONBOARDING: "#onboarding"
                    }
                },
                login: {
                    invoke: {
                        id: "authenticate-user",
                        src: "authenticateUser",
                        onDone: {
                            target: "loggedIn",
                            //    actions: assign({ user: (context, event) => event.data.user }),
                        },
                        onError: {
                            target: "home",
                        },
                    },
                },
                failure: {
                    type: "home",
                },
                loggedIn: {
                    on: {
                        "": [
                            { target: "#main", cond: hasOnboarded },
                            { target: "#onboarding", cond: !hasOnboarded }
                        ]
                    }
                },
            },

        },
        onboarding: {
            id: "onboarding",
            initial: "connect",
            meta: { path: "/onboarding" },
            states: {
                connect: {
                    entry: (context, event) => console.log(context),
                    exit: (context, event) => console.log(context),
                    on: {
                        CONTRIBUTE: {
                            target: "contribute",
                            actions: [
                                assign({ authUser: (context, event) => event.authUser }),
                            ]
                        }
                    }
                },
                contribute: {
                    entry: (context, event) => console.log(context),
                    exit: (context, event) => console.log(context),
                    on: {
                        HAVE_AN_IDEA: {
                            target: "idea",
                            actions: [setContributionType]
                        },
                        HAVE_SKILL: {
                            target: "skills",
                            actions: [setContributionType]
                        },
                    }
                },
                idea: {
                    entry: (context, event) => console.log(context),
                    exit: (context, event) => console.log(context),
                    on: {
                        SUBMIT: {
                            target: "#postOnBoarding",
                            actions: [setIdea]
                        },
                    }
                },
                skills: {
                    entry: (context, event) => console.log(context),
                    exit: (context, event) => console.log(context),
                    on: {
                        SUBMIT: {
                            target: "skillFormComplete",
                            actions: [setUser]
                        }
                    }

                },
                skillFormComplete: {
                    on: {
                        "": [
                            { target: "idea", cond: haveAnIdea },
                            { target: "#postOnBoarding", cond: !haveAnIdea }
                        ]
                    }
                },
                // ideaFormComplete: {
                //     entry: (context, event) => console.log(context),
                //     exit: (context, event) => console.log(context),
                //     on: {
                //         HAVE_AN_IDEA: "idea",
                //         HAVE_SKILL: "skills",
                //         DONE: "#postOnBoarding"
                //     }
                // },

            }
        },
        postOnBoarding: {
            id: "postOnBoarding",
            invoke: {
                id: "update-user-onboarding-status",
                src: "updateUserOnboardingStatus",
                onDone: {
                    target: "#main",
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
                entry: (context, event) => console.log("main"),
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
    }
});

export default rootMachine;