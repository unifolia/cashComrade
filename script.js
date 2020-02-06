moneyCounter = {}

let moneyAdded = 0

let $userGoalForm = `.setUserGoal`
let $progressBar = $(`.progressBar`)
let $moneyToChangeInput = $(`#contribute`)
let $moneyFromGoal = $(`.untilGoal`)
let $commitmentForm = $(`form.commitment`)
let $timeUntilGoalStatement = $(`div.timeUntilGoal p`)

moneyCounter.numbersOnly = () => {
    $(`input`).bind(`keypress`, e => {
        if (e.which < 48 || event.which > 57) {
            e.preventDefault()
        }
    })
}

moneyCounter.setGoal = () => {
    $(`form${$userGoalForm}`).on(`submit`, e => {
        e.preventDefault()

        const userGoal = parseInt($(`${$userGoalForm} input`).val())

        if (userGoal > 0) {
            $(`h2`).html(`Your goal is $${userGoal}`)

            $(`${$userGoalForm} input`)
                .addClass(`greyedOut`)
                .prop(`disabled`, true)

            $(`${$userGoalForm} button`)
                .html(`Reset`)
                .addClass(`reset`)

            $(`.reset`).on(`click`, () => {
                location.reload(true)
            })
        } else {
            $(`h2`).empty();
            Swal.fire(`Please set a goal!`)
        };

        moneyCounter.AddOrSubtract(userGoal)
        moneyCounter.setCommitment(userGoal)
    })
}


moneyCounter.AddOrSubtract = userGoal => {
    $progressBar.html(`<progress value="0" max="${userGoal}"></progress>`)

    $(`button.add`).on(`click`, e => {
        e.preventDefault();

        let moneyToAdd = parseInt($($moneyToChangeInput).val())

        if (isNaN(moneyToAdd)) {
            moneyToAdd = 0;
        }

        moneyAdded = moneyAdded + moneyToAdd
        let distanceFromGoal = userGoal - moneyAdded

        if (distanceFromGoal <= 0) {
            Swal.fire(`Your goal of $${userGoal} has been reached!`)
                .then(() => {
                    location.reload(true)
                })
        }

        if (moneyToAdd === 0) {
            Swal.fire(`Please enter a number!`)
        } else {
            $progressBar.html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`)
            moneyCounter.AddOrSubtractClick(userGoal, distanceFromGoal)
        }
    })


    $(`button.subtract`).on(`click`, e => {
        e.preventDefault();

        let moneyToSubtract = parseInt($($moneyToChangeInput).val());

        if (isNaN(moneyToSubtract)) {
            moneyToSubtract = 0;
        }

        moneyAdded = moneyAdded - moneyToSubtract;
        let distanceFromGoal = userGoal - moneyAdded;

        if (moneyToSubtract === 0) {
            Swal.fire(`Please enter a number!`)
        } else {
            $progressBar.html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`);
            moneyCounter.AddOrSubtractClick(userGoal, distanceFromGoal)
        }
    })
}

moneyCounter.AddOrSubtractClick = (userGoal, distanceFromGoal) => {
    moneyCounter.setGoalMessage(userGoal, distanceFromGoal)
    moneyCounter.setCommitment(distanceFromGoal)
}

moneyCounter.setGoalMessage = (userGoal, distanceFromGoal) => {
    if (distanceFromGoal <= userGoal) {
        $moneyFromGoal.html(`<h3>You have $${userGoal - distanceFromGoal}. You are $${distanceFromGoal} away from reaching your goal! 😁</h3>`)
    } else {
        if (distanceFromGoal < userGoal * 1.5) {
            $moneyFromGoal.html(`<h3>You're in debt! You are $${distanceFromGoal} away from reaching your goal! 😕</h3>`)
        } else if (distanceFromGoal < userGoal * 5) {
            $moneyFromGoal.html(`<h3>You're in debt!! You are $${distanceFromGoal} away from reaching your goal! 😭</h3>`)
        } else if (distanceFromGoal < userGoal * 10) {
            $moneyFromGoal.html(`<h3>You're in debt!!! You are $${distanceFromGoal} away from reaching your goal! 🥵</h3>`)
        } else if (distanceFromGoal > userGoal * 10) {
            $moneyFromGoal.html(`<h3>Oh, my heavens!!!! You are $${distanceFromGoal} away from reaching your goal! 💀</h3>`)
        }
    }
}

moneyCounter.setCommitment = distanceFromGoal => {
    $commitmentForm
        .keyup(() => {
            $(`p`).removeClass(`displayNone`)
            moneyCounter.updateCompletionTime(distanceFromGoal)
        })
        .on(`click`, () => {
            moneyCounter.updateCompletionTime(distanceFromGoal)
        })
        .on(`submit`, e => {
            e.preventDefault()
        })

    moneyCounter.updateCompletionTime(distanceFromGoal)
}

moneyCounter.updateCompletionTime = distanceFromGoal => {
    let timeDivision = $(`select option:selected`).val()
    let commitmentValue = $(`input#setCommitment`).val()
    let commitmentTime = (distanceFromGoal / commitmentValue)

    let commitmentTimeDays = `It will take 
    ${(commitmentTime).toFixed(2)} days | 
    ${(commitmentTime / 7).toFixed(2)} weeks | 
    ${(commitmentTime / 7 / 4.345).toFixed(2)} months`

    let commitmentTimeWeeks = `It will take 
    ${(commitmentTime * 7).toFixed(2)} days | 
    ${commitmentTime.toFixed(2)} weeks | 
    ${(commitmentTime / 4.345).toFixed(2)} months`

    let commitmentTimeMonths = `It will take 
    ${(commitmentTime * 7 * 4.345).toFixed(2)} days | 
    ${(commitmentTime * 4.345).toFixed(2)} weeks | 
    ${commitmentTime.toFixed(2)} months`

    if (commitmentValue > 0 && distanceFromGoal > 0) {
        if (timeDivision === `day`) {
            $timeUntilGoalStatement.html(commitmentTimeDays)
        } else if (timeDivision === `week`) {
            $timeUntilGoalStatement.html(commitmentTimeWeeks)
        } else {
            $timeUntilGoalStatement.html(commitmentTimeMonths)
        }
    } else {
        $timeUntilGoalStatement.empty()
    }
}


moneyCounter.init = () => {
    moneyCounter.numbersOnly()
    moneyCounter.setGoal()
    moneyCounter.setCommitment()
}

$(() => {
    moneyCounter.init()
})