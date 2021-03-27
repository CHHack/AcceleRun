import { Machine, sendParent, send, assign, spawn, interpret } from "xstate";
import api from "./graphql/api";

const addPerson = async (context) => {
	const { user } = context;
	try {
		if (user.onBoarded === undefined) {
			return await api.addNewPerson({ ...user });
		}
	} catch (error) {
		console.log(error);
	}
};

const addPersonSkills = async (context) => {
	try {
		const mappedSkills = context.user.skills.map((skill) => {
			return { name: skill };
		});
		const mappedPositions = context.user.positions.map((position) => {
			return { name: position };
		});
		const user = {
			email: context.user.email,
			skills: mappedSkills,
			positions: mappedPositions,
		};
		const result = await api.addSkillToPerson(user);
		return result;
	} catch (error) {
		console.log(error);
	}
};

const getPerson = async (context) => {
	try {
		const { authUser } = context;
		const result = await api.getPerson({ ...authUser });
		return result;
	} catch (error) {
		console.log(error);
	}
};

const addPersonToPod = async (context) => {
	try {
		const { user, selectedPod } = context;
		const res = await api.addPersonToPod(selectedPod.name, { email: user.email, name: user.name });
		return res.data.updatePod.pod;
	} catch (error) {
		console.log(error);
	}
};

const addChatBubble = async (context, event) => {
	if (!context.chatBubble) {
		return;
	}
	const res = await api.addChatBubbleToPod(context.user.pod.name, [context.chatBubble]);
	return res.data.updatePod.pod;
}

const addAsset = async (context, event) => {
	if (!context.asset) {
		return;
	}
	const res = await api.addAssetToPod(context.user.pod.name, [context.asset]);
	return res.data.updatePod.pod;
}

const addIdea = async (context) => {
	try {
		const { idea } = context.user;
		const ideaDb = {
			name: idea.idea,
			goal: idea.pitch,
			skillsNeeded: [
				...idea.teamSkills.map((skill) => {
					return { name: skill };
				}),
			],
			categories: [
				...idea.ideaCategories.map((category) => {
					return { name: category };
				}),
			],
		};

		await api.addPod(idea.idea, ideaDb, new Date().toISOString());
	} catch (error) {
		console.log(error);
	}
};

const updateOnboardingStatus = async (context) => {
	try {
		const { email } = context.user;
		const res = await api.updateUserOnboardingStatus(email);
		return res;
	} catch (error) {
		console.log(error);
	}
};

const loadPods = async (context) => {
	try {
		const pods = await api.queryPods();
		context.pods = pods.data.queryPod;
	} catch (error) {
		console.log(error);
	}
};

const haveAnIdea = (context) => context.user.contributionType === "haveAnIdea";
const onBoarded = (context) => context.user.onboarded;
const haveUser = (context) => context.user;
const userInAPod = (context) => context.user.pod;

const remoteMachine = Machine({
	id: "remote",
	initial: "offline",
	states: {
		offline: {
			on: {
				WAKE: "online",
			},
		},
		online: {
			after: {
				3000: {
					actions: sendParent("POD_UPDATED"),
				},
			},
		},
	},
});

