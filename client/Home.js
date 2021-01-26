// import React, { useState } from 'react'
// import {
//   Button,
//   Text,
//   View,
//   SafeAreaView,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native'
// import TwitterLogin from 'react-twitter-login'

// import { ApolloProvider, useQuery, gql } from '@apollo/client'
// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 50,
//   },
//   label: {
//     marginBottom: 2,
//     fontSize: 12,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//   },
//   section: {
//     marginVertical: 12,
//   },
//   starshipName: {
//     fontSize: 32,
//     fontWeight: 'bold',
//   },
//   starshipModel: {
//     fontStyle: 'italic',
//   },
// })

// export default function Home() {
//   // const { loading, error, data} = useQuery(GET_NOMINEES)
//   return (
//     <View style={styles.container}>
//       <Button label="Create a Project"></Button>
//     </View>
//   )
// }

import React from 'react'
import { StyleSheet, Text, View, AppRegistry } from 'react-native'

import { NativeRouter, Route, Link } from 'react-router-native'

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
  },
  header: {
    fontSize: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  topic: {
    textAlign: 'center',
    fontSize: 15,
  },
})

const HomeA = () => <Text style={styles.header}>Home</Text>

const About = () => <Text style={styles.header}>About</Text>

const Topic = ({ match }) => (
  <Text style={styles.topic}>{match.params.topicId}</Text>
)

const Topics = ({ match }) => (
  <View>
    <Text style={styles.header}>Topics</Text>
    <View>
      <Link
        to={`${match.url}/rendering`}
        style={styles.subNavItem}
        underlayColor="#f0f4f7"
      >
        <Text>Rendering with React</Text>
      </Link>
      <Link
        to={`${match.url}/components`}
        style={styles.subNavItem}
        underlayColor="#f0f4f7"
      >
        <Text>Components</Text>
      </Link>
      <Link
        to={`${match.url}/props-v-state`}
        style={styles.subNavItem}
        underlayColor="#f0f4f7"
      >
        <Text>Props v. State</Text>
      </Link>
    </View>

    <Route path={`${match.path}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.path}
      render={() => <Text style={styles.topic}>Please select a topic.</Text>}
    />
  </View>
)

export default function Home() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>Home</Text>
          </Link>
          <Link to="/about" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>About</Text>
          </Link>
          <Link to="/topics" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>Topics</Text>
          </Link>
        </View>

        <Route exact path="/" component={HomeA} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </View>
    </NativeRouter>
  )
}
