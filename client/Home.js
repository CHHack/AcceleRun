import React, { useState } from 'react';
import { Button, Text, View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

import { ApolloProvider, useQuery, gql } from '@apollo/client';
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  label: {
    marginBottom: 2,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginVertical: 12,
  },
  starshipName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  starshipModel: {
    fontStyle: 'italic',
  },
});
const GET_NOMINEES = gql`
  query {
    queryNominee {
      name
      email
      nominatedBy {
          name
      }
    }
  }
`


export default function Home() {
  const { loading, error, data} = useQuery(GET_NOMINEES)
  return (
    <View style={styles.container}>
        {loading && <Text>Loading</Text>}
        {!loading && <>
            {
                data.queryNominee.map((nominee, key) => {
                    return (<View key={key}>
                        <Text>Nominee: {nominee.name}</Text>
                        <Text>Nominated By: {nominee.nominatedBy.name}</Text>
                    </View>)
                })
            }


        </>}
    </View>
  );
}
