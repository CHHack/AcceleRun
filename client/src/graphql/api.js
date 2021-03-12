import { apolloClient } from './apollo'
import {
    MARK_PERSON_AS_ONBOARDED_MUTATION,
    ADD_NEW_PERSON_MUTATION,
    GET_PERSON,
    ADD_SKILLS_TO_PERSON_MUTATION,
    ADD_IDEA
} from './queries'

const api = {
    getPerson: async (email) => {
        return await apolloClient.query({
            query: GET_PERSON, variables: {
                email
            }
        })
    },
    addNewPerson: async ({ name, email }) => {
        return await apolloClient.mutate({
            mutation: ADD_NEW_PERSON_MUTATION, variables: {
                name,
                email,
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
    addSkillToPerson: async ({ email, skills }) => {
        return await apolloClient.mutate({
            mutation: ADD_SKILLS_TO_PERSON_MUTATION, variables: {
                email,
                skills
            }
        })
    },
    addIdea: async ({ name, goal, skillsNeeded }) => {
        return await apolloClient.mutate({
            mutation: ADD_IDEA, variables: {
                name,
                goal,
                skillsNeeded
            }
        })
    }
}


export default api