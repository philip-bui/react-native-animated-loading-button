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
  buttonContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  button: {
    width: "100%",
    height: "100%",
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
  },
  disabled: {
    backgroundColor: "hsl(208, 8%, 90%)"
  }
});

export default class AnimatedLoadingButton extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    titleProps: PropTypes.object,
    loadingStyle: PropTypes.object,
    loadingProps: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    TouchableComponent: PropTypes.element,
    duration: PropTypes.number,
    raised: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledStyle: PropTypes.object
  };

  static defaultProps = {
    containerStyle: {
      width: "100%",
      height: 50
    },
    buttonStyle: {
      backgroundColor: "#424242",
      borderRadius: 4,
      paddingHorizontal: 16
    },
    title: "Button",
    titleStyle: {
      color: "white"
    },
    titleProps: {},
    loadingStyle: {
      color: "white"
    },
    loadingProps: {},
    TouchableComponent: Platform.select({
      android: TouchableNativeFeedback,
      default: TouchableOpacity
    }),
    duration: 400,
    raised: false,
    disabled: false,
    disabledStyle: {}
  };

  state = {
    loading: false
  };

  // We want to turn any percentages into a numeric width.
  containerWidth = 3000;

  // We want to turn any percentages into a numeric height.
  containerHeight = 3000;

  constructor(props) {
    super(props);
    const { borderRadius } = props.buttonStyle;

    this.loadingValue = {
      maxWidth: new Animated.Value(this.containerWidth),
      borderRadius: new Animated.Value(borderRadius || 0),
      opacity: new Animated.Value(1)
    };
  }

  get borderRadius() {
    const { buttonStyle } = this.props;
    return buttonStyle.borderRadius || 0;
  }

  setLoading = loading => {
    const { duration } = this.props;
    if (loading) {
      this.animateButton(this.containerHeight, this.containerHeight / 2, 0);
      setTimeout(() => {
        this.setState({ loading });
      }, duration);
    } else {
      this.animateButton(this.containerWidth, this.borderRadius, 1);
      this.setState({ loading });
    }
  };

  animateButton(maxWidthEnd, borderRadiusEnd, opacityEnd) {
    const { duration } = this.props;
    const { maxWidth, opacity, borderRadius } = this.loadingValue;

    Animated.timing(maxWidth, {
      toValue: maxWidthEnd,
      duration
    }).start();
    Animated.timing(borderRadius, {
      toValue: borderRadiusEnd,
      duration
    }).start();
    Animated.timing(opacity, { toValue: opacityEnd, duration }).start();
  }

  onLayout = e => {
    const { layout } = e.nativeEvent;
    const { loading } = this.state;
    this.containerWidth = layout.width;
    this.containerHeight = layout.height;
    if (!loading) {
      this.loadingValue.maxWidth.setValue(this.containerWidth);
    }
  };

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
      containerStyle,
      TouchableComponent,
      onPress,
      buttonStyle,
      raised,
      disabled,
      disabledStyle,
      titleStyle,
      ...props
    } = this.props;
    const { maxWidth, borderRadius } = this.loadingValue;
    // The container will help calculate the layout width and height.
    // The animated view will help animate the restricted maxWidth, borderRadius.
    return (
      <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.buttonContainer,
            {
              maxWidth,
              borderRadius
            }
          ])}
        >
          <TouchableComponent
            onPress={onPress}
            disabled={loading}
            delayPressIn={0}
            activeOpacity={0.3}
            accessibilityRole="button"
            accessibilityStates={[...(loading ? ["busy"] : [])]}
            background={
              Platform.OS === "android" && Platform.Version >= 21
                ? TouchableNativeFeedback.Ripple(
                    titleStyle.color || "white",
                    false
                  )
                : undefined
            }
            {...props}
          >
            <View
              style={StyleSheet.flatten([
                styles.button,
                raised && styles.raised,
                buttonStyle,
                disabled && styles.disabled,
                disabled && disabledStyle
              ])}
            >
              {loading ? this.renderLoading() : this.renderTitle()}
            </View>
          </TouchableComponent>
        </Animated.View>
      </View>
    );
  }
}
