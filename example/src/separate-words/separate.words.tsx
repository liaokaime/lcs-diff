/**
 *
 * Create by liaokai on 2019-12-06 16:26:21
 */
import React, {Component} from 'react';
import {SeparateWordsModule} from "./separate.words.module";

interface IProps {

}

interface IState {
    articel : string,
    showText : string[],
}

export class SeparateWords extends Component<IProps,IState>{
    //state初始化
    readonly state : IState = {
        articel : "",
        showText : [],
    };

    constructor(props: IProps){
        super(props);
    }
    render() {
        let {} = this.props;
        let {articel,showText} = this.state;
        return (
            <div style={{flexDirection : "column"}}>
                <textarea value={articel} style={{width: '100%',height:200}}  placeholder={"请输入文章"} onChange={value => {
                    this.setState({articel : value.target.value},);
                }}/>
                <div style={{backgroundColor:"rgb(100,140,240)",textAlign: "center"}} onClick={()=>{
                    this.setState({showText: new SeparateWordsModule(articel).toWords()})
                }}>
                    分词
                </div>
                <textarea value={JSON.stringify(showText)} style={{width: '100%',height: "50vh", wordBreak: "break-all"}}/>
            </div>
        );
    }
}