import gql from "graphql-tag";

export const GET_PERSON = gql`
  query getPerson($email: String!){
    getPerson(email: $email){
      name
    }
  }
`;

export const ADD_NEW_PERSON_MUTATION = gql`
  mutation addNewPerson($name: String!, $email: String!) {
    addPerson(input: {name: $name, email: $email, onBoarded: false}) {
      person {
        email
      }
    }
  }
`;

export const MARK_PERSON_AS_ONBOARDED_MUTATION = gql`
  mutation markPersonAsOnboarded($email: String!) {
    updatePerson(input: {filter: {email: {eq: $email}}, set: {onBoarded: true}}) {
      numUids
      person {
        email
        onBoarded
      }
    }
  }
`;

export const ADD_SKILLS_TO_PERSON_MUTATION = gql`
  mutation addSkillsToPerson($email: String, $skills: [SkillRef!]) {
    updatePerson(input: {filter: {email: {eq: $email}}, set: {skills: $skills}}) {
      person {
        email
        skills {
          name
        }
      }
    }
  }
`;

export const ADD_IDEA = gql`
  mutation addIdea($name: String, $goal: String, $skillsNeeded: [SkillRef!]) {
    addIdea(input: {name: $name, goal: $goal, skillsNeeded: $skillsNeeded}) {
      idea {
        goal
        name
        skillsNeeded {
          name
        }
      }
    }
  }
`;
