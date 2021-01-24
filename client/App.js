import React, { useState } from 'react';
import { Button, Text, View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apolloClient } from './apollo';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import Home from './Home'


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

export default function App() {

  return (
    <ApolloProvider client={apolloClient}>
      <Home />
    </ApolloProvider>
  );
}
