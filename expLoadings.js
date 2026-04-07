//Fixed params, images etc.

//#region Numerical params & initializing. Trial params as per Konova 2020
const dev_mode = "task"; // for debug mode set dev_mode = "debug"
const task_version = "risk" // if "risk" then include risky trials *and* ambiguous trials else only ambiguous
const fixed = (dev_mode == "debug") ? [3,3.5,4,5,6,7.5,9.5] : [3,3.5,4,5,6,7.5,9.5]//[3.5,4,5,6,7.5,9.5]//[3,3.5,4,5,6,7.5,9.5]//[5,6, 9.5,13,15]; //[5,6, 10,13,18, 30]
const vals = (dev_mode == "debug") ?  [5, 9.5, 18, 22, 30, 34, 48] : [5, 9.5, 18, 22, 30, 34, 48];
//NOTE: below does not change regardless of whether we include risky trials or not (risk: 25, 50, 75)
const amb_levels = (dev_mode == "debug") ? [1,2,3,15, 40, 60, 85] : [1,2,3,15, 40, 60, 85]; 
//weird drawing issue, want all lotteries played at least twice during practice so issue resolved before actual trials
const prac_amb = (dev_mode == "debug") ? [1,2,3,15, 40, 60, 85] : [1,2,3,15, 40, 60, 85]; 
const prac_fix = (dev_mode == "debug") ?  [2,3,5,6,8] : [2,3,5,6,8]
//what is the below being used for?
const blockLength = (dev_mode == "debug") ? 7: 49
const numBlocks = (dev_mode == "debug") ? 1: 4

function rand(min, max,length){
    //generate array of length "length" of random numbers (to 1 decimap pt)
    let r  = []
    for(let i = 0; i<length; i++) 
        {r.push(Math.round(((Math.random()*min)+(max-min))*10)/10)}
    return r
}
const prac_vals = (dev_mode == "debug") ? rand(5,10,7) : rand(5,10,7);

const exp_params = {
    stimLength: 3000,
    minITILength: 500,
    maxITILength: 2000,
    feedbackLength: 500,
    newBlockLength: 5000,
    altLottoReward: 0,
    responses: ['q','p'],
    quizResponses: ['a','d','g','j','p','q'], //potential quiz responses, not actual answers
    lotto_moneys: vals,
    amb_levels: amb_levels
}


