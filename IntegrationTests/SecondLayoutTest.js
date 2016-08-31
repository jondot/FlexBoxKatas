
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var requestAnimationFrame = require('fbjs/lib/requestAnimationFrame');

var {
  StyleSheet,
  View,
  Text,
} = ReactNative;
var { TestModule } = ReactNative.NativeModules;

var SimpleSnapshotTest = React.createClass({
  componentDidMount() {
    if (!TestModule.verifySnapshot) {
      throw new Error('TestModule.verifySnapshot not defined.');
    }
    requestAnimationFrame(() => TestModule.verifySnapshot(this.done));
  },

  done(success : boolean) {
    TestModule.markTestPassed(success);
  },

  render() {
    return (
      <View style={{backgroundColor: 'white', padding: 100}}>
        <View style={styles.box1} />
        <View style={styles.box2} />
        <View style={styles.box2} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  box1: {
    width: 80,
    height: 50,
    backgroundColor: 'red',
  },
  box2: {
    top: -10,
    left: 20,
    width: 70,
    height: 90,
    backgroundColor: 'blue',
  },
});

SimpleSnapshotTest.displayName = 'SecondLayoutTest';

module.exports = SimpleSnapshotTest;

