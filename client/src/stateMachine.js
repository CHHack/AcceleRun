import { Machine, sendParent, send, assign, spawn } from "xstate";
import api from "./graphql/api";

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

// const hasOnboarded = (context, event) => context.user.hasOnboarded;
// const haveAnIdea = (context, event) => context.user.contributionType === "haveAnIdea";

const hasOnboarded = false
const haveAnIdea = false

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



const rootMachine = Machine({
    id: "AcceleRun",
    initial: "loading",
    context: {
        authUser: null,
        user: {
            hasOnboarded: false,
            contributionType: "haveAnIdea",
            name: "",
            lastName: "",
            email: "",
            skills: null,
            idea: null
        }
    },
    states: {
        loading: {
            on: {
                MAIN: {
                    target: "main",
                    actions: assign({ authUser: (context, event) => event.authUser })
                },
                LANDING: {
                    target: "landing",
                    actions: assign({ authUser: (context, event) => event.authUser })
                }
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
                            actions: assign({ user: (context, event) => event.data.user }),
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
                    on: {
                        CONTRIBUTE: {
                            target: "addNewUser",
                            actions: assign({ authUser: (context, event) => event.authUser })
                        }
                    }
                },
                addNewUser: {
                    invoke: {
                        id: "addPerson",
                        src: "addPerson",
                        onDone: {
                            target: "contribute",
                            actions: assign({ user: (context, event) => context.authUser })
                        },
                        onError: {
                            target: "failure",
                        },
                    }
                },
                failure: {
                    type: "final"
                },
                contribute: {
                    on: {
                        HAVE_AN_IDEA: {
                            target: "idea",
                            actions: ["setContributionType"]
                        },
                        HAVE_SKILL: {
                            target: "skills",
                            actions: ["setContributionType"]
                        },
                    }
                },
                idea: {
                    on: {
                        SUBMIT: {
                            target: "addIdea",
                            actions: (context, event) => assign(
                                {
                                    user: {
                                        ...context.user,
                                        idea: event.idea,
                                        hasOnboarded: true
                                    }
                                }
                            )
                        },
                    }
                },
                addIdea: {
                    invoke: {
                        id: "addIdea",
                        src: "addIdea",
                        onDone: {
                            target: "#postOnBoarding",
                        },
                        onError: {
                            target: "failure",
                        },
                    }
                },
                skills: {
                    on: {
                        SUBMIT: {
                            target: "addUserSkills",
                            actions: assign({ user: (context, event) => event.user })
                        }
                    }
                },
                addUserSkills: {
                    invoke: {
                        id: "addUserSkills",
                        src: "addUserSkill",
                        onDone: {
                            target: "skillFormComplete",
                        },
                        onError: {
                            target: "failure",
                        },
                    }
                },
                skillFormComplete: {
                    on: {
                        "": [
                            { target: "idea", cond: haveAnIdea },
                            { target: "#postOnBoarding", cond: !haveAnIdea }
                        ]
                    }
                }
            }
        },
        postOnBoarding: {
            id: "postOnBoarding",
            invoke: {
                id: "update-user-onboarding-status",
                src: "postOnboarding",
                onDone: {
                    target: "#main"
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
                    // entry: podAddedNotification,
                    type: "final"

                },
                podUpdated: {
                    // entry: podUpdatedNotification
                    type: "final"
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
                            // entry: assetAddedNotification
                            type: "final"
                        },
                    }
                },
            }
        }
    },
    services: {
        getPerson: (context, event) => {
            return new Promise(async (resolve, reject) => {
                const { authUser } = context

                const result = await api.getPerson({ ...authUser })
                resolve(result)
            })
        },
        addPerson: (context, event) => {
            return new Promise(async (resolve, reject) => {
                const { authUser } = context
                const result = await api.addNewPerson({ ...authUser })
                resolve(result)
            })
        },
        addIdea: (context, event) => {
            return new Promise(async (resolve, reject) => {
                const idea = { name: "", goal: "", skillsNeeded: [{ name: "skill" }] };
                const res = await api.addIdea(idea);
                resolve(res);
            })
        },
        addUserSkill: (context, event) => {
            return new Promise(async (resolve, reject) => {
                const mappedSkills = context.user.skills.map(skill => { return { name: skill } });
                const user = { email: context.authUser.email, skills: mappedSkills };
                const res = await api.addSkillToPerson(user);
                resolve(res);
            })

        }
    },
    actions: {
        setContributionType: assign({
            user: (context, event) => ({
                ...context.user,
                contributionType: event.contributionType
            })

        }),
        setIdea: assign({
            user: (context, event) => ({
                ...context.user,
                idea: event.idea,
                hasOnboarded: true
            })
        }),

        setUser: assign({
            user: (context, event) => {
                let user = {}

                user.name = event.user.name;
                user.lastName = event.user.lastName;
                user.email = context.authUser.email;
                user.imageSource = event.user.imageSource;
                user.positions = event.user.positions;
                user.skills = event.user.skills;

                return assign({
                    user: {
                        ...context.user,
                        ...user
                    }
                })
            }
        })
    }
});

export default rootMachine;