let init_lotto_reward_locations = Array(Math.floor(blockLength/2)).fill(0).concat(Array(Math.floor(blockLength/2)).fill(1)) //array of 0s (blue reward) and 1s (red reward) to be shuffled to determine if reward goes above or below lottery
let init_fixed_reward_locations = Array(Math.floor(blockLength/2)).fill(0).concat(Array(Math.floor(blockLength/2)).fill(1)) //array of 0s (blue reward) and 1s (red reward) to be shuffled to determine if reward goes above or below lottery
const prac_lotto_reward_locations = Array(Math.floor(prac_vals.length/2) + 1).fill(0).concat(Array(Math.floor(prac_vals.length/2)).fill(1)) 
const prac_fixed_reward_locations = Array(Math.floor(prac_vals.length/2)).fill(0).concat(Array(Math.floor(prac_vals.length/2)+1).fill(1)) 
//let images_lottos = []
let top_prac = [];
let bottom_prac = [];
let top_red = [];
let bottom_blue = [];
let itis = [];
let pracImg = [];
let lotImg = [];
let blocks = [];
let allBlocks = [];
let allFactors = [];
let factorsPrac = [];
let factorsTask = [];
let pracCounter = 0;
let pracAttempts = 1;
let blockCounter = 0;
let trialCounter = 0;
let bonus_reward = [];
let bonus_trial_idx = 0;
let bonus_text = [];
let stim_presentation = [];
let response_trials = {};
/*let block1 = [[ 6, 48, 75 ],    [ 4, 22, 40 ],   [ 5, 22, 60 ],
[ 7.5, 9.5, 40 ], [ 6, 48, 15 ]]
let block2 = [[ 6, 48, 75 ],    [ 4, 22, 40 ],   [ 5, 22, 60 ],
[ 7.5, 9.5, 40 ], [ 6, 48, 15 ]]
let block3 = [[ 6, 48, 75 ],    [ 4, 22, 40 ],   [ 5, 22, 60 ],
[ 7.5, 9.5, 40 ], [ 6, 48, 15 ]]
let block4 = [[ 6, 48, 75 ],    [ 4, 22, 40 ],   [ 5, 22, 60 ],
[ 7.5, 9.5, 40 ], [ 6, 48, 15 ]]*/
let block1 =  [
  [ 6, 48, 1 ],    [ 4, 5, 3 ],     [ 3, 9.5, 2 ],
  [ 3.5, 22, 1 ],  [ 9.5, 18, 15 ], [ 4, 34, 85 ],
  [ 9.5, 34, 1 ],  [ 4, 9.5, 15 ],  [ 3, 22, 2 ],
  [ 9.5, 30, 85 ], [ 6, 9.5, 60 ],  [ 7.5, 9.5, 1 ],
  [ 4, 18, 2 ],    [ 3.5, 30, 1 ],  [ 7.5, 48, 85 ],
  [ 3.5, 48, 15 ], [ 9.5, 9.5, 3 ], [ 5, 34, 2 ],
  [ 6, 22, 3 ],    [ 5, 22, 60 ],   [ 3, 5, 2 ],
  [ 3.5, 34, 15 ], [ 6, 9.5, 40 ],  [ 3.5, 48, 2 ],
  [ 4, 5, 15 ],    [ 9.5, 48, 60 ], [ 7.5, 48, 3 ],
  [ 3.5, 18, 85 ], [ 3, 30, 40 ],   [ 6, 34, 3 ],
  [ 5, 30, 60 ],   [ 3, 18, 3 ],    [ 7.5, 5, 60 ],
  [ 9.5, 22, 85 ], [ 4, 5, 40 ],    [ 5, 5, 85 ],
  [ 5, 22, 15 ],   [ 5, 48, 40 ],   [ 6, 5, 1 ],
  [ 5, 18, 40 ],   [ 3.5, 34, 60 ], [ 6, 30, 3 ],
  [ 7.5, 18, 60 ], [ 3, 18, 1 ],    [ 7.5, 34, 40 ],
  [ 4, 9.5, 85 ],  [ 9.5, 22, 40 ], [ 3, 30, 15 ],
  [ 7.5, 30, 2 ]
]
let block2 =  [
  [ 7.5, 18, 2 ],  [ 3.5, 9.5, 60 ], [ 7.5, 22, 2 ],
  [ 4, 48, 85 ],   [ 7.5, 22, 1 ],   [ 3, 5, 15 ],
  [ 4, 9.5, 3 ],   [ 5, 30, 2 ],     [ 6, 22, 15 ],
  [ 3.5, 22, 40 ], [ 7.5, 18, 85 ],  [ 7.5, 48, 1 ],
  [ 4, 30, 40 ],   [ 3, 30, 3 ],     [ 9.5, 30, 15 ],
  [ 7.5, 30, 60 ], [ 9.5, 18, 3 ],   [ 3, 34, 1 ],
  [ 9.5, 34, 60 ], [ 3, 5, 1 ],      [ 9.5, 34, 2 ],
  [ 3.5, 18, 1 ],  [ 6, 9.5, 2 ],    [ 4, 48, 40 ],
  [ 3, 18, 15 ],   [ 6, 5, 60 ],     [ 6, 5, 40 ],
  [ 3.5, 22, 3 ],  [ 5, 34, 85 ],    [ 3.5, 48, 60 ],
  [ 4, 18, 40 ],   [ 9.5, 48, 15 ],  [ 5, 34, 40 ],
  [ 5, 9.5, 85 ],  [ 3.5, 5, 3 ],    [ 3, 22, 85 ],
  [ 4, 22, 60 ],   [ 3, 34, 15 ],    [ 6, 48, 2 ],
  [ 5, 34, 3 ],    [ 3, 5, 85 ],     [ 5, 30, 1 ],
  [ 6, 30, 85 ],   [ 5, 5, 2 ],      [ 9.5, 48, 3 ],
  [ 3, 18, 60 ],   [ 3.5, 9.5, 40 ], [ 9.5, 9.5, 1 ],
  [ 6, 9.5, 15 ]
]

