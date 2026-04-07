//Welcome; Instructions; Comprehension Quiz; Practice Instructions

//#region Welcome & Instructions
const instructionsAll = {
    type: 'instructions',
    pages: [
        '<img src = '+images_instr[0]+'></img><p style="font-size:20px">Welcome to the Lottery  Task!</p> <br> <p><i>Click on the button below, or use arrow keys to continue to the task instructions.</p>',
        `
        <p style="font-size:20px"><strong> Task Instructions (1/7) </strong></p><br>
        <p> In this task, you will choose between a <i>guaranteed amount of money </i> and a <i>lottery</i>, for a chance to win a different amount of money.</p> <br>
        <p> You will make decisions in four blocks, but make sure to treat each decision independently.</p> <br>
        <p><b><i>There is no correct answer - choose the option that <u>you truly prefer</u>.</i></b> </p> <br>
        <p> At the end of the experiment, <b>one of your choices will be selected at random and the result will be added to your pay</b>.</p> <br>
        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (2/7) </strong></p> <br>
        <div class = "multicolor">
        <p> Each lottery contains a total of 100 red and blue chips. You will see two types of lotteries. Here is the first type where you know exactly how many red and blue chips there. For example: </p>
        <img src =`+ images_instr[1]+`></img>
        <p>Here, there are 75 red chips and 25 blue chips. </p>
        <p>If we draw a chip from this lottery and it is red, you will win $0. If it is blue, you will win $18.</p>
        <p>If this is the trial we select at random, and you chose the lottery and a blue chip is drawn, $18 would be added to your total compensation. If a blue chip is drawn, $0 would be added.</p>

        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (3/7) </strong></p> <br>
        <div class = "multicolor">
        <p> Here is another type of lottery. Remember that each lottery contains a total of 100 red and blue chips. However, here you will be told only the <i> minimum </i> number of red and blue chips present. For example: </p>
        <img src =`+ images_instr[2]+`></img>
        <p>Here, there are a minimum of 38 red chips and 38 blue chips. We <i> do not know know </i> how many of the remaining 24 chips are red, and how many are blue.</p>
        <p>If we draw a chip from this lottery and it is red, you will win $20. If it is blue, you will win $0.</p>
        <p>If this is the trial we select at random, and you chose the lottery and a red chip is drawn, $20 would be added to your total compensation. If a blue chip is drawn, $0 would be added.</p>

        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (4/7) </strong></p> <br>
        <div class = "multicolor">
        <p> The information you get about the (minimum) number of chips in the lottery option may vary across trials. Here are some example lotteries:</p>
        <img src = `+ images_instr[3]+`></img>
        <p>As you can see, sometimes, lotteries will give you <i> more </i> or <i> less </i> information about the number of red or blue chips.</p>
        <p>The number of chips in each lottery will <b>not change over the experiment</b>, so it is up to you decide whether you want to play, or take the certain option.</p>
        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (5/7) </strong></p><br>
        <p> On each trial, you will see a fixed option (100% certain) or a lottery with a chance to win a different amount of money. </p> 
        <p> Sometimes the fixed option will appear on the <i>left</i> of the lottery, and sometimes on the <i>right.</i></p>
        <p>As soon as you have decided, press the '<strong>` + exp_params.responses[0] + `</strong>' key for<strong> the option on the left </strong>
        or the '<strong>` + exp_params.responses[1] + `</strong>' key for<strong> the option on the right </strong>. </p><br>
        <div class = "multicolor">
        <p> Once you have made your choice, you will see a feedback screen confirming your selection.</p> </div>
        <p> Note that the length of time between trials might vary. This is part of the experiment. </p> <br> 
        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (6/7) </strong></p>
        <p> A trial may look like either of the following: </p>
        <img src = `+ images_instr[4]+`></img>
        <p>For the screen on the left hand side, the fixed option is on the left, and if you wanted to select it, you would press the '<strong>` + exp_params.responses[0] + `</strong>' key ('<strong>` + exp_params.responses[1] + `</strong>' for lottery). </p>
        <p>Conversely, for the screen on the right hand side, the fixed option is on the right. If you wanted to select it, you would press the'<strong>` + exp_params.responses[1] + `</strong>' key ('<strong>` + exp_params.responses[0] + `</strong>' for lottery).</p>
        <p><b> You have a <i>maximum</i> of <strong>` + exp_params.stimLength/1000 + `</strong> seconds to respond on each trial.</b> </p>
        `,
        `
        <p style="font-size:20px"><strong> Task Instructions (7/7) </strong></p>
        <p><i>In summary</i>: you will choose between a certain reward or a lottery for a chance to win a different amount of money.</p>
        <p> If you prefer the option on the left, press the '<strong>` + exp_params.responses[0] + `</strong>' key. If the option on the right, press the '<strong>` +exp_params.responses[1] + `</strong>' key. </p>
        <p> Select your choice as soon as you have made up your mind.</p>
        <p> Remember that one of your choices will be selected at random, played out, and added to your compensation</p> <br>
        <p><b>If we randomly select a trial where you did not make a choice, your bonus will be $0.</b> </p>
        <p> You will now answer a few questions to confirm that you understand the instructions.</p>
        <p> Each question will remain on the screen till you press the correct key.</p>
        `],
    show_clickable_nav: true
}
//#endregion

