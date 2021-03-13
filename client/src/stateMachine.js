import { Machine, sendParent, send, assign, spawn } from "xstate";
import api from "./graphql/api";

const addPerson = async (context) => {
    const { user } = context;
    try {
        const result = await api.addNewPerson({ ...user })
        return result;
    }
    catch (error) {
        console.log(error);
    }
};

const addPersonSkills = async (context) => {
    try {
        const mappedSkills = context.user.skills.map(skill => { return { name: skill } });
        const mappedPositions = context.user.positions.map(position => { return { name: position } });
        const user = { 
            email: context.user.email,
            skills: mappedSkills,
            positions: mappedPositions
        };
        const result = await api.addSkillToPerson(user);
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getPerson = async (context) => {
    try {
        const { authUser } = context;
        const result = await api.getPerson({ ...authUser });
        return result;
    } catch (error) {
        console.log(error);
    }
};

const addIdea = async (context) => {
    try {
        const { idea } = context.user;
        const ideaDb = { 
            name: idea.idea,
            goal: idea.pitch,
            skillsNeeded: [
                ...idea.teamSkills.map(skill => { return { name: skill } }),  
            ],
            categories:[
                ...idea.ideaCategories.map(category => { return { name: category } })
            ]
        };
        
        await api.addIdea(ideaDb);
    } catch (error) {
        console.log(error);
    }
};

const updateOnboardingStatus = async (context) => {
    try {
        const { email } = context.user;
        await api.updateUserOnboardingStatus(email);
    } catch (error) {
        console.log(error);
    }
};

const haveAnIdea = (context) => context.user.contributionType ==="haveAnIdea";
const hasOnboarded = (context) => context.user.hasOnboarded;
const haveUser = (context) => context.user;

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

const rootMachine = Machine({
    id: "AcceleRun",
    initial: "loading",
    context: {
        authUser: null,
        user: null
    },
    states: {
        loading: {
            on: {
                MAIN: {
                    target: "main",
                    actions: assign({ user: (context, event) => event.user })
                },
                LANDING: {
                    target: "landing",
                    actions: assign({ 
                        authUser: (context, event) => event.authUser,
                        user: (context, event) => event.user
                    })
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
            initial: "init",
            meta: { path: "/onboarding" },
            states: {
                init:{
                    on: {
                        "": [
                            { target: "addNewUser", cond: haveUser },
                            { target: "connect", cond: !haveUser }
                        ]
                    }
                },
                connect: {
                    on: {
                        CONTRIBUTE: {
                            target: "addNewUser",
                            actions: assign({
                                user: (context, event) => {
                                    return {
                                        name: event.authUser.name,
                                        email: event.authUser.email,
                                        imageSource: event.authUser.photoURL                           
                                    }
                                }
                            })
                        }
                    }
                },
                addNewUser: {
                    invoke: {
                        id: "addPerson",
                        src: (context, evet) => addPerson(context),
                        onDone: {
                            target: "contribute",
                            // actions: assign({ user: (context, event) => context.authUser })
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
                            actions: assign({
                                user: (context, event) => ({
                                    ...context.user,
                                    contributionType: event.contributionType
                                })
                            })
                        },
                        HAVE_SKILL: {
                            target: "skills",
                            actions: assign({
                                user: (context, event) => ({
                                    ...context.user,
                                    contributionType: event.contributionType
                                })
                            })
                        }
                    }
                },
                idea: {
                    on: {
                        SUBMIT: {
                            target: "addIdea",
                            actions: assign({
                                user: (context, event) => ({
                                    ...context.user,
                                    idea: event.idea,
                                    hasOnboarded: true
                                })
                            })
                        },
                    }
                },
                addIdea: {
                    invoke: {
                        id: "addIdea",
                        src: (context, evet) => addIdea(context),
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
                            actions: assign({ 
                                user: (context, event) => ({
                                    ...context.user,
                                    ...event.user
                                })
                            })
                        }
                    }
                },
                addUserSkills: {
                    invoke: {
                        id: "addUserSkills",
                        src: (context, evet) => addPersonSkills(context),
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
                src: (context, event) => updateOnboardingStatus(context),
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
    }
});

export default rootMachine;