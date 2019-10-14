import React, { Component } from 'react';
import { Text, FlatList, Animated, TouchableOpacity } from 'react-native';

import { withCollapsible, CustomComponent } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MyComponent = (props) => (<Text>MyComponent</Text>);

class DefaultHeaderScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: prop => ( // This didn't workout
        <CustomComponent {...prop}>
          <MyComponent/>
        </CustomComponent>
      ),
    };
  };

  constructor(props) {
    super(props);

    const data = [];
    for (let i = 0; i < 60; i++) {
      data.push(i);
    }

    this.state = {
      data: data,
    };
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('DetailScreen');
      }}
      style={{
        width: '100%',
        height: 50,
        borderBottomColor: '#0002',
        borderBottomWidth: 0.5,
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <Text style={{ fontSize: 22 }}>{item}</Text>
    </TouchableOpacity>
  );

  // onScroll = e => {
  //   console.log(e.nativeEvent.contentOffset);
  // }

  render() {
    const { paddingHeight, animatedY, onScroll } = this.props.collapsible;

    return (
      <AnimatedFlatList
        style={{ flex: 1 }}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => String(index)}

        contentContainerStyle={{ paddingTop: paddingHeight }}
        scrollIndicatorInsets={{ top: paddingHeight }}
        onScroll={onScroll}
        // if you want to use 'onScroll' callback.
        // onScroll={Animated.event(
        //   [{nativeEvent: {contentOffset: {y: animatedY}}}],
        //   {useNativeDriver:true, listener:this.onScroll})}
        _mustAddThis={animatedY}
      />
    );
  }
}

export default withCollapsible(DefaultHeaderScreen, { iOSCollapsedColor: 'red' });
