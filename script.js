moneyCounter = {};

moneyCounter.buttonClicks = 0;

const $userGoalForm = `.setUserGoal`;
const $progressBar = $(`.progressBar`);
const $moneyToChangeInput = $(`#contribute`);
const $moneyFromGoal = $(`.untilGoal`);
const $commitmentForm = $(`form.commitment`);
const $timeUntilGoalStatement = $(`div.timeUntilGoal p`);

moneyCounter.numbersOnly = function(){
    $(`input`).bind(`keypress`, function(event) {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
    });
}

moneyCounter.setGoal = function(){
    $(`form${$userGoalForm}`).on(`submit`, function(event){
        event.preventDefault();

        const userGoal = parseInt($(`${$userGoalForm} input`).val());

        if (userGoal > 0) {
            $(`h2`).html(`$${userGoal}`);

            $(`${$userGoalForm} input`).addClass(`displayNone`);
            $(`${$userGoalForm} button`)
                .html(`Reset`)
                .addClass(`reset`);

            $(`.reset`).on(`click`, function () {
                location.reload(true);
            })
        } else {
            $(`h2`).empty();
            Swal.fire(`Please set a goal!`)
        }

        moneyCounter.AddOrSubtract(userGoal);  
        moneyCounter.setCommitment(userGoal);
    })
}


moneyCounter.AddOrSubtract = function(userGoal){
    $progressBar.html(`<progress value="0" max="${userGoal}"></progress>`);

    $(`button.add`).on(`click`, function(event){
        event.preventDefault();

        moneyCounter.buttonClicks++;

        let moneyToAdd = parseInt($($moneyToChangeInput).val());
        let moneyAdded = moneyToAdd * moneyCounter.buttonClicks;    
        let distanceFromGoal = userGoal - moneyAdded;
        
        if (distanceFromGoal <= 0) {
            Swal.fire(`Your goal of $${userGoal} has been reached!`)
            .then(function(){
                location.reload(true);
            })
        }
        
        moneyCounter.AddOrSubtractClick(moneyToAdd, moneyAdded, userGoal, distanceFromGoal);
    })

    
    $(`button.subtract`).on(`click`, function(event) {
        event.preventDefault();

        moneyCounter.buttonClicks--;

        let moneyToSubtract = parseInt($($moneyToChangeInput).val());
        let moneyAdded = moneyToSubtract * moneyCounter.buttonClicks;
        let distanceFromGoal = userGoal - moneyAdded;
        
        moneyCounter.AddOrSubtractClick(moneyToSubtract, moneyAdded, userGoal, distanceFromGoal);
    });
};

moneyCounter.AddOrSubtractClick = function(moneyChanged, moneyAdded, userGoal, distanceFromGoal){
    moneyCounter.warningMessage(moneyChanged, moneyAdded, userGoal);
    moneyCounter.setGoalMessage(userGoal, distanceFromGoal);
    moneyCounter.setCommitment(distanceFromGoal)
}

moneyCounter.warningMessage = function(moneyChanged, moneyAdded, userGoal) {
    if (isNaN(moneyChanged)) {
        Swal.fire(`Please enter a number!`)
        moneyCounter.buttonClicks = 0;
    } else {
        $progressBar.html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`);
    }
}

moneyCounter.setGoalMessage = function(userGoal, distanceFromGoal){
    if (distanceFromGoal <= userGoal) {
        $moneyFromGoal.html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😁</h3>`);
    } else {
        if (distanceFromGoal < userGoal * 1.5) {
            $moneyFromGoal.html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😕</h3>`);
        } else if (distanceFromGoal < userGoal * 5) {
            $moneyFromGoal.html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😭</h3>`);
        } else if (distanceFromGoal < userGoal * 10) {
            $moneyFromGoal.html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 🥵</h3>`);
        } else if (distanceFromGoal > userGoal * 10) {
            $moneyFromGoal.html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 💀</h3>`);
        }
    }
}

moneyCounter.setCommitment = function(distanceFromGoal){
    $commitmentForm
    .keyup(function(){
        $(`p`).removeClass(`displayNone`);
        moneyCounter.updateCompletionTime(distanceFromGoal);
    })
    .on(`click`, function () {
        moneyCounter.updateCompletionTime(distanceFromGoal);
    })
    .on(`submit`, function(event){
        event.preventDefault();
    })

    moneyCounter.updateCompletionTime(distanceFromGoal);
}

moneyCounter.updateCompletionTime = function(distanceFromGoal){
    let timeDivision = $(`select option:selected`).val();
    const commitmentValue = $(`input#setCommitment`).val();
    const commitmentTime = (distanceFromGoal / commitmentValue)

    const commitmentTimeDays = `It will take ${(commitmentTime).toFixed(2)} days | ${(commitmentTime / 7).toFixed(2)} weeks | ${(commitmentTime / 7 / 4.345).toFixed(2)} months`

    const commitmentTimeWeeks = `It will take ${(commitmentTime * 7).toFixed(2)} days | ${commitmentTime.toFixed(2)} weeks | ${(commitmentTime / 4.345).toFixed(2)} months`

    const commitmentTimeMonths = `It will take ${(commitmentTime * 7 * 4.345).toFixed(2)} days | ${(commitmentTime * 4.345).toFixed(2)} weeks | ${commitmentTime.toFixed(2)} months`

    if (commitmentValue > 0 && distanceFromGoal > 0) {
        if (timeDivision === `day`) {
            $timeUntilGoalStatement.html(commitmentTimeDays)
        } else if (timeDivision === `week`) {
            $timeUntilGoalStatement.html(commitmentTimeWeeks)
        } else {
            $timeUntilGoalStatement.html(commitmentTimeMonths)
        }
    } else {
        $timeUntilGoalStatement.empty();
    }
}


moneyCounter.init = function() {
    moneyCounter.numbersOnly();
    moneyCounter.setGoal();
    moneyCounter.setCommitment();
}

$(function(){
    moneyCounter.init();
});