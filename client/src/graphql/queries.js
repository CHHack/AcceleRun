import gql from "graphql-tag";

export const GET_PERSON = gql`
  query getPerson($email: String!){
    getPerson(email: $email){
      onBoarded
      name
      email
      imageSource
      positions {
        name
      }
      skills {
        name
      }
    }
  }
`;

export const ADD_NEW_PERSON_MUTATION = gql`
  mutation addNewPerson($name: String!, $email: String!, $imageSource: String) {
    addPerson(input: {name: $name, email: $email, imageSource: $imageSource, onBoarded: false}) {
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
  mutation addSkillsToPerson($email: String, $skills: [SkillRef!], $positions: [PositionRef!]) {
    updatePerson(input: {filter: {email: {eq: $email}}, set: {skills: $skills, positions: $positions}}) {
      person {
        email
        skills {
          name
        }
        positions {
          name
        }
      }
    }
  }
`;

export const ADD_IDEA = gql`
  mutation addIdea($name: String!, $goal: String!, $skillsNeeded: [SkillRef!], $categories: [CategoryRef!]) {
    addIdea(input: {name: $name, goal: $goal, skillsNeeded: $skillsNeeded, categories: $categories}) {
      idea {
        goal
        name
        skillsNeeded {
          name
        }
        categories {
          name
        }
      }
    }
  }
`;

export const QUERY_IDEAS = gql`
  query queryIdea($pageSize: Int){
    queryIdea(first: $pageSize) {
      goal
      name
      skillsNeeded {
        name
      }
      categories {
        name
      }
    }
  }
`;