let block3 = [
  [ 3.5, 18, 60 ],  [ 6, 48, 3 ],     [ 7.5, 30, 15 ],
  [ 9.5, 9.5, 60 ], [ 7.5, 9.5, 15 ], [ 5, 48, 85 ],
  [ 6, 18, 3 ],     [ 6, 34, 1 ],     [ 5, 34, 15 ],
  [ 3.5, 9.5, 3 ],  [ 3, 30, 1 ],     [ 3, 30, 2 ],
  [ 4, 5, 85 ],     [ 9.5, 5, 2 ],    [ 4, 9.5, 40 ],
  [ 7.5, 22, 85 ],  [ 9.5, 30, 60 ],  [ 3.5, 9.5, 85 ],
  [ 5, 18, 15 ],    [ 6, 18, 2 ],     [ 4, 22, 15 ],
  [ 3.5, 9.5, 2 ],  [ 3.5, 5, 40 ],   [ 6, 22, 60 ],
  [ 6, 34, 85 ],    [ 3.5, 5, 15 ],   [ 6, 22, 40 ],
  [ 9.5, 22, 2 ],   [ 5, 48, 15 ],    [ 5, 18, 85 ],
  [ 3.5, 34, 2 ],   [ 3, 48, 1 ],     [ 7.5, 30, 40 ],
  [ 4, 22, 3 ],     [ 5, 9.5, 1 ],    [ 3, 34, 3 ],
  [ 7.5, 18, 40 ],  [ 7.5, 48, 2 ],   [ 3, 48, 60 ],
  [ 3.5, 48, 40 ],  [ 3, 22, 1 ],     [ 4, 34, 40 ],
  [ 5, 5, 3 ],      [ 3, 34, 60 ],    [ 4, 5, 1 ],
  [ 9.5, 5, 60 ],   [ 3.5, 30, 85 ],  [ 9.5, 30, 3 ],
  [ 4, 18, 1 ]
]

