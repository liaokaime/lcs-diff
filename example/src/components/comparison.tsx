/**
 * Compare page
 * Create by liaokai on 2020-01-02 20:03:30
 */
import React, {Component} from 'react';
import {ComparisonInputs} from "./comparison.inputs";
import {SeparateWordsModule} from "../separate-words/separate.words.module";
import {IComparison,LCS} from "lcs-diff/dist";

interface IProps {

}

interface IState {
    firstTexts : string[],
    secendTexts : string[],
    compareList : IComparison<string | undefined>[],
    articelA : string,
    articelB : string,
    similarity : number
}

export class Comparison extends Component<IProps,IState>{
    //state初始化
    readonly state : IState = {
        firstTexts : [],
        secendTexts : [],
        compareList : [],
        articelA : "",
        articelB : "",
        similarity : -1
    };

    constructor(props: IProps){
        super(props);
    }
    render() {
        let {} = this.props;
        let {firstTexts,secendTexts,compareList,articelA,articelB,similarity} = this.state;
        let articelA_Ary = new SeparateWordsModule(articelA).toWords();
        let articelB_Ary = new SeparateWordsModule(articelB).toWords();
        return (
            <div style={{display:"flex",flexDirection:"column"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex:1,display: "flex",flexDirection: "column"}}>
                        <div style={{flexDirection: "row",justifyContent: "start",alignItems: "start"}}>
                            ListA
                            <ComparisonInputs onChange={texts => this.setState({firstTexts : texts})}/>
                            <div>
                                Inputs：{JSON.stringify(firstTexts)}
                            </div>
                        </div>
                        <div style={{marginTop: 20}}>
                            ListB
                            <ComparisonInputs onChange={texts => this.setState({secendTexts : texts})}/>
                            <div>
                                Inputs：{JSON.stringify(secendTexts)}
                            </div>
                        </div>
                        <div style={{backgroundColor:"rgb(100,140,240)",textAlign: "center"}} onClick={()=>{
                            let lcs = new LCS({
                                content : {
                                    listA : firstTexts,
                                    listB : secendTexts,
                                },
                                compare : (t1,t2)=>{
                                    return t1 === t2
                                }
                            });

                            let compareList = lcs.getDiff();
                            let similarity = lcs.getSimilarity();

                            this.setState(
                                {compareList : compareList,similarity : similarity}
                            );
                        }}>
                            Comparison
                        </div>
                    </div>
                    <div style={{flex : 1,display:"flex",flexDirection: "column"}}>
                        <textarea value={articelA} style={{width: '100%',height:150}}  placeholder={"Please enter the article A"} onChange={value => {
                            this.setState({articelA : value.target.value},);
                        }}/>
                        <div style={{width:"100%",wordBreak:"break-all"}}>
                            Inputs：{JSON.stringify(articelA_Ary)}
                        </div>
                        <textarea value={articelB} style={{width: '100%',height:150}}  placeholder={"Please enter the article B"} onChange={value => {
                            this.setState({articelB : value.target.value},);
                        }}/>
                        <div style={{width:"100%",wordBreak:"break-all"}}>
                            Inputs：{JSON.stringify(articelB_Ary)}
                        </div>
                        <div style={{backgroundColor:"rgb(100,140,240)",textAlign: "center"}} onClick={()=>{
                            let lcs =new LCS({
                                content : {
                                    listA : articelA_Ary,
                                    listB : articelB_Ary,
                                },
                                compare : (t1,t2)=>{
                                    return t1 === t2
                                }
                            });

                            let compareList = lcs.getDiff();
                            let similarity = lcs.getSimilarity();
                            this.setState(
                                {compareList : compareList,similarity:similarity}
                            );
                        }}>
                            Comparison
                        </div>
                    </div>
                </div>
                <div style={{display:"flex",flexDirection : "row",flexWrap: "wrap",width: "100%"}}>
                    {
                        compareList.map((value,index) => <div key={index} style={{display: "flex", flexDirection: "column", justifyContent : "space-between",margin: 10,backgroundColor:"#bbb"}}>
                            <div>
                                {value.unitA
                                    ?
                                    <div>{value.unitA ?? " "}</div>
                                    :
                                    <div style={{color: "gray"}}>null</div>
                                }
                            </div>
                            <div>
                                {value.unitB
                                    ?
                                    <div>{value.unitB ?? " "}</div>
                                    :
                                    <div style={{color: "gray"}}>null</div>
                                }
                            </div>
                            <div style={{color : value.equals ? "green" : "red"}}>{value.equals ? "same" : "different"}</div>
                        </div>)
                    }
                </div>
                {
                    similarity > -1 ? <h3>Similarity：{similarity*100}%</h3> : undefined
                }
            </div>
        );
    }
}