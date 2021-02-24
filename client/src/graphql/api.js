import { apolloClient } from './apollo'
import {
    MARK_PERSON_AS_ONBOARDED_MUTATION,
    ADD_NEW_PERSON_MUTATION,
    GET_PERSON,
    ADD_SKILLS_TO_PERSON_MUTATION
} from './queries'

const api = {
    getPerson: async ({ name, email, clubhouseHandle }) => {
        return await apolloClient.query({
            query: GET_PERSON, variables: {
                email
            }
        })
    },
    addNewPerson: async ({ name, email, clubhouseHandle }) => {
        return await apolloClient.mutate({
            mutation: ADD_NEW_PERSON_MUTATION, variables: {
                name,
                email,
                clubhouseHandle,
                onBoarded: false
            }
        })
    },
    updateUserOnboardingStatus: async ({ user }) => {
        return await apolloClient.mutate({
            mutation: MARK_PERSON_AS_ONBOARDED_MUTATION, variables: {
                email: user.email
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
    }
}


export default api