let block4 = [
  [ 5, 34, 1 ],    [ 5, 48, 60 ],    [ 4, 48, 1 ],
  [ 9.5, 30, 2 ],  [ 3, 48, 85 ],    [ 6, 30, 1 ],
  [ 4, 18, 3 ],    [ 5, 9.5, 2 ],    [ 3, 22, 60 ],
  [ 3, 34, 85 ],   [ 3.5, 5, 60 ],   [ 6, 22, 2 ],
  [ 5, 5, 15 ],    [ 3, 18, 85 ],    [ 3.5, 30, 3 ],
  [ 7.5, 48, 40 ], [ 3.5, 5, 85 ],   [ 7.5, 5, 40 ],
  [ 7.5, 30, 85 ], [ 3, 48, 15 ],    [ 9.5, 18, 60 ],
  [ 4, 34, 15 ],   [ 6, 18, 40 ],    [ 5, 22, 85 ],
  [ 5, 9.5, 40 ],  [ 3, 48, 3 ],     [ 6, 18, 1 ],
  [ 5, 9.5, 15 ],  [ 7.5, 34, 3 ],   [ 9.5, 48, 2 ],
  [ 4, 22, 40 ],   [ 3.5, 18, 15 ],  [ 9.5, 9.5, 85 ],
  [ 3.5, 30, 40 ], [ 6, 22, 1 ],     [ 3.5, 22, 15 ],
  [ 3, 5, 3 ],     [ 7.5, 9.5, 60 ], [ 9.5, 5, 1 ],
  [ 9.5, 22, 3 ],  [ 3, 34, 2 ],     [ 4, 30, 60 ],
  [ 3.5, 18, 2 ],  [ 3.5, 34, 40 ],  [ 3, 9.5, 3 ],
  [ 7.5, 34, 60 ], [ 6, 9.5, 1 ],    [ 5, 30, 15 ],
  [ 3.5, 5, 2 ]
]
/*let block1 = [
  [ 6, 48, 75 ],    [ 4, 22, 40 ],   [ 5, 22, 60 ],
  [ 7.5, 9.5, 40 ], [ 6, 48, 15 ],   [ 3, 30, 75 ],
  [ 3.5, 18, 60 ],  [ 3, 18, 40 ],   [ 4, 34, 15 ],
  [ 3, 30, 40 ],    [ 3, 9.5, 75 ],  [ 5, 5, 15 ],
  [ 5, 48, 50 ],    [ 4, 5, 85 ],    [ 7.5, 22, 15 ],
  [ 3.5, 5, 40 ],   [ 9.5, 30, 25 ], [ 3.5, 30, 50 ],
  [ 9.5, 34, 85 ],  [ 4, 9.5, 15 ],  [ 6, 34, 50 ],
  [ 4, 18, 75 ],    [ 9.5, 30, 85 ], [ 7.5, 48, 25 ],
  [ 5, 48, 40 ],    [ 7.5, 22, 75 ], [ 6, 5, 50 ],
  [ 3.5, 5, 60 ],   [ 5, 5, 25 ],    [ 7.5, 48, 60 ],
  [ 3.5, 18, 25 ],  [ 7.5, 5, 75 ],  [ 6, 30, 60 ],
  [ 3.5, 22, 25 ],  [ 4, 18, 15 ],   [ 9.5, 48, 85 ],
  [ 6, 34, 60 ],    [ 9.5, 34, 25 ], [ 4, 18, 50 ],
  [ 3, 34, 75 ],    [ 3, 18, 85 ],   [ 3, 9.5, 60 ],
  [ 5, 9.5, 85 ],   [ 5, 9.5, 25 ],  [ 9.5, 22, 85 ],
  [ 7.5, 9.5, 50 ], [ 6, 34, 40 ],   [ 9.5, 22, 50 ],
  [ 3.5, 30, 15 ]
]

let block2 = [
  [ 4, 9.5, 60 ],   [ 3.5, 34, 85 ], [ 9.5, 18, 60 ],
  [ 4, 48, 75 ],    [ 3, 5, 50 ],    [ 7.5, 5, 60 ],
  [ 3.5, 30, 75 ],  [ 6, 9.5, 85 ],  [ 3, 18, 50 ],
  [ 7.5, 34, 40 ],  [ 5, 48, 25 ],   [ 3.5, 48, 85 ],
  [ 4, 9.5, 75 ],   [ 3, 9.5, 25 ],  [ 3, 22, 15 ],
  [ 9.5, 9.5, 50 ], [ 4, 48, 15 ],   [ 3, 5, 75 ],
  [ 5, 22, 85 ],    [ 6, 22, 50 ],   [ 3, 18, 75 ],
  [ 4, 30, 15 ],    [ 6, 22, 40 ],   [ 3.5, 22, 75 ],
  [ 6, 30, 25 ],    [ 6, 9.5, 40 ],  [ 3.5, 5, 85 ],
  [ 3, 34, 15 ],    [ 4, 34, 25 ],   [ 5, 18, 85 ],
  [ 4, 30, 40 ],    [ 9.5, 34, 60 ], [ 5, 30, 50 ],
  [ 9.5, 5, 25 ],   [ 7.5, 30, 60 ], [ 5, 22, 25 ],
  [ 6, 30, 85 ],    [ 6, 48, 50 ],   [ 9.5, 34, 75 ],
  [ 5, 5, 40 ],     [ 3, 5, 15 ],    [ 9.5, 18, 25 ],
  [ 6, 22, 60 ],    [ 3.5, 18, 15 ], [ 3.5, 18, 40 ],
  [ 5, 48, 60 ],    [ 7.5, 34, 50 ], [ 9.5, 48, 40 ],
  [ 5, 9.5, 15 ]
]

let block3 =[
  [ 3.5, 48, 40 ],  [ 4, 22, 15 ],    [ 4, 34, 60 ],
  [ 7.5, 9.5, 15 ], [ 3, 5, 25 ],     [ 6, 30, 40 ],
  [ 3.5, 9.5, 60 ], [ 4, 22, 75 ],    [ 6, 22, 25 ],
  [ 5, 48, 15 ],    [ 3, 48, 85 ],    [ 6, 18, 75 ],
  [ 3, 9.5, 50 ],   [ 3, 5, 40 ],     [ 3, 30, 60 ],
  [ 3.5, 34, 75 ],  [ 3.5, 34, 15 ],  [ 3, 48, 50 ],
  [ 7.5, 34, 25 ],  [ 5, 18, 15 ],    [ 5, 30, 85 ],
  [ 9.5, 22, 60 ],  [ 3.5, 5, 15 ],   [ 9.5, 5, 85 ],
  [ 4, 18, 25 ],    [ 6, 5, 75 ],     [ 3.5, 9.5, 85 ],
  [ 5, 34, 40 ],    [ 4, 34, 50 ],    [ 3, 30, 25 ],
  [ 4, 22, 85 ],    [ 5, 48, 75 ],    [ 3, 48, 25 ],
  [ 6, 18, 40 ],    [ 7.5, 9.5, 75 ], [ 7.5, 30, 15 ],
  [ 4, 34, 85 ],    [ 7.5, 18, 60 ],  [ 6, 18, 50 ],
  [ 7.5, 22, 40 ],  [ 5, 5, 50 ],     [ 3, 5, 60 ],
  [ 9.5, 9.5, 40 ], [ 9.5, 48, 60 ],  [ 7.5, 18, 85 ],
  [ 7.5, 30, 50 ],  [ 6, 30, 75 ],    [ 3.5, 9.5, 25 ],
  [ 7.5, 22, 50 ]
] 

let block4 =[
  [ 9.5, 30, 15 ], [ 5, 9.5, 50 ],   [ 9.5, 22, 40 ],
  [ 4, 48, 85 ],   [ 3.5, 48, 60 ],  [ 3, 22, 25 ],
  [ 4, 5, 40 ],    [ 3.5, 5, 50 ],   [ 3.5, 22, 15 ],
  [ 7.5, 30, 25 ], [ 6, 5, 60 ],     [ 3, 9.5, 85 ],
  [ 9.5, 30, 40 ], [ 5, 9.5, 60 ],   [ 7.5, 18, 75 ],
  [ 3.5, 30, 85 ], [ 3, 9.5, 40 ],   [ 4, 5, 15 ],
  [ 3, 22, 50 ],   [ 3.5, 48, 75 ],  [ 9.5, 48, 25 ],
  [ 5, 34, 60 ],   [ 6, 18, 85 ],    [ 6, 22, 75 ],
  [ 5, 18, 40 ],   [ 6, 5, 25 ],     [ 3, 5, 85 ],
  [ 3, 34, 25 ],   [ 9.5, 9.5, 15 ], [ 4, 18, 60 ],
  [ 5, 18, 50 ],   [ 7.5, 9.5, 25 ], [ 9.5, 18, 15 ],
  [ 6, 34, 75 ],   [ 3, 48, 15 ],    [ 3.5, 22, 85 ],
  [ 7.5, 34, 15 ], [ 9.5, 30, 60 ],  [ 5, 30, 75 ],
  [ 6, 48, 40 ],   [ 5, 5, 75 ],     [ 6, 30, 50 ],
  [ 6, 9.5, 75 ],  [ 4, 34, 40 ],    [ 3, 18, 25 ],
  [ 3.5, 22, 60 ], [ 3.5, 34, 50 ],  [ 3, 34, 85 ],
  [ 7.5, 48, 50 ]
]*/
//#endregion

