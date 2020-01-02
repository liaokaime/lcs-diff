/**
 * Infinite input box
 * Create by liaokai on 2020-01-02 20:02:33
 */
import React, {Component} from 'react';

interface IProps{
    onChange : (texts : string[]) =>void
}

interface IState{
    texts : string[]
}

export class ComparisonInputs extends Component<IProps,IState>{
    //state初始化
    readonly state : IState = {
        texts : [""]
    };

    render() {
        let {onChange} = this.props;
        let {texts} = this.state;
        return (
            <div>
                {
                    texts.map((value, index, array) => {
                        return ((value,index,array,isLast)=>{
                            return <input type="text" key={index} value={array[index]} onChange={event => {
                                let texts : string[] = [...this.state.texts];
                                let afterText = event.target.value;
                                if(afterText && isLast){
                                    texts.push("");
                                }
                                texts[index] = afterText;
                                this.setState({texts : texts},()=>{
                                    onChange(this.state.texts.filter(value1 => value1 !== ""))
                                });
                            }}/>
                        })(value,index,array,index === array.length -1);
                    })
                }
            </div>
        );
    }
}