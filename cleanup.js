//cleanup 
//#region cleanup + demo + debrief
const task_end = {
    type: "html-keyboard-response",
    stimulus:  `
    <p style="font-size:20px"><strong> End of Experiment! </strong></p> <br>
    <p>Thank you for participating in this experiment!</p> <br>
    <p> On the following page, you will be asked about your demographics and then to answer some questions about the experiment, after which you will be compensated for your time. </p>
    <br> <br> <br> 
    <p><i>Press either <strong>` + exp_params.responses[0] + `</strong> or <strong>` + exp_params.responses[1] + `</strong> to continue.</i></p>
`,
    choices: exp_params.responses,
};
 /*
let demographics = {
    type: 'survey-html-form',
    preamble: `<p> <b> Demographics form </b> </p>`,
    html: `
    <p> What is your ethnicity? <input type = "text" id = "ethnicity" name = "ethnicity"></p>
    <p> What is your age? <input type = "number" id = "age" name = "age" min = "18" max = "100"></p>
    <p> What is your gender? <select id='gender' name='gender'><option value='blank'> </option><option value='male'>Male</option><option value='female'>Female</option><option value='other'>Other</option><option value='prefernottosay'>Prefer Not To Say</option></p>
     <br> <p>.</p>`
}
*/
let demographics = {
    type: 'survey-text',
    preamble: `<b><u>Demographics Questions</u></b>` ,  
    questions: [
        {prompt: "What is your race? Choose from: American Indian or Alaska Native (AIAN); Asian (A); Black or African American (BAA); Native Hawaiian or Pacific Islander (NHPI); White (W); Prefer Not To Answer (PNTA)",
                rows: 1, columns: 4, required: true},
        {prompt: "What is your age? Please enter a numerical value:",
                rows: 1, columns: 2, required: true},
        {prompt: "What is your gender? Choose from: Female (F); Male (M); Other (O); Prefer Not To Answer (PNTA)",
                rows: 1, columns: 4, required: true}
    ]
  }
  
let debrief = {
    type: 'survey-text',
    preamble: `<b><u>Debriefing Questions</u></b>`,  
    questions: [
        {prompt: "Were you able to treat each trial independently? If no, why not? Please answer with as much detail as you can.",
                rows: 3, columns: 40, required: true},
        {prompt: "Did you use any strategies while making your decisions? Please answer with as much detail as you can.",
                rows: 3, columns: 40, required: true},
        {prompt: "Did you treat the the two types of lotteries differently? Did you have any difficulty understanding what the grey bar meant?",
                rows: 3, columns: 40, required: true},
        {prompt: "Were you able to stay engaged throughout the experiment? Please be honest, your payment does not depend on your answer.",
                rows: 3, columns: 40, required: true},
        {prompt: "Did you experience any problems during the experiment (e.g. technical)?",
                rows: 3, columns: 40, required: true}
    ],
    on_finish: function(data){
        //save experiment params for session
        data.exp_params = exp_params
        //determining bonus
        console.log("Responses length (should be 196+14)",Object.keys(response_trials).length)
        const num_valid_resps = Object.keys(response_trials).length - (prac_vals.length)*2
        console.log("Number of valid responses: ", num_valid_resps)
        let arr = Array.from(Array(num_valid_resps).keys())
        let exitLoop = false
        while (exitLoop == false){
            //select bonus trial
            bonus_trial_idx = arr[Math.floor(Math.random() * arr.length)]
            let bonus_trial = response_trials[bonus_trial_idx+(prac_vals.length)*2]
            if (bonus_trial.fixed_rwd == bonus_trial.lotto_rwd || bonus_trial.fixed_rwd > bonus_trial.lotto_rwd){
                //catch trials, ineligible for bonus
                console.log('Selected a catch trial for bonus. Re-do.')
            } else {
                exitLoop = true
            }
        }
        //bonus_trial_idx = arr[Math.floor(Math.random() * arr.length)]
        const bonus_trial = response_trials[bonus_trial_idx+(prac_vals.length)*2]
        console.log(bonus_trial)
        if(bonus_trial.choice_made==0){
            //subject chose option the left side. Determine whether it was fixed or lotto
            if (bonus_trial.fixed_rhs == 0){
                //subject chose fixed
                bonus_reward.push(bonus_trial.fixed_rwd)
                bonus_text.push("You chose the fixed option on this trial. Therefore your bonus is $".concat(bonus_reward[0]))
            } else {
                //subject chose lottery
                const lotto_pick = Math.floor(Math.random() * 2)
                if (lotto_pick == 1){
                    bonus_reward.push(bonus_trial.red)
                    bonus_text.push("You chose the lottery. We randomly drew a red chip from the lottery and your bonus is: $".concat(bonus_reward[0]))
                } else {
                    bonus_reward.push(bonus_trial.blue)
                    bonus_text.push("You chose the lottery. We randomly drew a blue chip from the lottery and your bonus is: $".concat(bonus_reward[0]))
                }
            }
        } else if (bonus_trial.choice_made==1){
            //subject chose option the right hand side. Determine whether it was fixed or lotto
            if (bonus_trial.fixed_rhs == 1){
                //subject chose fixed
                bonus_reward.push(bonus_trial.fixed_rwd)
                bonus_text.push("You chose the fixed option on this trial. Therefore your bonus is $".concat(bonus_reward[0]))
            } else {
                //subject chose lottery
                const lotto_pick = Math.floor(Math.random() * 2)
                if (lotto_pick == 1){
                    bonus_reward.push(bonus_trial.red)
                    bonus_text.push("You chose the lottery. We randomly drew a red chip from the lottery and your bonus is: $".concat(bonus_reward[0]))
                } else {
                    bonus_reward.push(bonus_trial.blue)
                    bonus_text.push("You chose the lottery. We randomly drew a blue chip from the lottery and your bonus is: $".concat(bonus_reward[0]))
                }
            }
        } else {
            //trial was missed
            bonus_reward.push(0)
            bonus_text.push("You did not make a choice in this trial. Therefore your bonus is: $0")
        }
        data.bonus = {
            reward: bonus_reward[0],
            trial: bonus_trial_idx,
            text: bonus_text[0],
            properties: bonus_trial
        }
        console.log(bonus_reward)
        console.log(bonus_text)
    }
};

let bdm = {
    type: 'html-keyboard-response',
    stimulus: function(){
        return `
        <p><strong>Bonus Selection</strong></p>
        <p>The following choice you made was selected at random:</p>
        <p>Trial number: `+ bonus_trial_idx+`.</p>
        <p>Your options that trial were: $`+ response_trials[bonus_trial_idx+(prac_vals.length)*2].fixed_rwd + ` if you chose the fixed option, or, if you chose the lottery $<b>`+ 
        response_trials[bonus_trial_idx+(prac_vals.length)*2].red+ `</b> if a red chip is drawn, or $<b>`+ 
        response_trials[bonus_trial_idx+(prac_vals.length)*2].blue+`</b> if a blue chip is drawn.</p> <br>
        <p><b>` + bonus_text[0] + `</b></p> <br>
        <p><i>Press either <strong>` + exp_params.responses[0] + `</strong> or <strong>` + exp_params.responses[1] + `</strong> to move to payment.</i></p>
        `
    },
    choices: exp_params.responses
}
//#endregion