//#region Images
const prefix_images = "./images/"//"../static/images/task_images/";

const images_lottos = [ 
  prefix_images+'ambig_blue_15.png',
  prefix_images+'ambig_blue_25.png',
  prefix_images+'ambig_blue_40.png',
  prefix_images+'ambig_blue_50.png',
  prefix_images+'ambig_blue_60.png',
  prefix_images+'ambig_blue_75.png',
  prefix_images+'ambig_blue_85.png'
];
/*
if (task_version == "risk"){
  images_lottos = [ 
    prefix_images+'ambig_blue_15.png',
    prefix_images+'risk_blue_25.png',
    prefix_images+'ambig_blue_40.png',
    prefix_images+'risk_blue_50.png',
    prefix_images+'ambig_blue_60.png',
    prefix_images+'risk_blue_75.png',
    prefix_images+'ambig_blue_85.png'
];
} else {
  images_lottos = [ 
    prefix_images+'ambig_blue_15.png',
    prefix_images+'ambig_blue_25.png',
    prefix_images+'ambig_blue_40.png',
    prefix_images+'ambig_blue_50.png',
    prefix_images+'ambig_blue_60.png',
    prefix_images+'ambig_blue_75.png',
    prefix_images+'ambig_blue_85.png'
];
}*/


const images_instr = [ // All the images used 
    prefix_images+'lotteryWelcomeScreen.png',
    prefix_images+'risk_blue_25_example.png',
    prefix_images+'ambig_blue_25_example.png',
    prefix_images+'possible_lotteries_all.png',
    prefix_images+'fixed_example_bothsides.png',
];

const images_trials = [
    prefix_images+'feedback_left.png',
    prefix_images+'feedback_missed.png',
    prefix_images+'feedback_right.png',
    prefix_images+'response.png'
]

//#endregion

