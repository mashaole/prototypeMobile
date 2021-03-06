import React from 'react';
import {
  View,
  ViewProps,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten';
import { CheckBox } from 'react-native-ui-kitten';
import {
  textStyle,
  ValidationInput,
} from '../../../../src/components/common';
import {
  EmailIconFill,
  EyeOffIconFill,
  PersonIconFill,
} from '../../../../src/assets/icons';
import {
  EmailValidator,
  NameValidator,
  PasswordValidator,
} from '../../../../src/core/validators';
import { SignUpFormData } from './type';

interface ComponentProps {
  /**
   * Will emit changes depending on validation:
   * Will be called with form value if it is valid, otherwise will be called with undefined
   */
  onDataChange: (value: SignUpFormData | undefined) => void;
}

export type SignUpFormProps = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  termsAccepted: boolean;
}

class SignUpFormComponent extends React.Component<SignUpFormProps, State> {

  public state: State = {
    username: undefined,
    email: undefined,
    password: undefined,
    termsAccepted: false,
  };

  public componentDidUpdate(prevProps: SignUpFormProps, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);

    const isStateChanged: boolean = this.state !== prevState;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      this.props.onDataChange(this.state);
    } else if (becomeInvalid) {
      this.props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      this.props.onDataChange(this.state);
    }
  }

  private onTermsValueChange = (termsAccepted: boolean) => {
    this.setState({ termsAccepted });
  };

  private onUsernameInputTextChange = (username: string) => {
    this.setState({ username });
  };

  private onEmailInputTextChange = (email: string) => {
    this.setState({ email });
  };

  private onPasswordInputValidationResult = (password: string) => {
    this.setState({ password });
  };

  private isValid = (value: SignUpFormData): boolean => {
    const { username, password, email, termsAccepted } = value;

    return username !== undefined
      && password !== undefined
      && email !== undefined
      && termsAccepted;
  };

  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}>
        <View style={themedStyle.formContainer}>
          <ValidationInput
            style={themedStyle.usernameInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            placeholder='User Name'
            icon={PersonIconFill}
            validator={NameValidator}
            onChangeText={this.onUsernameInputTextChange}
          />
          <ValidationInput
            style={themedStyle.emailInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            placeholder='Email'
            icon={EmailIconFill}
            validator={EmailValidator}
            onChangeText={this.onEmailInputTextChange}
          />
          <ValidationInput
            style={themedStyle.passwordInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            secureTextEntry={true}
            placeholder='Password'
            icon={EyeOffIconFill}
            validator={PasswordValidator}
            onChangeText={this.onPasswordInputValidationResult}
          />
          <CheckBox
            style={themedStyle.termsCheckBox}
            textStyle={themedStyle.termsCheckBoxText}
            checked={this.state.termsAccepted}
            onChange={this.onTermsValueChange}
            text='I read and agree to Terms & Conditions'
          />
        </View>
      </View>
    );
  }
}

export const SignUpForm = withStyles(SignUpFormComponent, (theme: ThemeType) => ({
  container: {},
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  usernameInput: {
    backgroundColor: "#262626"
  },
  emailInput: {
    marginTop: 16,
    backgroundColor: "#262626"
  },
  passwordInput: {
    marginTop: 16,
    backgroundColor: "#262626"
  },
  termsCheckBox: {
    marginTop: 24,
  },
  termsCheckBoxText: {
    color: theme['text-hint-color'],
    ...textStyle.subtitle,
  },
}));
