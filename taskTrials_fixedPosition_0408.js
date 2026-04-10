//Main task trials
//Block structure: New block display screen, trials...
//Trial structure: Stimulus display, Feedback, ITI

//#region Cursor Off/On
const cursor_off = {
    type: 'call-function',
    func: function() { document.body.style.cursor = "none"; }
}
const cursor_on = {
    type: 'call-function',
    func: function() { document.body.style.cursor = "auto"; }
}
//#endregion

//#region Trials

let new_block_screen = {
    type: 'html-keyboard-response',
    stimulus: function() {
        return `
        <p style="font-size:20px; color:white;">
            <strong>New Block (` + (blockCounter+1) + `/` + numBlocks + `)</strong>
        </p>
        <p style="color:white;">The next block will begin in approximately 5 seconds.</p>`
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

        const full_path  = jsPsych.timelineVariable('lottoImage');
        const fixed_val  = jsPsych.timelineVariable('fixed')    || "$0";
        const red_val    = jsPsych.timelineVariable('red')       || "$0";
        const blue_val   = jsPsych.timelineVariable('blue')      || "$0";
        const red_on_top = (jsPsych.timelineVariable('red_on_top') == 1);

        const top_label    = red_on_top ? red_val  : blue_val;
        const bottom_label = red_on_top ? blue_val : red_val;
        const top_color    = red_on_top ? "#ff4444" : "#4db8ff";
        const bottom_color = red_on_top ? "#4db8ff" : "#ff4444";

        return `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 100px;
            width: 100vw;
            height: 100vh;
            margin: 0;
            background: black;
            box-sizing: border-box;
        ">
            <!-- GUARANTEED — always LEFT -->
            <div style="
                width: 220px;
                text-align: center;
            ">
                <p style="
                    font-size: 13px;
                    color: #aaaaaa;
                    margin: 0 0 16px 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                ">Guaranteed</p>
                <p style="
                    font-size: 48px;
                    font-weight: bold;
                    color: white;
                    margin: 0 0 20px 0;
                ">${fixed_val}</p>
                <p style="
                    font-size: 13px;
                    color: #555555;
                    margin: 0;
                ">Press <strong style="color:#aaaaaa;">Q</strong></p>
            </div>

            <!-- GAMBLE — always RIGHT -->
            <div style="
                width: 260px;
                text-align: center;
            ">
                <p style="
                    font-size: 13px;
                    color: #aaaaaa;
                    margin: 0 0 16px 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                ">Gamble</p>

                <!-- Top reward label -->
                <p style="
                    font-size: 36px;
                    font-weight: bold;
                    color: ${top_color};
                    margin: 0 0 8px 0;
                ">${top_label}</p>

                <!-- Lottery bar image -->
                <img src="${full_path}"
                     style="
                         width: 240px;
                         height: auto;
                         display: block;
                         margin: 0 auto;
                     "
                     onerror="console.error('IMAGE FAILED:', '${full_path}');">

                <!-- Bottom reward label -->
                <p style="
                    font-size: 36px;
                    font-weight: bold;
                    color: ${bottom_color};
                    margin: 8px 0 20px 0;
                ">${bottom_label}</p>

                <p style="
                    font-size: 13px;
                    color: #555555;
                    margin: 0;
                ">Press <strong style="color:#aaaaaa;">P</strong></p>
            </div>
        </div>`;
    },

    choices: exp_params.responses,
    trial_duration: exp_params.stimLength,
    on_finish: function(data) {
        console.log("!!! New Trial !!!");
        console.log("Key pressed:", data.response);

        const red_raw  = jsPsych.timelineVariable('red').split("$")[1];
        const blue_raw = jsPsych.timelineVariable('blue').split("$")[1];

        data.red        = parseFloat(red_raw);
        data.blue       = parseFloat(blue_raw);
        data.lotto_rwd  = Math.max(parseFloat(red_raw), parseFloat(blue_raw));
        data.fixed_rwd  = parseFloat(jsPsych.timelineVariable('fixed').split("$")[1]);
        data.red_on_top = jsPsych.timelineVariable('red_on_top');
        data.amb        = parseInt(
            jsPsych.timelineVariable('lottoImage').split("_").pop().split(".")[0]
        );

        if (data.response == exp_params.responses[0]) {
            data.choice = 0; data.chose_gamble = false;  // Q = guaranteed
        } else if (data.response == exp_params.responses[1]) {
            data.choice = 1; data.chose_gamble = true;   // P = gamble
        } else {
            data.choice = NaN; data.chose_gamble = null; // missed
        }

        data.trial      = trialCounter + 1;
        data.trial_type = "stim-choice";

        response_trials[trialCounter] = {
            red:          data.red,
            blue:         data.blue,
            lotto_rwd:    data.lotto_rwd,
            fixed_rwd:    data.fixed_rwd,
            amb:          data.amb,
            choice_made:  data.choice,
            chose_gamble: data.chose_gamble,
            red_on_top:   data.red_on_top
        };

        console.log("Trial", trialCounter, response_trials[trialCounter]);
        trialCounter++;
    }
}

let feedback_trial = {
    type: 'html-keyboard-response',
    stimulus: function() {
        let d = jsPsych.data.get().last().values()[0].response;
        console.log("Feedback. d is", d);
        if (jsPsych.pluginAPI.compareKeys(d, exp_params.responses[1])) {
            console.log("Chose gamble");
            return '<img src="' + images_trials[2] + '" />';
        } else if (jsPsych.pluginAPI.compareKeys(d, exp_params.responses[0])) {
            console.log("Chose guaranteed");
            return '<img src="' + images_trials[0] + '" />';
        } else {
            console.log("Missed");
            return '<img src="' + images_trials[1] + '" />';
        }
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: exp_params.feedbackLength,
    response_ends_trial: false,
    on_finish: function(data) {
        data.trial_type = "feedback";
        console.log("Feedback executed");
    }
}

let iti_trial = {
    type: 'html-keyboard-response',
    stimulus: '<p style="font-size: 48px; color: white;">+</p>',
    choices: jsPsych.NO_KEYS,
    trial_duration: function() {
        return jsPsych.timelineVariable('itiLength');
    },
    on_finish: function(data) {
        data.trial_type = "iti";
    }
}

//#endregion