//#region Comprehension Quiz
    // Comprehension quiz. Checks:  a) correct key press for yes
    //                              b) correct key press for no 
    //                              c) when they're supposed to make the key press
    //                              d) purpose of experiment
    //                              e) what do when new block screen is presented
    
    const quiz1 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (1/7) </strong></p>
        <br>
        <p style="font-size:22px"> What key should you press if you want to choose the option on the left?</p>
        `,
        key_answer: exp_params.quizResponses[5],
        text_answer: exp_params.quizResponses[5].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key:</i> %ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true
        //show_stim_with_feedback: false,
    };

    const quiz2 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (2/7) </strong></p>
        <br>
        <p style="font-size:22px"> What key should you press if you want to choose the option on the right?</p>
        `,
        key_answer: exp_params.quizResponses[4],
        text_answer: exp_params.quizResponses[4].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key:</i> %ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true
        //show_stim_with_feedback: false,
    };

    const quiz3 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (3/7) </strong></p>
        <p style="font-size:22px"> When should you make your choice? </p>
        <p> Press <b>`+exp_params.quizResponses[0] +`</b> if it is as soon as you make up your mind while viewing the options.</p>
        <p> Press <b>`+exp_params.quizResponses[1] +`</b> if it is never.</p>
        <p> Press <b>`+exp_params.quizResponses[2] +`</b> if it is when prompted by a green circle.</p>
        <p> Press <b>`+exp_params.quizResponses[3] +`</b> if it is when prompted by a yellow circle.</p>
        `,
        key_answer: exp_params.quizResponses[0],
        text_answer: exp_params.quizResponses[0].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key: </i>%ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true,
        choices: exp_params.quizResponses
    };


    const quiz4 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (4/7) </strong></p>
        <p style="font-size:22px"> On each trial, what option should you choose?</p>
        <p> Press <b>`+exp_params.quizResponses[0]+`</b> if it is always the option that gives you the highest possible reward.</p>
        <p> Press <b>`+exp_params.quizResponses[1]+`</b> if it is the option that you genuinely prefer.</p>
        <p> Press <b>`+exp_params.quizResponses[2].toLowerCase()+`</b> if it is the option that gives you the lowest reward.</p>
        <p> Press <b>`+exp_params.quizResponses[3]+`</b> if it is always the certain option.</p>
        `,
        key_answer: exp_params.quizResponses[1],
        text_answer: exp_params.quizResponses[1].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key: </i> %ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true,
        choices: exp_params.quizResponses
    };

    const quiz5 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (5/7) </strong></p>
        <p style="font-size:22px"> How should you treat each trial?</p>
        <p> Press <b>`+exp_params.quizResponses[0]+`</b> if it is 'Independently, though each trial depends on the previous.'</p>
        <p> Press <b>`+exp_params.quizResponses[1]+`</b> if it is 'Not independently, as each trial depends on the previous.'</p>
        <p> Press <b>`+exp_params.quizResponses[2]+`</b> if it is 'Not independently, as they all count.'</p>
        <p> Press <b>`+exp_params.quizResponses[3]+`</b> if it is 'Independently, and as if it were the only one that counts.'</p>
        `,
        key_answer: exp_params.quizResponses[3],
        text_answer: exp_params.quizResponses[3].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key: </i>%ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true,
        choices: exp_params.quizResponses
    };

    const quiz6 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (6/7) </strong></p>
        <p style="font-size:22px"> What will happen at the end of the experiment?</p>
        <p> Press <b>`+exp_params.quizResponses[0]+`</b> if it is 'Five of my choices will be selected at random and played out. The results will be added as a bonus to my compensation.'</p>
        <p> Press <b>`+exp_params.quizResponses[1]+`</b> if it is 'One of my choices will be selected at random and played out. The result will <i> not </i> be added as a bonus to my compensation.'</p>
        <p> Press <b>`+exp_params.quizResponses[2]+`</b> if it is 'Nothing.'</p>
        <p> Press <b>`+exp_params.quizResponses[3]+`</b> if it is 'One of my choices will be selected at random and played out. The result will be added as a bonus to my compensation.'</p>
        `,
        key_answer: exp_params.quizResponses[3],
        text_answer: exp_params.quizResponses[3].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key: </i>%ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true,
        choices: exp_params.quizResponses
    };

    const quiz7 = {
        type: "categorize-html",
        stimulus:  `
        <p style="color:orange"><strong> Comprehension Quiz (7/7) </strong></p>
        <p style="font-size:22px"> What does the grey bar on the lottery mean? </p>
        <p> Press <b>`+exp_params.quizResponses[0]+`</b> if it means that there are an unknown number of purple chips in the lottery.</p>
        <p> Press <b>`+exp_params.quizResponses[1]+`</b> if it means that there are an unknown number of blue chips in the lottery.</p>
        <p> Press <b>`+exp_params.quizResponses[2]+`</b> if it means that there are an unknown number of blue or red chips in the lottery.</p>
        <p> Press <b>`+exp_params.quizResponses[3]+`</b> if it means nothing.</p>
        `,
        key_answer: exp_params.quizResponses[2],
        text_answer: exp_params.quizResponses[2].bold(),
        correct_text: "<p class='center-content'><br><br>Correct. The correct key is %ANS%.</p>",
        incorrect_text: "<p class='center-content'><br><br><i>Incorrect. This prompt will remain on the screen till you press the correct key: </i>%ANS%.</p>",
        feedback_duration: 1000,
        force_correct_button_press: true,
        choices: exp_params.quizResponses
    };

    const endComprQuiz = {
        type: "html-keyboard-response",
        stimulus: `
        <p style="color:orange"><strong> Comprehension Quiz Complete! </strong></p><br>
        <p> You have successfully completed the comprehension quiz. </p><br>
        <p> You will now move on to some practice trials, which have the same format as described in the instructions.</p><br>
        <p> Remember to treat each trial independently! </p><br>
        <p><i>Press the <u>space bar</u> to continue.</p>
        `,
    choices: ['space']
    }

