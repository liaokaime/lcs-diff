"use strict";
/**
 * LCS
 * Create by liaokai on 2019-12-31 17:02:00
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LCS = /** @class */ (function () {
    function LCS(params) {
        this.params = params;
    }
    //获取矩阵
    LCS.prototype.getMatrix = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var _l = this.params, content = _l.content, compare = _l.compare;
        //排除列表 A或B 为空
        if (!((_b = (_a = content) === null || _a === void 0 ? void 0 : _a.listA) === null || _b === void 0 ? void 0 : _b.length) || !((_d = (_c = content) === null || _c === void 0 ? void 0 : _c.listB) === null || _d === void 0 ? void 0 : _d.length))
            return undefined;
        var lenA = content.listA.length; //A列表长度
        var lenB = content.listB.length; //B列表长度
        var matrix = [];
        for (var i = 0; i < lenA; i++) {
            matrix[i] = [];
        }
        for (var i = 0; i < lenA; i++) {
            for (var j = 0; j < lenB; j++) {
                if (compare(content.listA[i], content.listB[j])) {
                    var left_top = (_f = (_e = matrix[i - 1]) === null || _e === void 0 ? void 0 : _e[j - 1], (_f !== null && _f !== void 0 ? _f : 0));
                    matrix[i][j] = left_top + 1;
                }
                else {
                    var top_1 = (_h = (_g = matrix[i - 1]) === null || _g === void 0 ? void 0 : _g[j], (_h !== null && _h !== void 0 ? _h : 0));
                    var left = (_k = (_j = matrix[i]) === null || _j === void 0 ? void 0 : _j[j - 1], (_k !== null && _k !== void 0 ? _k : 0));
                    matrix[i][j] = Math.max(top_1, left);
                }
            }
        }
        return matrix;
    };
    //获取关系
    LCS.prototype.getReleations = function () {
        var _a, _b, _c, _d;
        var content = this.params.content;
        var matrix = this.getMatrix();
        if (!matrix)
            return [];
        var indexA = content.listA.length - 1;
        var indexB = content.listB.length - 1;
        var indexNum = matrix[indexA][indexB];
        var relations = [];
        var finding = true;
        while (finding) {
            for (var i = indexA; i >= 0; i--) {
                if (((_a = matrix[i - 1]) === null || _a === void 0 ? void 0 : _a[indexB]) !== indexNum) {
                    for (var j = indexB; j >= 0; j--) {
                        if (((_b = matrix[i]) === null || _b === void 0 ? void 0 : _b[j - 1]) !== indexNum) {
                            if ((_c = matrix[i]) === null || _c === void 0 ? void 0 : _c[j]) {
                                relations.unshift({ indexA: i, indexB: j });
                            }
                            indexA = i - 1;
                            indexB = j - 1;
                            indexNum = (_d = matrix[indexA]) === null || _d === void 0 ? void 0 : _d[indexB];
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
    };
    //获取异同
    LCS.prototype._getDiff = function () {
        var listFir = this.params.content.listA;
        var listSec = this.params.content.listB;
        var relations = this.getReleations();
        var result = [];
        var fir = {
            index: -1,
            stagnate: false,
        };
        var sec = {
            index: -1,
            stagnate: false,
        };
        var relation = relations.shift();
        while (true) {
            var nextFirIndex = fir.index + 1;
            var nextSecIndex = sec.index + 1;
            var exeRelation = (relation !== null && relation !== void 0 ? relation : {
                indexA: listFir.length,
                indexB: listSec.length
            });
            if (nextFirIndex <= exeRelation.indexA) {
                fir.index++;
            }
            if (nextFirIndex >= exeRelation.indexA) {
                fir.stagnate = true;
            }
            if (nextSecIndex <= exeRelation.indexB) {
                sec.index++;
            }
            if (nextSecIndex >= exeRelation.indexB) {
                sec.stagnate = true;
            }
            if (fir.stagnate && sec.stagnate) {
                if (relation) {
                    result.push({
                        unitA: listFir[fir.index],
                        unitB: listSec[sec.index],
                        equals: true
                    });
                    fir.stagnate = false;
                    sec.stagnate = false;
                    relation = relations.shift();
                }
                else {
                    return result;
                }
            }
            else {
                result.push({
                    unitA: fir.stagnate ? undefined : listFir[fir.index],
                    unitB: sec.stagnate ? undefined : listSec[sec.index],
                    equals: false
                });
            }
        }
    };
    LCS.prototype.checkParams = function () {
        var listFir = this.params.content.listA;
        var listSec = this.params.content.listB;
        return listFir.constructor === Array && listSec.constructor === Array;
    };
    LCS.prototype.getDiff = function () {
        if (this.checkParams()) {
            return this._getDiff();
        }
        else {
            return [];
        }
    };
    //获取相似度
    LCS.prototype.getSimilarity = function () {
        var equal = 0;
        var diffrents = this.getDiff();
        diffrents.forEach(function (value) {
            if (value.equals) {
                equal++;
            }
        });
        var similarity = equal / diffrents.length;
        return similarity > 0 ? similarity : 0;
    };
    return LCS;
}());
exports.LCS = LCS;
