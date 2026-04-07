//Main task trials
//Block structure: New block display screen, trials...
//Trial structure: Stimulus display, Feedback, ITI

//#region Cursor Off/On Trials
const cursor_off = {
    type: 'call-function',
    func: function() {
        document.body.style.cursor = "none";
    }
}

const cursor_on = {
    type: 'call-function',
    func: function() {
        document.body.style.cursor = "auto";
    }
}
//#endregion

//#region Main block + task trials (target, ITI)
let new_block_screen = {
    type: 'html-keyboard-response',
    stimulus: function() {
        return `
        <p style="font-size:20px"><strong>New Block (` + (blockCounter + 1) + `/` + numBlocks + `)</strong></p>
        <p>The next block will begin in approximately 5 seconds.</p>`
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: exp_params.newBlockLength,
    response_ends_trial: false,
    on_finish: function() {
        blockCounter++;
        console.log("***** New Block *****");
    }
}

let stim_trial = {
    type: 'html-keyboard-response',
    stimulus: function() {

        // FIX: use lottoImage directly — it already contains the correct full path
        // e.g. "./images/ambig_blue_40.png" as built in ambV2.html
        // Do NOT prepend any prefix or strip the path here.
        const full_path = jsPsych.timelineVariable('lottoImage');
        console.log("Attempting to load:", full_path);

        let fixed_val = jsPsych.timelineVariable('fixed') || "$0";
        let red_val   = jsPsych.timelineVariable('red')   || "$0";
        let blue_val  = jsPsych.timelineVariable('blue')  || "$0";

        let is_right = (jsPsych.timelineVariable('fixed_rhs') == 1);

        return `
        <div style="display: flex; justify-content: space-around; align-items: center;
                    width: 900px; height: 500px; margin: auto; font-family: Arial, sans-serif;">

            <!-- Guaranteed reward: LEFT side -->
            <div style="width: 200px; text-align: center;
                        visibility: ${!is_right ? 'visible' : 'hidden'};">
                <p style="font-size: 32px; font-weight: bold; margin: 0;">${fixed_val}</p>
                <p style="font-size: 16px; color: #666; margin: 4px 0 0 0;">Guaranteed</p>
            </div>

            <!-- Lottery: centre -->
            <div style="width: 350px; text-align: center;">
                <p style="font-size: 28px; color: #d9534f; font-weight: bold;
                          margin-bottom: 10px;">${red_val}</p>
                <img src="${full_path}"
                     style="width: 100%; height: auto; display: block; margin: auto;"
                     onerror="console.error('IMAGE FAILED TO LOAD:', '${full_path}');">
                <p style="font-size: 28px; color: #5bc0de; font-weight: bold;
                          margin-top: 10px;">${blue_val}</p>
            </div>

            <!-- Guaranteed reward: RIGHT side -->
            <div style="width: 200px; text-align: center;
                        visibility: ${is_right ? 'visible' : 'hidden'};">
                <p style="font-size: 32px; font-weight: bold; margin: 0;">${fixed_val}</p>
                <p style="font-size: 16px; color: #666; margin: 4px 0 0 0;">Guaranteed</p>
            </div>

        </div>`;
    },

    choices: exp_params.responses,
    trial_duration: exp_params.stimLength,
    on_finish: function(data) {
        console.log("!!! New Trial !!!");
        console.log("Key pressed is: ", data.response);

        data.red       = parseFloat(jsPsych.timelineVariable('red').split("$")[1]);
        data.blue      = parseFloat(jsPsych.timelineVariable('blue').split("$")[1]);
        // FIX: parseFloat on BOTH arguments to Math.max
        data.lotto_rwd = Math.max(
            parseFloat(jsPsych.timelineVariable('red').split("$")[1]),
            parseFloat(jsPsych.timelineVariable('blue').split("$")[1])
        );
        data.fixed_rwd = parseFloat(jsPsych.timelineVariable('fixed').split("$")[1]);
        // Extract amb level from filename, e.g. "./images/ambig_blue_40.png" → 40
        data.amb = parseInt(
            jsPsych.timelineVariable('lottoImage').split("_").pop().split(".")[0]
        );

        if (data.response == exp_params.responses[0]) {
            data.choice = 0;
            data.left   = true;
        } else if (data.response == exp_params.responses[1]) {
            data.choice = 1;
            data.left   = false;
        } else {
            data.choice = NaN;
            data.left   = null;
        }

        data.trial      = trialCounter + 1;
        data.trial_type = "stim-choice";

        response_trials[trialCounter] = {
            red:        data.red,
            blue:       data.blue,
            lotto_rwd:  data.lotto_rwd,
            fixed_rwd:  data.fixed_rwd,
            amb:        data.amb,
            choice_made: data.choice
        };

        console.log("Trial number: ", trialCounter);
        console.log(response_trials[trialCounter]);
        trialCounter++;
    }
}

let feedback_trial = {
    type: 'html-keyboard-response',
    stimulus: function(data) {
        let d = jsPsych.data.get().last().values()[0].response;
        console.log("Feedback. d is ", d);
        let testr = [];
        if (jsPsych.pluginAPI.compareKeys(d, exp_params.responses[1])) {
            console.log("Sub chose option on right");
            testr.push('<img src="' + images_trials[2] + '" />');
        } else if (jsPsych.pluginAPI.compareKeys(d, exp_params.responses[0])) {
            console.log("Sub chose option on left");
            testr.push('<img src="' + images_trials[0] + '" />');
        } else {
            console.log("Sub missed");
            testr.push('<img src="' + images_trials[1] + '" />');
        }
        return testr[0];
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: exp_params.feedbackLength,
    response_ends_trial: false,
    on_finish: function(data) {
        data.trial_type = "feedback";
        console.log("Executed feedbackTrialRight");
    }
}

let iti_trial = {
    type: 'html-keyboard-response',
    stimulus: '<p style="font-size: 48px;">-</p>',
    choices: jsPsych.NO_KEYS,
    trial_duration: jsPsych.timelineVariable('itiLength'),
    on_finish: function(data) {
        data.trial_type = "iti";
    }
}
//#endregion
