//位置槽
interface ISlot {
    content : string,
    classify : string
}

//位置槽集束
interface ICluster {
    classify : string,
    cluster : ISlot[]
}

//字符类别
interface IClassify {
    [key : string] : {
        content : string[],
        verify : (char:string)=>boolean
    }
}

export class SeparateWordsModule {
    static readonly conjunction = ["'", "-","`","’"];   //连词
    static readonly enter = ["\n", "\r", "\r\n"];   //回车
    static readonly space = [" ","　"," "];             //空格
    //文章
    private articel = "";
    //位置槽数组
    private slots: ISlot[] = [];
    //位置槽集束
    private slotClusters : ICluster[] = [];

    //构造器
    constructor(articel: string) {
        this.articel = articel;
    }

    //内置字符类别
    static readonly builtInClassify : IClassify = {
        //大写字母
        upperLetters : {
            content : SeparateWordsModule.getRangeChar(65, 90),
            verify : (char: string) => {
                let unicode : number = char.charCodeAt(0);
                return  unicode >= 65 && unicode <= 90
            }
        },
        //小写字母
        lowerLetters : {
            content : SeparateWordsModule.getRangeChar(97, 122),
            verify : (char: string) => {
                let unicode : number = char.charCodeAt(0);
                return  unicode >= 97 && unicode <= 122
            }
        },
        //英文连词
        conjunction : {
            content : SeparateWordsModule.conjunction,
            verify : (char:string) => {
                return SeparateWordsModule.conjunction.indexOf(char) >= 0
            }
        },
        //回车
        enter : {
            content : SeparateWordsModule.enter,
            verify : (char:string) => {
                return SeparateWordsModule.enter.indexOf(char) >= 0
            }
        },
        //空格
        blank : {
            content : SeparateWordsModule.space,
            verify : (char : string) => {
                return SeparateWordsModule.space.indexOf(char) >= 0

            }
        },
        //默认
        defaultAll : {
            content : [],
            verify : char => true
        }
    };

    //字符类别定义
    public static readonly classifys : IClassify = {
        //英文
        english : {
            content : SeparateWordsModule.builtInClassify.lowerLetters.content
                .concat(SeparateWordsModule.builtInClassify.upperLetters.content)
                .concat(SeparateWordsModule.builtInClassify.conjunction.content),
            verify : char => {
                return  SeparateWordsModule.builtInClassify.lowerLetters.verify(char)
                || SeparateWordsModule.builtInClassify.upperLetters.verify(char)
                || SeparateWordsModule.builtInClassify.conjunction.verify(char)
            }
        },
        //回车
        enter : SeparateWordsModule.builtInClassify.enter,
        //空格
        blank : SeparateWordsModule.builtInClassify.blank,
        //默认
        defaultAll : SeparateWordsModule.builtInClassify.defaultAll
    };

    //获取范围ACSII码转字符串数组
    static getRangeChar(min: number, max: number) {
        let mi = Math.min(min, max);
        let mx = Math.max(min, max);
        let charAry: string[] = [];
        for (let a = mi; a < mx; a++) {
            charAry.push(String.fromCharCode(a));
        }
        return charAry;
    }

    //字符串转字符槽数组
    private toSlot(text: string) : ISlot[] {
        return text.split("").map(value => {
            let classKeys = Object.keys(SeparateWordsModule.classifys);
            for (let i = 0; i < classKeys.length; i++) {
                let keyName = classKeys[i];
                if (SeparateWordsModule.classifys[keyName].verify(value)) {
                    return {
                        content: value,
                        classify: keyName
                    }
                }
            }
            return {
                content : value,
                classify: "default"
            }
        });
    }

    //字符槽数组转集束
    private toClusters(slots : ISlot[]) : ICluster[] {
        let newCluster = ()=>({
            classify : "",
            cluster : []
        });
        let resCluster : ICluster[] = [];
        let cluster : ICluster = newCluster();
        for(let i =0;i<slots.length;i++){
            let slotItem = slots[i];
            if(slotItem.classify === cluster.classify){
                cluster.cluster.push(slotItem);
            }else{
                resCluster.push(cluster);
                cluster = newCluster();
                cluster.classify = slotItem.classify;
                cluster.cluster.push(slotItem);
            }
        }
        resCluster.push(cluster);
        return resCluster;
    }

    //删除集束中的空格与空字符串
    private delBlank(cluster : ICluster[]){
        return this.slotClusters.filter(value => {
            return value.classify !== "blank" && value.classify !== ""
        })
    }

    //合并多个回车为单个
    private mergeEnter(cluster : ICluster[]){
        cluster.forEach(value => {
            if(value.classify === "enter") {
                value.cluster = value.cluster.filter((value1, index) => index === 0)
            }
        });
        return cluster;
    }

    //回车转为标准回车("\r" "\n" "\r\n" 转为 "\r\n")
    private enter2Standard(cluster : ICluster[]){
        cluster.forEach(value => {
            if(value.classify === "enter") {
                value.cluster.forEach(value1 => value1.content = "\r\n")
            }
        });
        return cluster;
    }

    //源文章处理
    private exe(){
        this.slots = this.toSlot(this.articel);                         //文章转位置槽
        this.slotClusters = this.toClusters(this.slots);                //位置槽转集束槽
        this.slotClusters = this.delBlank(this.slotClusters);           //删除space和空白字符串
        this.slotClusters = this.mergeEnter(this.slotClusters);         //合并回车为单个
        this.slotClusters = this.enter2Standard(this.slotClusters)      //标准化回车为\r\n
    }

    //导出结果
    toWords(): string[] {
        this.exe();
        return  this.slotClusters.map(value => {
            return value.cluster.map(value1 => value1.content).join("")
        })
    }
}

