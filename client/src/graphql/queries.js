import gql from "graphql-tag";

export const GET_PERSON = gql`
  query getPerson($email: String!) {
    getPerson(email: $email) {
      onBoarded
      name
      email
      imageSource
      pod {
        name
        creation_time
        members{
          imageSource
        }
        idea {
          name
          goal
        }
        chat {
          title
          creation_time
          content
          person {
            email
            imageSource
            name
          }     
        }
        events{
          title
          date
          creation_time
          content
        }
        assets {
          type
          url
        }
      }
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

export const ADD_POD = gql`
  mutation addPod($name:String!, $idea:IdeaRef!, $creation_time: DateTime, $members: [PersonRef], $events: [EventRef]) {
    addPod(input: {name: $name, idea: $idea, creation_time: $creation_time, members: $members, events: $events}) {
      pod {
        name
      }
    }
  }
`;

export const QUERY_PODS = gql`
  query queryPods($pageSize: Int){
    queryPod(first: $pageSize) {
      name
      creation_time
      members{
        imageSource
      }
      assets {
        url
        type
      }
      chat {
          title
          creation_time
          content
          person {
            imageSource
            name
          }     
      }
      events {
        title
        date
        creation_time
        content
      }
      assets {
        type
        url
      }
      idea {
        name
        goal
        skillsNeeded {
          name
        }
      }
      members {
        name
        type
      }
    }
  }
`;

export const ADD_PERSON_TO_POD = gql`
  mutation addMemberToPod($name:String, $members: [PersonRef], $chatBubbles: [ChatBubbleRef]) {
    updatePod(input: {set: {members: $members, chat:$chatBubbles}, filter: {name: {eq: $name}}}){
      pod {
        name,
        creation_time
        members{
          imageSource
        }
        chat {
          creation_time
          content
          title
          person {
            email
            imageSource
            name
          }
        }
        events {
          title
          date
          creation_time
          content
        }
        assets {
          type
          url
        }
      }
    }
  }
`

export const ADD_CHAT_BUBBLE_TO_POD = gql`
  mutation addChatBubbleToPod($name:String, $chatBubble: [ChatBubbleRef]) {
    updatePod(input: {filter: {name: {eq: $name}},set: {chat: $chatBubble}}){
      pod {
        name,
        creation_time
        members{
          imageSource
        }
        chat {
          creation_time
          content
          title
          person {
            email
            imageSource
            name
          }
        }
        events {
          title
          date
          creation_time
          content
        }
        assets {
          type
          url
        }
      }
    }
  }
`

export const ADD_ASSER_TO_POD = gql`
  mutation addAssetToPod($name:String, $assets: [AssetRef]) {
    updatePod(input: {filter: {name: {eq: $name}},set: {assets: $assets}}){
      pod {
        name,
        creation_time
        members{
          imageSource
        }
        chat {
          creation_time
          content
          title
          person {
            email
            imageSource
            name
          }
        }
        events {
          title
          date
          creation_time
          content
        }
        assets {
          type
          url
        }
      }
    }
  }
`