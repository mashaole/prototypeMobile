import React from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Animated,
} from 'react-native';
import { url, theme } from '../../app.component';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { FloatingAction } from 'react-native-floating-action';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Icon } from '@expo/vector-icons/Ionicons';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import DialogInput from 'react-native-dialog-input';

export const name = 'Iotnxt';

interface GatewayProps {
  update: Function;
  action: (action: object) => void;
}

// tslint:disable-next-line: no-empty-interface
interface GatewayState {}

class Iotnxt extends React.Component<
  GatewayProps,
  GatewayState,
  NavigationScreenProps
> {
  constructor(props: Readonly<GatewayProps>) {
    super(props);
  }

  state = {
    TextInputDisableStatus: false,
    data: '',
    addGatewayForm: {
      GatewayId: 'gateway',
      Secret: this.generateDifficult(16),
      HostAddress: 'greenqueue.prod.iotnxt.io',
      PublicKey:
        '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
    },
    loading: true,
    gatewayList: [],
    spinner: false,
    error: '',
    isDialogVisible: false,
    title: '',
    message: '',
  };

  presets = {
    dev: {
      HostAddress: 'greenqueue.dev.iotnxt.io',
      PublicKey:
        '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>qblcqOI90QOdJk9pegGE+LDfXgMveZGpDBPpyIsSl8+Zkcp5zWxYj3k6BoWoL3U2z7l3wan6U9IhtAqaeTFatdwBOx0vOK8DWr4RIp1n6nAO7jEaHgsA1+FmFZTc8hQw6OEXVi+b31b7EFwLau0UA4TCj5862akf21ZqxaXmQUyyQA9Nl4JggY+TZDFL+hj+JdIm0V/yzq6o90E57s/70WYoDT6fZ5nDfdAgom/ZwjeUGTUh8V5HYJWuTZ33rRbKa8zYQ/HzAf5FZAVhndGI+CJFvorG8p53wXn2LP7NPhX6chCa++DVbFdru3OCLYMzdBqpohoVwHZnGGX1SGVi0Q==</Modulus></RSAKeyValue>',
    },
    qa: {
      HostAddress: 'greenq.qa2.iotnxt.io',
      PublicKey:
        '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>w6GwwIJImw87wUxg7JUtOiolWVyDTzPsT6ANvvFW00JkKTOHVTI2gMguogO/aH9SAjHVm35N1M9RO5W9CAnqbCVoL0i3gM3K7Z5DZeI0jFx/8ho1iMtcrCfEdCBv32eN+/Yuao15NtTbQubqmMa4D4URXbuzeZvDPG4DwsVur263kk3uoSASyoqIKbVFbIulmViZFtXOTWrjgSAvCjULOPYXllZUDZTCq3Q9BuoHFCQXA+5ZAsm0PHKBKEZ/G852Fcy602PUcUpdvEJdiiQ80M3f+BhgZiJG2mDg0fySnVznQIb1tJ8ISOTqcPuzep4TYrm04p2wH8uR82bhVzNFFQ==</Modulus></RSAKeyValue>',
    },
    prod: {
      HostAddress: 'greenqueue.prod.iotnxt.io',
      PublicKey:
        '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
    },
  };

  componentWillMount() {
    this.getGateways();
  }

  async componentDidMount() {
    this.setState({
      spinner: !this.state.spinner,
    });
  }

  preset = async (name: string) => {
    if (name === 'dev') {
      this.setState({
        title: 'Developoment Environment',
        isDialogVisible: !this.state.isDialogVisible,
      });
    } else if (name === 'qa') {
      this.setState({
        title: 'Quality Assurance',
        isDialogVisible: !this.state.isDialogVisible,
      });
    } else if (name === 'prod') {
      this.setState({
        title: 'Production Environment',
        isDialogVisible: !this.state.isDialogVisible,
      });
    } else { return null; }
  }

  getGateways = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const gateways = await fetch(url + '/api/v3/iotnxt/gateways', {
        method: 'GET',
        headers: {
          Authorization: user.auth,
          'Content-Type': 'application/json',
        },
      });
      const data = await gateways.json();
      this.setState({ gatewayList: data, loading: false });
    } catch (err) {
      this.setState({ gatewayList: err, loading: false, error: err });
      // tslint:disable-next-line: no-console
      console.log('Error fetching data:', err);
    }
  };

  addGateways = async (name: any) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const gateways = await fetch(url + '/api/v3/iotnxt/addgateway', {
        method: 'POST',
        headers: {
          Authorization: user.auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          GatewayId: name,
          HostAddress: this.state.addGatewayForm.HostAddress,
          PublicKey: this.state.addGatewayForm.PublicKey,
          Secret: this.state.addGatewayForm.Secret,
        }),
      });
      const response = await gateways.json();
      this.setState({
        isDialogVisible: !this.state.isDialogVisible,
      });
      this.getGateways();
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log('Error adding gateway:', err);
    }
  };

  renderItem(data: React.ReactNode) {
    return (
      <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
        <View>
          <Text>{data}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  generateDifficult(count: number) {
    const _sym =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';
    for (let i = 0; i < count; i++) {
      const tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
      str += '' + tmp;
    }
    return str;
  }

  // tslint:disable-next-line: no-shadowed-variable
  changeInput = (name: string) => {
    return (evt: { target: { value: any } }) => {
      const addGatewayForm = { ...this.state.addGatewayForm };
      addGatewayForm[name] = evt.target.value;
      this.setState({ addGatewayForm });
    };
  };

  // tslint:disable-next-line: no-shadowed-variable
  choosePreset = (name: string | number) => {
    return (evt: any) => {
      const addGatewayForm = { ...this.state.addGatewayForm };
      addGatewayForm.HostAddress = this.presets[name].HostAddress;
      addGatewayForm.PublicKey = this.presets[name].PublicKey;
      this.setState({ addGatewayForm });
    };
  };

  render() {
    const connecting = (
      <Ionicons name='md-checkmark-circle' size={32} color='yellow' />
    );
    const connected = (
      <Ionicons name='md-checkmark-circle' size={32} color='green' />
    );
    const failed = (
      <Ionicons name='md-checkmark-circle' size={32} color='red' />
    );

    const { gatewayList, loading } = this.state;
    const env = [
      {
        text: 'PROD',
        name: 'prod',
        position: 1,
      },
      {
        text: 'DEV',
        name: 'dev',
        position: 2,
      },
      {
        text: 'QA',
        name: 'qa',
        position: 3,
      },
    ];

    if (loading) {
      return (
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching Gateways...'}
          textStyle={styles.spinnerTextStyle}
        />
      );
    } else if (!loading) {
      return (
        <View
          style={{
            backgroundColor: theme.backgroundColor2,
            width: '100%',
            height: '100%',
          }}
        >
          <ScrollView style={{ backgroundColor: theme.backgroundColor2 }}>
            {gatewayList.map((item, key) => (
              <TouchableHighlight
                style={{
                  height: 50,
                  borderColor: '#6c757d',
                  borderBottomWidth: 1,
                }}
                key={key}
              >
                <View
                  style={{
                    width: '100%',
                    marginLeft: 10,
                    flexDirection: 'row',
                    marginTop: -2,
                  }}
                >
                  <Text>{item.connected ? connected : 'connected'}</Text>
                  <Text
                    style={{
                      width: '70%',
                      color: theme.color,
                      marginLeft: 10,
                      marginTop: 15,
                    }}
                  >
                    {item.GatewayId}
                  </Text>
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
          <FloatingAction
            actions={env}
            color='maroon'
            // tslint:disable-next-line: no-shadowed-variable
            onPressItem={name => {
            this.preset(name);
            }}
          />
        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          title={this.state.title}
          message={'Enter Gateway name'}
          hintInput={'Gateway'}
          submitInput={(inputText: any) => {
            this.addGateways(inputText);
          }}
          closeDialog={() => {
            this.setState({
              isDialogVisible: !this.state.isDialogVisible,
            });
          }}
        ></DialogInput>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            marginLeft: 'auto',
            flexDirection: 'row',
            marginTop: 'auto',
            backgroundColor: theme.backgroundColor2,
          }}
        >
          <Text
            style={{
              width: '70%',
              height: '100%',
              color: theme.color,
              marginLeft: 'auto',
              marginTop: 'auto',
            }}
          >
            No Gateways to dispay
          </Text>
        </View>
      );
    }
  }
  // return (
  //     <List  containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
  //     <FlatList
  //         data={this.state.gatewayList}
  //         renderItem={({ item }) => (
  //         <ListItem
  //             // roundAvatar
  //             title={`${item.gatewayList.GatewayId}`}
  //             subtitle={item.gatewayList.HostAddress}
  //             // avatar={{ uri: item.picture.thumbnail }}
  //         containerStyle={{ borderBottomWidth: 0 }}
  //         />
  //         )}
  //         keyExtractor={item => item.email}
  //     />
  //     </List>;
  // )

  // return (
  // <View>
  //         <Text>ADD GATEWAY</Text> */}
  //          <Text>{this.state.data}</Text>
  //         <View>
  //             <TextInput
  //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
  //                 placeholder='Gateway ID'
  //                 onChangeText={() => this.changeInput('GatewayId')}
  //                 value={this.state.addGatewayForm.GatewayId}
  //             />

  //             <TextInput
  //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
  //                 placeholder='Secret'
  //                 onChangeText={() => this.changeInput('Secret')}
  //                 value={this.state.addGatewayForm.Secret}
  //                 editable={this.state.TextInputDisableStatus}
  //             />

  //             <TextInput
  //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
  //                 placeholder='Public key'
  //             // onChangeText={(text) => this.setState({text})}
  //                 value={this.state.addGatewayForm.PublicKey}
  //                 editable={this.state.TextInputDisableStatus}
  //             />

  //             <Button title='Prod'
  //                 onPress={() => this.choosePreset('prod')}
  //             />
  //             <Button title='Dev'
  //                 onPress={() => this.choosePreset('dev')}
  //             />
  //             <Button title='QA'
  //                 onPress={() => this.choosePreset('qa')}
  //             />

  //             {/* <Button title='Add'
  //                 onPress={() => this.loadServerGateways()}
  //             /> */} */}

  //         </View>
  //     </View>
  // );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Iotnxt;
