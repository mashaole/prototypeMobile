import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { url } from '../../../../app.component';

export class DataView extends Component {

    state: {
        data: any;
        open: string;
        arrow: any;
        arrow2: any;
        preview: string;
        meta: string;
    };

    UNSAFE_componentWillMount() {
        this.setState({ open: 'none' });
        this.setState({ preview: 'flex' });
        this.setState({ meta: 'none' });
        this.setState({ arrow: 'caretright' });
        this.setState({ arrow2: 'caretright' });
    }

    open = (kind: string) => {
        if (kind === 'data') {
            if (this.state.open === 'none') {
                this.setState({ open: 'flex' });
                this.setState({ preview: 'none' });
                this.setState({ arrow: 'caretdown' });
            } else {
                this.setState({ open: 'none' });
                this.setState({ preview: 'flex' });
                this.setState({ arrow: 'caretright' });
            }
        } else {
            if (this.state.meta === 'none') {
                this.setState({ meta: 'flex' });
                this.setState({ arrow2: 'caretdown' });
            } else {
                this.setState({ meta: 'none' });
                this.setState({ arrow2: 'caretright' });
            }
        }
    }

    formatting(data: string | RegExp, str: { replace: (arg0: RegExp, arg1: string) => void; }) {
     data  = JSON.stringify(this.props.data.data);
        const reg = new RegExp(data);
        return str.replace(reg, '');
      }

    preview = () => {
        if (this.state.preview === 'flex') {
            return (<Text style={{ display: 'none', fontSize: 12, width: 10, opacity: 0.3 }}>
                {JSON.stringify(this.props.data.data).substr(0, 22) + '.....(Click here to expand)'}
            </Text>);
        } else {
            return null;
        }
    }
    private _renderData = (data: React.ReactNode, level: number, path: any) => {
        if (data == null) { }
        if (typeof data === 'string') {
            return <View><Text style={{ color: '#ccc', textAlign: 'right', marginRight: 5 }}>{data}</Text></View>;
        }
        if (typeof data === 'number') {
            return <View><Text style={{ color: '#15e47a', textAlign: 'right', marginRight: 5 }}>{data}</Text></View>;
        }
        if (typeof data === 'boolean') {
            if (data === true) {
                return <View style={{}}>
                    <Text style={{ color: '#e4c315', textAlign: 'right', marginRight: 5 }}>
                {data.toString()}
                </Text>
                </View>;
            } else {
                return <View>
                    <Text style={{ color: '#15b9e4', textAlign: 'right', marginRight: 5 }}>
                    {data.toString()}
                    </Text>
                    </View>;
            }
        }
        if (typeof data === 'object') {
            if (data == null) {
                return <View><Text style={{ color: '#f77f77' }}>null</Text></View>;
            }
            if (Array.isArray(data)) {
                return <View>{this.renderObject(data, level + 1, path)}</View>;
            } else {
                if (Object.keys(data).length > 1) {
                    return <View>{this.renderObject(data, level + 1, path)}</View>;
                } else {
                    return <View>{this.renderObject(data, level + 1, path)}</View>;
                }
            }
        }
    };
    public get renderData() {
        return this._renderData;
    }
    public set renderData(value) {
        this._renderData = value;
    }

    renderObject = (data: { [x: string]: any; }, level: any, path: string) => {
        return (
            <View style={{ backgroundColor: 'rgba(212, 211, 211,0.09)' }}>
                {Object.keys(data).map((name, i) => {

                    if (typeof data[name] == 'object') {
                        if (name == 'data') {
                            return (
                                <TouchableHighlight onPress={() => { this.open('data'); }} key={i}>
                                    <View style={{ marginLeft: 24, marginBottom: 10 }} >
                                        <View>
                                            <Text style={{ color: 'red', fontSize: 20, flexDirection: 'column' }}>
                                                {/* <AntDesign name={this.state.arrow} size={10} color="white" />   */}
                                                {name}:{this.preview()}
                                                </Text>
                                                </View>
                                        <View style={{ display: this.state.open }}>
                                        {this.renderData(data[name], level, path + '.' + name)}
                                        </View>
                                    </View>
                                    </TouchableHighlight>
                                    );
                        }
                        // else {
                        //     return (
                        //         <TouchableHighlight onPress={() => { this.open("meta") }} key={i}>
                        //             <View style={{ marginLeft: 24, marginBottom: 10 }} >
                        //                 <View>
                        //                     <Text style={{ color: "white", fontSize: 20, flexDirection: "row" }}><AntDesign name={this.state.arrow2} size={20} color="white" />  {name}:</Text></View>
                        //                 <View style={{ display: this.state.meta }}>{this.renderData(data[name], level, path + "." + name)}</View>
                        //             </View></TouchableHighlight>)
                        // }
                    } else {
                        return (
                            <View style={{ marginLeft: 12 }} key={i}  >
                                <Text style={{ color: 'white' }}>{name}:</Text>
                                <View >{this.renderData(data[name], level, path + '.' + name)}</View>
                            </View>);
                    }
                })}
            </View >
        );
    }

    render() {
        // if (url === 'https://8bo.org') {
        //     delete (this.props.data.username);
        //     delete (this.props.data._id);
        //     delete (this.props.data._recieved);
        //     delete (this.props.data.apikey);
        //     delete (this.props.data.userpublickey);
        //     delete (this.props.data._id);
        // }

        if (this.props.data) {
            if (this.props.data.payload) {
                return (
                    <View>
                        {this.renderObject(this.props.data.payload, 0, 'root')}
                    </View>
                );
            } else {
                return (
                    <View>
                        {this.renderObject(this.props.data, 0, 'root')}
                    </View>
                );
            }
        } else {
            return (<Text>loading..</Text >);
        }
    }
}
