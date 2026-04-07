//Useful functions for gambling

//#region useful functions
function evenlySpaced(min, max, num) {
    //generate evenly spaced array [num = cardinality]
    let arr = []
    if (num == 1) {
        arr = [(min + max)/2]
    } else {
        const step = (max - min)/ (num - 1)
        for (let i = 0; i < num; i++) {
            arr.push(min+(step*i));
        }
    }
    return arr;
}

function nthIndex(str, pat, n){
    // retrieve nth occurrence of a string
    let L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
        }
    return i;
}

function shuffle(array) {
    //F-Y shuffle
    let i = 0
    let j = 0
    let temp = null
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
};

function perm(...args) {
    //all combos of n arrays
    let r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function amb_structure(arr){
    //structure trials so that 50% successive trials have greater ambiguity, 50% lesser
    //@arr: array of [lotto reward, ambiguity level] 
    let higher = 0
    let lower = 0
    let exit_loop = false
    while (exit_loop == false){
        //iterate until ambiguity sequences are structured appropriately
        shuffle(arr)
        for (let i = 1; i < arr.length; i++){
            if (arr[i][1] > arr[i-1][1]){
                higher ++
            } else if (arr[i][1] < arr[i-1][1]){
                lower ++
            }
        }
        if (higher == lower && higher == Math.floor(arr.length/2)){
            higher = 0;
            lower = 0;
            exit_loop = true;
        } else {
            higher = 0;
            lower = 0;
        }
    }
}

function fix_structure(arr_fix, arr_amb){
    //add in fixed rewards, making sure that there are the appropriate number of valid and catch trials
    //@arr_fix: array of possible fixed rewards
    //@arr_amb: [lotto reward, ambiguity level] structured as per experiment design (see amb_structure function)
    let higher_fix = 0
    let lower_fix = 0
    let equal_fix = 0
    let exitInner = false
    while (exitInner == false){
        shuffle(arr_fix)
        for (let i = 0; i < arr_amb.length; i++){
              if (arr_fix[i] > arr_amb[i][0]){
                //increment counter for fix > lotto (catch)
                higher_fix ++
              } else if (arr_fix[i] < arr_amb[i][0]){
                //increment counter for fix < lotto (valid) 
                lower_fix ++
              } else if (arr_fix[i] == arr_amb[i][0]){
                //increment counter for fix == lotto (catch)
                equal_fix ++ 
              }
        }
        if (lower_fix == Math.floor(exp_params.valid_trials*arr_amb.length)+1 && 
            higher_fix == Math.floor(exp_params.catch_gr*arr_amb.length) && 
            equal_fix == Math.floor(exp_params.catch_eq*arr_amb.length)){
            //criteria met
            exitInner = true
        } else {
            lower_fix = 0
            higher_fix = 0
            equal_fix = 0
        }
    }
}

function remove_overlap(arr_all, arr_rem){
    //remove used values 
    //@arr_all: array of all valid trials
    //@arr_rem: array of values to be removed from tracker @arr_all
    if (arr_rem == null){
      //do nothing
    } else {
      let idxRemove = []
      for (let i = 0; i < arr_rem.length; i++){
          let rem = arr_all.indexOf(arr_rem[i])
          if (rem==-1){
            //do nothing, there was no overlap -- this should never happen for proper trials
            console.log(arr_rem[i])
            console.log("error in code")
          } else {
            idxRemove.push(arr_all.indexOf(arr_rem[i]))
          }
      }
      idxRemove.sort((a,b)=>a-b)
      while(idxRemove.length) {
      //keep only valid trials in array
      arr_all.splice(idxRemove.pop(), 1);
      }
    }
}

function replace_overlap(arr_current,arr_all,arr_replace,arr_gr,arr_eq){
    //replace duplicate trials in new block with unused parameter values
    //@arr_current: new block of trials
    //@arr_all: unused valid trials
    //@arr_replace: overlapping elements between new block of trials and previous trial blocks (to be replaced with unused trials)
    //@arr_gr: unused catch trials: fix > lotto
    //@arr_eq: unused catch trials: fix == lotto
    let exitLoop = false
    let arr_current_copy = [...arr_current]
    let idxRemove = []
    while (exitLoop == false){
        if (arr_replace == null){
          //no overlap
          exitLoop = true
        }
        for (let i = 0; i < arr_replace.length; i++){
          let subset = []
          let rep = arr_current.findIndex((element) => JSON.stringify(element) == JSON.stringify(arr_replace[i])) //index in new block set that needs to be replaced. Using JSON.stringify because array/element comparisons can be tricky in JS. This is safest.
        
          //is the trial to be replaced valid or catch?
          if (arr_replace[i][0]<arr_replace[i][1]){
            //valid trial
            for (let j = 0; j < arr_all.length; j++){
              if (arr_all[j][1]==arr_replace[i][1] && arr_all[j][2]==arr_replace[i][2]){
                subset.push(arr_all[j])
              }
            }
          } else if (arr_replace[i][0]==arr_replace[i][1]){
            console.log("duplicate catch equal")
            //catch trial: fix = lotto
            for (let j = 0; j < arr_eq.length; j++){
              console.log("INDEX: ", j)
                if (arr_eq[j][1]==arr_replace[i][1] && arr_eq[j][2]==arr_replace[i][2]){
                  subset.push(arr_eq[j])
                }
              }
          } else {
            console.log("duplicate catch greater")
            //catch trial: fix > lotto
            for (let j = 0; j < arr_gr.length; j++){
                if (arr_gr[j][1]==arr_replace[i][1] && arr_gr[j][2]==arr_replace[i][2]){
                  subset.push(arr_gr[j])
                }
              }
          }
          
          // select randomly from valid replacements and make 
          let replacement = subset[Math.floor(Math.random()*subset.length)]
          if (typeof replacement == 'undefined'){
            //unable to find a valid replacement! Need to move back up the while loop and start again
            console.log("No valid replacement available!")
            return "Reset"
          }
          console.log("The replacement is: ", replacement)
          //replace duplicated value in interim array
          arr_current_copy[rep] = replacement  
          //indices for values to be removed from all (replacement)
          idxRemove.push(arr_all.indexOf(replacement))
        }
        //confirm that the newly generated array has the same median value. If yes, exit loop
        let fix_vals_interim = []
        for (let i = 0 ; i < arr_current.length; i++){
          fix_vals_interim.push(arr_current_copy[i][0])
        }
        console.log("Median fixed value of block is: ", median(fix_vals_interim))
        if (median(fix_vals_interim)==median(fixed)){
          //medians are the same, equate main array to interim 
          arr_current.length = 0
          arr_current.push(arr_current_copy)
          //arr_current = arr_current_copy
          exitLoop = true
        } else {
          //reset interim to original
          arr_current_copy = [...arr_current]
          idxRemove = []
        }
    }
    idxRemove.sort((a,b)=>a-b)
    while(idxRemove.length) {
        //keep only valid trials in array
        arr_all.splice(idxRemove.pop(), 1);
    }
}
//#endregion