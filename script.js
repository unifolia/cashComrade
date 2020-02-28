moneyCounter = {}

let userGoal = 0
let moneyToChange = 0
let moneyAdded = 0
let distanceFromGoal = 0
let goalSet = false

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

moneyCounter.addComma = number => {
    return number.toLocaleString()
}

moneyCounter.addReset = () => {
    $(`${$userGoalForm} input`)
        .addClass(`greyedOut`)
        .prop(`disabled`, true)

    $(`${$userGoalForm} button`)
        .html(`Reset`)
        .addClass(`reset`)

    $(`.reset`).on(`click`, () => {
        location.reload(true)
    })
}

moneyCounter.setGoal = () => {
    $(`form${$userGoalForm}`).on(`submit`, e => {
        e.preventDefault()

        userGoal = parseInt($(`${$userGoalForm} input`).val())

        if (userGoal > 0) {
            $(`h2`).html(`Your goal is $${moneyCounter.addComma(userGoal)}`)

            $progressBar.html(`<progress value="0" max="${userGoal}"></progress>`)

            moneyCounter.addReset()
        } else {
            $(`h2`).empty();
            Swal.fire(`Please set a goal!`)
        };

        goalSet = true
        moneyCounter.setCommitment(userGoal)
    })
}

moneyCounter.AddOrSubtract = () => {
    $(`.formControls button`).on(`click`, e => {
        e.preventDefault()

        if (goalSet == true) {
            let inputVal = parseInt($($moneyToChangeInput).val())

            if (isNaN(inputVal) == false) {
                if (e.currentTarget.id == "subtract") {
                    moneyToChange = -Math.abs(inputVal)
                } else {
                    moneyToChange = inputVal
                }

                moneyAdded += moneyToChange

                distanceFromGoal = userGoal - moneyAdded

                moneyCounter.updateProgressBar(userGoal, moneyAdded, distanceFromGoal)
                moneyCounter.checkGoal()
                moneyCounter.setCommitment(distanceFromGoal)
            } else {
                Swal.fire(`Please enter a number!`)
            }
        } else {
            Swal.fire(`Please set your goal first!`)
        }
    })
}

moneyCounter.updateProgressBar = (userGoal, moneyAdded, distanceFromGoal) => {
    $progressBar.html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`)

    moneyCounter.setGoalMessage(userGoal, distanceFromGoal)
}

moneyCounter.setGoalMessage = (userGoal, distanceFromGoal) => {
    let currentMoney = moneyCounter.addComma(userGoal - distanceFromGoal)
    let distanceWithComma = moneyCounter.addComma(distanceFromGoal)

    if (distanceFromGoal <= userGoal) {
        $moneyFromGoal.html(`<h3>You have $${currentMoney}. You are $${distanceWithComma} away from reaching your goal! 😁</h3>`)
    } else {
        if (distanceFromGoal < userGoal * 1.5) {
            $moneyFromGoal.html(`<h3>You're in debt! You are $${distanceWithComma} away from reaching your goal! 😕</h3>`)
        } else if (distanceFromGoal < userGoal * 5) {
            $moneyFromGoal.html(`<h3>You're in debt!! You are $${distanceWithComma} away from reaching your goal! 😭</h3>`)
        } else if (distanceFromGoal < userGoal * 10) {
            $moneyFromGoal.html(`<h3>You're in debt!!! You are $${distanceWithComma} away from reaching your goal! 🥵</h3>`)
        } else if (distanceFromGoal > userGoal * 10) {
            $moneyFromGoal.html(`<h3>Oh, my heavens!!!! You are $${distanceWithComma} away from reaching your goal! 💀</h3>`)
        }
    }
}

moneyCounter.checkGoal = () => {
    if (distanceFromGoal <= 0) {
        Swal.fire(`Your goal of $${moneyCounter.addComma(userGoal)} has been reached!`)
            .then(() => {
                location.reload(true)
            })
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
    moneyCounter.AddOrSubtract()
    moneyCounter.setGoal()
    moneyCounter.setCommitment()
}

$(() => {
    moneyCounter.init()
})