# React Native Animated Loading Button
[![Actions Status](https://github.com/philip-bui/react-native-animated-loading-button/workflows/build/badge.svg)](https://github.com/philip-bui/react-native-animated-loading-button/actions)

React Native Animated Loading Button is a button component that animates to a loading button and vice versa.

## Installation

Authenticate to GitHub Package Registry using either a .npmrc file or with npm login. For more information, see "[Authenticating to GitHub Package Registry](https://help.github.com/en/github/managing-packages-with-github-package-registry/configuring-npm-for-use-with-github-package-registry#authenticating-to-github-package-registry)."

```bash
$ npm install react-native-animated-loading-button
```

```
$ yarn add react-native-animated-loading-button
```

## Usage

```javascript
import AnimatedLoadingButton from "react-native-animated-loading-button";

export default class View extends React.Component {

  loadingButton = React.createRef();

  showLoading() {
    this.loadingButton.setLoading(true);
  }

  showButton() {
    this.loadingButton.setLoading(false);
  }

  render() {
    return <AnimatedLoadingButton
        ref={loadingButton => this.loadingButton = loadingButton}
        width={320}
        height={60}
        title="Login"
        onPress={this.handleLoadingButtonPress}
      />
  }
}
```

## Features

- [X] Animate to Loading State and vice versa. 
- [X] Support Title.
- [ ] Support Icon Left.
- [ ] Support Icon Right.
- [ ] Support Disabled button.
- [X] Support Raised button.
- [X] Supports Accessibility.

## License

React Native Animated Loading Button is available under the MIT license. [See LICENSE](https://github.com/philip-bui/react-native-animated-loading-button/blob/master/LICENSE) for details.
