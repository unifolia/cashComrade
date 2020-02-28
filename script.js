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

moneyCounter.formatNum = number => {
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
            $(`h2`).html(`Your goal is $${moneyCounter.formatNum(userGoal)}`)

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
    let currentMoney = moneyCounter.formatNum(userGoal - distanceFromGoal)
    let distanceWithComma = moneyCounter.formatNum(distanceFromGoal)

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
        Swal.fire(`Your goal of $${moneyCounter.formatNum(userGoal)} has been reached!`)
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

    let commitmentMessage = (days, weeks, months) => {
        $timeUntilGoalStatement.html(
            `It will take ${days} days | ${weeks} weeks | ${months} months`
        )
    } 

    if (commitmentValue > 0 && distanceFromGoal > 0) {
        if (timeDivision === `day`) {
            commitmentMessage(
                moneyCounter.formatNum(commitmentTime), 
                moneyCounter.formatNum((commitmentTime / 7)), 
                moneyCounter.formatNum((commitmentTime / 7 / 4.345))
            )
        } else if (timeDivision === `week`) {
            commitmentMessage(
                moneyCounter.formatNum(commitmentTime * 7),
                moneyCounter.formatNum(commitmentTime),
                moneyCounter.formatNum(commitmentTime / 4.345)
            )
        } else {
            commitmentMessage(
                moneyCounter.formatNum(commitmentTime * 7 * 4.345),
                moneyCounter.formatNum(commitmentTime * 4.345),
                moneyCounter.formatNum(commitmentTime)
            )
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