import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

import Box from './box'
import styles from './styles'

/*
 * 1. make different layouts per cheatsheet
 * 2. set up testing infra
 * 3. make a sample test that checks position of elements
 * 4. make a sort of kata that verifies component positions
 * 5. see how to snapshot a picture of the sim, so that we can compare in testing time
 * 6. also compare by position
 */

const DefaultLayout = (props)=><View style={[styles.container, {}]}>
                                 <Text>Default</Text>
                                 {[1,2,3].map((n)=><Box key={n} number={n} />)}
                               </View>

const AllFlexedOut = (props)=><View style={[styles.container, {flex:1}]}>
                                 <Text>All flexed out</Text>
                                 {[1,2,3].map((n)=><Box key={n} number={n} />)}
                              </View>

class TestSample extends Component {
  render() {
    return <DefaultLayout/>
  }
}


AppRegistry.registerComponent('FlexBoxKatas', () => TestSample);