const rootMachine = Machine({
	id: "AcceleRun",
	initial: "loading",
	context: {
		authUser: null,
		user: null,
	},
	states: {
		loading: {
			on: {
				MAIN: {
					target: "portal",
					actions: assign({ user: (context, event) => event.user }),
				},
				LANDING: {
					target: "landing",
					actions: assign({
						authUser: (context, event) => event.authUser,
						user: (context, event) => {
							if (!event.user) {
								return null;
							}
							let user = {
								...event.user,
							};
							if (event.user?.skills) {
								user.skills = event.user.skills.map((skill) => skill.name);
							}
							if (event.user?.positions) {
								user.positions = event.user.positions.map((skill) => skill.name);
							}
							return user;
						},
					}),
				},
			},
		},
		landing: {
			id: "landing",
			initial: "home",
			states: {
				home: {
					on: {
						LOGIN: "#login",
						ONBOARDING: "#onboarding",
					},
				},
				failure: {
					type: "home",
				},
				loggedIn: {
					on: {
						"": [
							{ target: "#portal", cond: onBoarded },
							{ target: "#onboarding", cond: !onBoarded },
						],
					},
				},
			},
		},
		onboarding: {
			id: "onboarding",
			initial: "init",
			states: {
				init: {
					on: {
						"": [
							{ target: "addNewUser", cond: haveUser },
							{ target: "connect", cond: !haveUser },
						],
					},
				},
				connect: {
					meta: { path: "/connect" },
					on: {
						ONBOARDING: {
							target: "addNewUser",
							actions: assign({ user: (context, event) => event.user })
						},
						MAIN: {
							target: "#portal",
							actions: assign({ user: (context, event) => event.user })
						},
						LOGIN: "#login"
					}
				},
				addNewUser: {
					invoke: {
						id: "addPerson",
						src: (context, evet) => addPerson(context),
						onDone: {
							target: "contribute",
						},
						onError: {
							target: "failure",
						},
					},
				},
				failure: {
					type: "final",
				},
				contribute: {
					meta: { path: "/contribute" },
					on: {
						HAVE_AN_IDEA: {
							target: "idea",
							actions: assign({
								user: (context, event) => ({
									...context.user,
									contributionType: event.contributionType,
								}),
							}),
						},
						HAVE_SKILL: {
							target: "skills",
							actions: assign({
								user: (context, event) => ({
									...context.user,
									contributionType: event.contributionType,
								}),
							}),
						},
					},
				},
				idea: {
					meta: { path: "/idea" },
					on: {
						SUBMIT: {
							target: "addIdea",
							actions: assign({
								user: (context, event) => ({
									...context.user,
									idea: event.idea,
									onBoarded: true,
								}),
							}),
						},
						skills: {
							target: "skills",
						},
					},
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
					},
				},
				skills: {
					meta: { path: "/skills" },
					on: {
						SUBMIT: {
							target: "addUserSkills",
							actions: assign({
								user: (context, event) => ({
									...context.user,
									...event.user,
								}),
							}),
						},
						contribute: {
							target: "contribute",
						},
					},
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
					},
				},
				skillFormComplete: {
					on: {
						"": [
							{ target: "idea", cond: haveAnIdea },
							{ target: "#postOnBoarding", cond: !haveAnIdea },
						],
					},
				},
			},
		},
		login: {
			id: "login",
			meta: { path: "/login" },
			on: {
				MAIN: {
					target: "#portal",
					actions: assign({ user: (context, event) => event.user })
				},
				ONBOARDING: {
					target: "#onboarding",
					actions: assign({ user: (context, event) => event.user })
				}
			}
		},
		postOnBoarding: {
			id: "postOnBoarding",
			invoke: {
				id: "update-user-onboarding-status",
				src: (context, event) => updateOnboardingStatus(context),
				onDone: {
					target: "#portal",
					actions: assign({ 
						user: (context, event) => {
							let user = {...context.user};
							user.onBoarded = true;
							return user;
						}
					})
				},
				onError: {
					target: "#onboarding",
				},
			},
		},
		portal: {
			id: "portal",
			initial: "init",
			context: {			
			},
			states: {
				init:{
					on: {
						"": [
							{ target: "pod", cond: userInAPod },
							{ target: "loadPods", cond: !userInAPod },
						],
					},
				},
				loadPods: {
					invoke: {
						id: "loadPods",
						src: (context, event) => loadPods(context),
						onDone: {
							target: "ideas",
						},
						onError: {
							target: "ideas",
						},
					},
				},
				ideas: {
					meta: { path: "/portal" },
					on: {
						JOIN_POD: {
							target: "addPersonToPod",
							actions: assign({ selectedPod: (context, event) => event.pod })
						},
						COMMUNITY: "community",
						POD:"pod",
						SHARE: "share",
						LANDING: "#landing"
					},
				},
				addPersonToPod: {
					invoke: {
						id: "addPersonToPod",
						src: (context, evet) => addPersonToPod(context),
						onDone: {
							target: "pod",
							actions: assign({ 
								user: (context, event) => {
									let user = {...context.user};
									user.pod = event.data[0];
									return user;
								}
							})
						},
						onError: {
							target: "ideas",
						},
					},
				},
				pod: {
					meta: { path: "/pod" },
					on: {
						ADD_CHAT_BUBBLE:{
							target: "addChatBubble",
							actions: assign({chatBubble: (context, event) => event.chatBubble })
						},
						ADD_ASSET:{
							target: "addAsset",
							actions: assign({asset: (context, event) => event.asset })
						},
						IDEAS: "loadPods",
						SHARE: "share",
						COMMUNITY: "community",
						MY_TASKS: "my_tasks"
					},
				},
				addAsset: {
					invoke: {
						id: "addAsset",
						src: (context, evet) => addAsset(context),
						onDone: {
							target: "pod",
							actions: assign({ 
								asset:(context, event) => "",
								user: (context, event) => {
									let user = {...context.user};
									user.pod = event.data[0];
									return user;
								}
							})
						},
						onError: {
							target: "pod",
						},
					},
				},
				addChatBubble: {
					invoke: {
						id: "addChatBubble",
						src: (context, evet) => addChatBubble(context),
						onDone: {
							target: "pod",
							actions: assign({ 
								chatBubble:(context, event) => "",
								user: (context, event) => {
									let user = {...context.user};
									user.pod = event.data[0];
									return user;
								}
							})
						},
						onError: {
							target: "pod",
						},
					},
				},
				my_tasks: {
					meta: { path: "/pod/my-tasks" },
					on: {
						IDEAS: "loadPods",
						SHARE: "share",
						COMMUNITY: "community",
						POD: "pod"
					},
				},
				community: {
					meta: { path: "/community" },
					on: {
						IDEAS: "loadPods",
						SHARE: "share",
						POD:"pod",
						LANDING: "#landing"
					},
				},
				share: {
					meta: { path: "/share" },
					on: {
						IDEAS: "loadPods",
						COMMUNITY: "community",
						POD:"pod",
						LANDING: "#landing"
					},
				}
			},
		},
	},
});

export default rootMachine;
