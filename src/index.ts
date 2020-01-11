/**
 * LCS
 * Create by liaokai on 2019-12-31 17:02:00
 */

//对比内容
interface IContent<T> {
    listA: T[]                //A列表
    listB: T[]                //B列表
}

//关系节点
interface IRelation {
    indexA: number            //A下标
    indexB: number            //B下标
}

//差异节点
export interface IComparison<T> {
    unitA: T | undefined,          //A对比单位
    unitB: T | undefined,          //B对比单位
    equals: boolean           //是否一致
}

interface IParam<T>{
    content : IContent<T>,                  //对比内容
    compare : (t1:T,t2:T) => boolean        //对比方法
}

export class LCS<T> {
    private readonly params: IParam<NonNullable<T>>;

    constructor(params : IParam<NonNullable<T>>) {
        this.params = params;
    }

    //获取矩阵
    private getMatrix(): number[][] | undefined {
        let {content, compare} = this.params;
        //排除列表 A或B 为空
        if (!content?.listA?.length || !content?.listB?.length)
            return undefined;
        let lenA = content.listA.length;    //A列表长度
        let lenB = content.listB.length;    //B列表长度
        let matrix: number[][] = [];
        for (let i = 0; i < lenA; i++) {
            matrix[i] = []
        }
        for (let i = 0; i < lenA; i++) {
            for (let j = 0; j < lenB; j++) {
                if (compare(content.listA[i], content.listB[j])) {
                    let left_top = matrix[i - 1]?.[j - 1] ?? 0;
                    matrix[i][j] = left_top + 1;
                } else {
                    let top = matrix[i - 1]?.[j] ?? 0;
                    let left = matrix[i]?.[j - 1] ?? 0;
                    matrix[i][j] = Math.max(top, left);
                }
            }
        }
        return matrix;
    }

    //获取关系
    private getReleations(): IRelation[] {
        let {content} = this.params;
        let matrix = this.getMatrix();
        if (!matrix)
            return [];
        let indexA = content.listA.length - 1;
        let indexB = content.listB.length - 1;
        let indexNum = matrix[indexA][indexB];
        let relations: IRelation[] = [];
        let finding = true;
        while (finding) {
            for (let i = indexA; i >= 0; i--) {
                if (matrix[i - 1]?.[indexB] !== indexNum) {
                    for (let j = indexB; j >= 0; j--) {
                        if (matrix[i]?.[j - 1] !== indexNum) {
                            if (matrix[i]?.[j]) {
                                relations.unshift({indexA: i, indexB: j});
                            }
                            indexA = i - 1;
                            indexB = j - 1;
                            indexNum = matrix[indexA]?.[indexB];
                            if (!indexNum)
                                finding = false;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        return relations;
    }

    //获取异同
    private _getDiff():IComparison<T>[]{
        let listFir = this.params.content.listA;
        let listSec = this.params.content.listB;
        let relations = this.getReleations();
        let result : IComparison<T>[] = [];
        let fir = {
            index : -1,
            stagnate : false,
        };
        let sec = {
            index : -1,
            stagnate : false,
        };
        let relation = relations.shift();
        while(true){
            let nextFirIndex = fir.index + 1;
            let nextSecIndex = sec.index + 1;
            let exeRelation = relation ?? {
                indexA : listFir.length,
                indexB : listSec.length
            };
            if(nextFirIndex <= exeRelation.indexA){
                fir.index ++;
            }
            if(nextFirIndex >= exeRelation.indexA){
                fir.stagnate = true;
            }
            if(nextSecIndex <= exeRelation.indexB){
                sec.index ++;
            }
            if(nextSecIndex >= exeRelation.indexB){
                sec.stagnate = true;
            }

            if(fir.stagnate && sec.stagnate){
                if(relation){
                    result.push({
                        unitA : listFir[fir.index],
                        unitB : listSec[sec.index],
                        equals : true
                    });
                    fir.stagnate = false;
                    sec.stagnate = false;
                    relation = relations.shift()
                }else{
                    return result;
                }
            }else{
                result.push({
                    unitA : fir.stagnate ? undefined : listFir[fir.index],
                    unitB : sec.stagnate ? undefined : listSec[sec.index],
                    equals : false
                })
            }
        }
    }

    private checkParams() : boolean{
        let listFir = this.params.content.listA;
        let listSec = this.params.content.listB;
        return listFir.constructor === Array && listSec.constructor === Array;
    }

    public getDiff():IComparison<T>[]{
        if(this.checkParams()){
            return this._getDiff();
        }else{
            return []
        }
    }

    //获取相似度
    public getSimilarity():number{
        let equal = 0;
        let diffrents = this.getDiff();
        diffrents.forEach(value => {
            if (value.equals){
                equal ++;
            }
        });
        let similarity = equal / diffrents.length;
        return similarity > 0 ? similarity : 0;
    }
}
