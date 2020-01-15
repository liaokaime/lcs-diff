# lcs-diff
A tool to compare the difference between two lists

# Example
Preview link [https://liaokaime.github.io/lcs-diff/](https://liaokaime.github.io/lcs-diff/)

# Installation
```
npm i lcs-diff
```

# Usage
```typescript
import {LCS} from "lcs-diff/dist";

let lcs =new LCS({
    content : {
        listA : ["a","b","c","d"],
        listB : ["b","c","d","e"],
    },
    compare : (t1,t2)=>{
        return t1 === t2
    }
});

/**
 * Gets the difference between two pieces of text.
 *   The return value is an array with 3 keys for each element.
 *   "unitA" and "unitB" are elements from listA and listB, When "unitA" or "unitB" do not match element from another list, they may be undefined.
 *   "equals" indicates whether "unitA" and "unitB" are the same
 *   {
 *       unitA : T | undefined,
 *       unitB : T | undefined,
 *       equals : boolean
 *   }
 */
let compareList = lcs.getDiff();

/**
 * Gets the similarity between the contents of the two lists
 * This is a number between 0 and 1
 */
let similarity = lcs.getSimilarity();
```

# License
The files included in this repository are licensed under the MIT license.
