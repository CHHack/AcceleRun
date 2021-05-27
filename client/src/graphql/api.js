import moment from "moment";
import { apolloClient } from './apollo';
import {
    MARK_PERSON_AS_ONBOARDED_MUTATION,
    ADD_NEW_PERSON_MUTATION,
    GET_PERSON,
    ADD_SKILLS_TO_PERSON_MUTATION,
    ADD_PERSON_TO_POD,
    REMOVE_PERSON_FROM_POD,
    ADD_CHAT_BUBBLE_TO_POD,
    ADD_ASSET_TO_POD,
    UPDATE_ASSET,
    ADD_IDEA,
    ADD_POD,
    QUERY_PODS
} from './queries'

const api = {
    getPerson: async (email) => {
        // const res = await fetch(`http://localhost:5000/api/users/${email}`);
        // return await res.json();
        return await apolloClient.query({
            query: GET_PERSON, variables: {
                email
            }
        })
    },
    addNewPerson: async ({ name, email, imageSource }) => {
        return await apolloClient.mutate({
            mutation: ADD_NEW_PERSON_MUTATION, variables: {
                name,
                email,
                imageSource,
                onBoarded: false
            }
        })
    },
    updateUserOnboardingStatus: async (email) => {
        return await apolloClient.mutate({
            mutation: MARK_PERSON_AS_ONBOARDED_MUTATION, variables: {
                email: email
            }
        })
    },
    addSkillToPerson: async ({ email, skills, positions }) => {
        return await apolloClient.mutate({
            mutation: ADD_SKILLS_TO_PERSON_MUTATION, variables: {
                email, skills, positions
            }
        })
    },
    addIdea: async ({ name, goal, skillsNeeded, categories }) => {
        return await apolloClient.mutate({
            mutation: ADD_IDEA, variables: { name, goal, skillsNeeded, categories }
        })
    },
    addPod: async (name, idea, creation_time) => {

        const members = [{ email: `accelebot-${name}@accelerun.co`, name: "AcceleBot", type: "bot" }];
        const events = [
            { creation_time: moment().toISOString(), date: moment().toISOString(), title: "Pod created", content: "Let's do this!" },
            { creation_time: moment().toISOString(), date: moment().add(1, "d").toISOString(), title: "Team intro", content: "Your first team meeting" },
            { creation_time: moment().toISOString(), date: moment().add(5, "d").toISOString(), title: "Team sync", content: "Let's see what you've done :)" },
            { creation_time: moment().toISOString(), date: moment().add(7, "d").toISOString(), title: "Pre prod testing", content: "Last chance to find and fix all bugs" },
            { creation_time: moment().toISOString(), date: moment().add(10, "d").toISOString(), title: "Going Live!", content: "You've done it!!!" }
        ];

        return await apolloClient.mutate({ mutation: ADD_POD, variables: { name, idea, creation_time, members, events } })
    },
    addPersonToPod: async (name, person) => {
        const members = [person];
        const chatBubbles = [];
        if (person.type !== "admin") {
            const bubble = {
                title: `Hello ${person.name} :)`,
                content: "We are so happy to see you here!",
                creation_time: new Date().toISOString(),
                person: { email: `accelebot-${name}@accelerun.co` }
            };
            chatBubbles.push(bubble);
        }
        return await apolloClient.mutate({ mutation: ADD_PERSON_TO_POD, variables: { name, members, chatBubbles } })
    },
    removePersonFromPod: async (pod, person) => {

        const chatBubbles = [];
        const name = pod.name;
        const email = person.email;

        if (person.type !== "admin") {
            const bubble = {
                content: `${person.name} left the pod`,
                creation_time: new Date().toISOString(),
                person: { email: `accelebot-${pod.name}@accelerun.co` }
            };
            chatBubbles.push(bubble);
        }

        return await apolloClient.mutate({
            mutation: REMOVE_PERSON_FROM_POD, variables: {
                name,
                email,
                chatBubbles
            }
        })
    },
    addChatBubbleToPod: async (name, chatBubble) => {
        return await apolloClient.mutate({
            mutation: ADD_CHAT_BUBBLE_TO_POD, variables: {
                name,
                chatBubble
            }
        })
    },
    addAssetToPod: async (person, podName, asset) => {

        const chatBubbles = [];
        const assets = [asset];
        const name = podName;

        if (person.type !== "admin") {
            const bubble = {
                title: `${person.name} added a new asset`,
                content: `[[link-macro]]|${asset.url}|${asset.name}`,
                creation_time: new Date().toISOString(),
                person: { email: `accelebot-${podName}@accelerun.co` }
            };
            chatBubbles.push(bubble);
        }

        return await apolloClient.mutate({
            mutation: ADD_ASSET_TO_POD, variables: {
                name,
                assets,
                chatBubbles
            }
        })
    },
    updateAsset: async (filter, set) => {
        return await apolloClient.mutate({
            mutation: UPDATE_ASSET, variables: {
                filter,
                set
            }
        })
    },
    queryPods: async (pageSize) => {
        return await apolloClient.query({
            query: QUERY_PODS, variables: {
                pageSize
            }
        })
    }
}

export default api;