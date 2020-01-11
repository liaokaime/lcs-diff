/**
 * LCS
 * Create by liaokai on 2019-12-31 17:02:00
 */
interface IContent<T> {
    listA: T[];
    listB: T[];
}
export interface IComparison<T> {
    unitA: T | undefined;
    unitB: T | undefined;
    equals: boolean;
}
interface IParam<T> {
    content: IContent<T>;
    compare: (t1: T, t2: T) => boolean;
}
export declare class LCS<T> {
    private readonly params;
    constructor(params: IParam<NonNullable<T>>);
    private getMatrix;
    private getReleations;
    private _getDiff;
    private checkParams;
    getDiff(): IComparison<T>[];
    getSimilarity(): number;
}
export {};