//#endregion

//#region Practice trials instructions  + Post-Practice Screen
const pracInstr = {
    type: "html-keyboard-response",
    stimulus:  `
    <p><strong> Practice Trials </strong></p>
    <p>Remember that these trials will <strong> not </strong> count as part of the actual task, they
    are for you to get used to how the task runs.</p> <br>
    <p> The images may flicker initially. This will stop after a few trials. </p><br>
    <p><i>There are a total of 14 practice trials.</i> </p><br>
    <p>Please place your fingers on the ` + exp_params.responses[0] + ` and ` + exp_params.responses[1] + ` keys.</p> <br>
    <p><i>Press either <strong>` + exp_params.responses[0] + `</strong> or <strong>` + exp_params.responses[1] + `</strong> to begin.</i></p>
    `,
    choices: exp_params.responses,
    response_ends_trial: true,
}

const postPracScreen = {
    //Display after practice trials successfully completed
    type: "html-keyboard-response",
    stimulus:  `
<p style="font-size:20px"><strong> Practice Complete! </strong></p> <br>
  <p> You have completed the practice trials. </p> <br>
  <p> You will now move on to the actual experiment, which will have exactly the same format, but with more trials.</p> <br>
  <p> Remember to treat each trial independently! There is no correct answer, choose whichever option you prefer!</p><br> 
  <p><i>Press either <strong>` + exp_params.responses[0] + `</strong> or <strong>` + exp_params.responses[1] + `</strong> to begin.</i></p>
`,
    choices: exp_params.responses,
};
//#endregion