import React, { PureComponent } from "react";
import {
  StyleSheet,
  Platform,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  button: {
    justifyContent: "center"
  },
  title: {
    textAlign: "center"
  },
  raised: {
    ...Platform.select({
      android: {
        elevation: 4
      },
      default: {
        shadowColor: "rgba(0,0,0, .4)",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1
      }
    })
  }
});

export default class AnimatedLoadingButton extends PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    borderRadius: PropTypes.number,
    buttonStyle: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    titleProps: PropTypes.object,
    loadingStyle: PropTypes.object,
    loadingProps: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    TouchableComponent: PropTypes.element,
    raised: PropTypes.bool
  };

  static defaultProps = {
    borderRadius: 0,
    buttonStyle: {},
    title: "Button",
    titleStyle: {},
    titleProps: {},
    loadingStyle: {},
    loadingProps: {},
    TouchableComponent: Platform.select({
      android: TouchableNativeFeedback,
      default: TouchableOpacity
    }),
    raised: false
  };

  state = {
    loading: false
  };

  constructor(props) {
    super(props);

    this.loadingValue = {
      width: new Animated.Value(props.width),
      borderRadius: new Animated.Value(props.borderRadius),
      opacity: new Animated.Value(1)
    };
  }

  setLoading(loading) {
    const { width, height, borderRadius } = this.props;
    if (loading) {
      this.animateButton(width, height, borderRadius, height / 2, 1, 0);
      this.setState({ loading });
    } else {
      setTimeout(() => {
        this.animateButton(height, width, height / 2, borderRadius, 0, 1);
        this.setState({ loading });
      }, 1000);
    }
  }

  animateButton(
    widthStart,
    widthEnd,
    borderRadiusStart,
    borderRadiusEnd,
    opacityStart,
    opacityEnd
  ) {
    const { width, opacity, borderRadius } = this.loadingValue;
    if (width.toValue !== widthEnd) {
      width.setValue(widthStart);
      opacity.setValue(opacityStart);
      borderRadius.setValue(borderRadiusStart);

      Animated.parallel([
        Animated.timing(width, { toValue: widthEnd, duration: 400 }),
        Animated.timing(borderRadius, {
          toValue: borderRadiusEnd,
          duration: 400
        }),
        Animated.timing(opacity, { toValue: opacityEnd, duration: 300 })
      ]).start();
    }
  }

  renderLoading() {
    const { loadingStyle, loadingProps } = this.props;
    return (
      <ActivityIndicator
        style={loadingStyle}
        color={loadingStyle.color}
        {...loadingProps}
      />
    );
  }

  renderTitle() {
    const { opacity } = this.loadingValue;
    const { title, titleStyle, titleProps } = this.props;
    return (
      <Animated.Text
        style={StyleSheet.flatten([styles.title, { opacity }, titleStyle])}
        {...titleProps}
      >
        {title}
      </Animated.Text>
    );
  }

  render() {
    const { loading } = this.state;
    const {
      onPress,
      height,
      buttonStyle,
      TouchableComponent,
      raised,
      ...attributes
    } = this.props;
    const { width, borderRadius } = this.loadingValue;
    return (
      <View style={styles.container}>
        <TouchableComponent
          onPress={!loading ? onPress : null}
          delayPressIn={0}
          activeOpacity={0.3}
          accessibilityRole="button"
          accessibilityStates={[...(loading ? ["busy"] : [])]}
          {...attributes}
        >
          <Animated.View
            style={StyleSheet.flatten([
              styles.button,
              {
                width,
                height,
                borderRadius
              },
              buttonStyle,
              raised && styles.raised
            ])}
          >
            {loading ? this.renderLoading() : this.renderTitle()}
          </Animated.View>
        </TouchableComponent>
      </View>
    );
  }
}
