moneyCounter = {};

moneyCounter.buttonClicks = 0;

document.querySelector("input").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
    }
});

moneyCounter.setGoal = function(){
    $('form.setUserGoal').on("submit", function(event){
        event.preventDefault();

        const userGoal = parseInt($('.setUserGoal input').val());

        if (userGoal > 0) {
            $('h2').html(`$${userGoal}`);
        } else {
            $('h2').empty();
        }

        moneyCounter.setCommitment(userGoal);
        moneyCounter.AddOrSubtract(userGoal);

        $('.setUserGoal input').addClass("displayNone");
        $('.setUserGoal button')
            .html("Reset")
            .addClass("reset");

        $('.reset').on("click", function(){
            location.reload(true);
        })
        
    })
}

moneyCounter.AddOrSubtract = function(userGoal){
    $(".progressBar").html(`<progress value="0" max="${userGoal}"></progress>`);

    $('button.add').on("click", function(event){
        event.preventDefault();
        moneyCounter.buttonClicks++;

        const moneyToAdd = parseInt($('#contribute').val());

        let moneyAdded = moneyToAdd * moneyCounter.buttonClicks;
        
        if (isNaN(moneyToAdd)) {
            Swal.fire(`Please enter a number!`)
            moneyCounter.buttonClicks = 0;
        } else {
            $(".progressBar").html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`); 
        }

        let distanceFromGoal = userGoal - moneyAdded;

        if (distanceFromGoal <= 0) {
            Swal.fire(`Your goal of $${userGoal} has been reached!`)
            .then(function(){
                location.reload(true);
            })
        }
        
        moneyCounter.setCommitment(distanceFromGoal);
        moneyCounter.setGoalMessage(userGoal, distanceFromGoal);
    })

    
    $('button.subtract').on("click", function(event) {
        event.preventDefault();
        moneyCounter.buttonClicks--;

        const moneyToSubtract = parseInt($('#contribute').val());
        let moneyAdded = moneyToSubtract * moneyCounter.buttonClicks;
        
        if (isNaN(moneyToSubtract)) {
            Swal.fire(`Please enter a number!`)
            moneyCounter.buttonClicks = 0;
        } else {
            $(".progressBar").html(`<progress value="${moneyAdded}" max="${userGoal}"></progress>`);
        }

        let distanceFromGoal = userGoal - moneyAdded;

        moneyCounter.setCommitment(distanceFromGoal)
        moneyCounter.setGoalMessage(userGoal, distanceFromGoal);
    });
};

moneyCounter.setGoalMessage = function(userGoal, distanceFromGoal){
    if (distanceFromGoal <= userGoal) {
        $(".untilGoal").html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😁</h3>`);
    } else {
        if (distanceFromGoal < userGoal * 1.5) {
            $(".untilGoal").html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😕</h3>`);
        } else if (distanceFromGoal < userGoal * 5) {
            $(".untilGoal").html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 😭</h3>`);
        } else if (distanceFromGoal < userGoal * 10) {
            $(".untilGoal").html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 🥵</h3>`);
        } else if (distanceFromGoal > userGoal * 10) {
            $(".untilGoal").html(`<h3>You are $${distanceFromGoal} away from reaching your goal! 💀</h3>`);
        }
    }
}

moneyCounter.setCommitment = function(distanceFromGoal){
    $('form.commitment').keyup(function(){
        
        $('p').removeClass("displayNone");

        let timeDivision = $('select option:selected').val();
        
        const commitmentValue = $('input#setCommitment').val();
        const commitmentDays = (distanceFromGoal / commitmentValue)
        const commitmentWeeks = (distanceFromGoal / commitmentValue / 7)
        const commitmentMonths = (distanceFromGoal / commitmentValue / 7 / 4.345)

        const commitmentTime = `It will take ${commitmentDays} days | ${commitmentWeeks} weeks | ${commitmentMonths} months`

        const commitmentTimeWeek = `It will take ${commitmentDays * 7} days | ${commitmentWeeks * 7} weeks | ${commitmentMonths * 7} months`

        const commitmentTimeMonth = `It will take ${commitmentDays * 7 * 4.345} days | ${commitmentWeeks * 7 * 4.345} weeks | ${commitmentMonths * 7 * 4.345} months`

        if (commitmentValue > 0 && distanceFromGoal > 0){
            if (timeDivision === "day") {
                $('div.timeUntilGoal p').html(commitmentTime);
            } else if (timeDivision === "week") {
                $('div.timeUntilGoal p').html(commitmentTimeWeek);
            } else {
                $('div.timeUntilGoal p').html(commitmentTimeMonth);
            }
        } else {
            $('div.timeUntilGoal p').empty();
        }
    })

    $('form.commitment').on("submit", function(event){
        event.preventDefault();
    })

    // 

    $('form.commitment').on("click", function(){
        let timeDivision = $('select option:selected').val();

        const commitmentValue = $('input#setCommitment').val();
        const commitmentDays = (distanceFromGoal / commitmentValue)
        const commitmentWeeks = (distanceFromGoal / commitmentValue / 7)
        const commitmentMonths = (distanceFromGoal / commitmentValue / 7 / 4.345)

        const commitmentTime = `It will take ${commitmentDays} days | ${commitmentWeeks} weeks | ${commitmentMonths} months`

        const commitmentTimeWeek = `It will take ${commitmentDays * 7} days | ${commitmentWeeks * 7} weeks | ${commitmentMonths * 7} months`

        const commitmentTimeMonth = `It will take ${commitmentDays * 7 * 4.345} days | ${commitmentWeeks * 7 * 4.345} weeks | ${commitmentMonths * 7 * 4.345} months`

        if (commitmentValue > 0 && distanceFromGoal > 0) {
            if (timeDivision === "day") {
                $('div.timeUntilGoal p').html(commitmentTime);
            } else if (timeDivision === "week") {
                $('div.timeUntilGoal p').html(commitmentTimeWeek);
            } else {
                $('div.timeUntilGoal p').html(commitmentTimeMonth);
            }
        } else {
            $('div.timeUntilGoal p').empty();
        }
    })


    // 
    let timeDivision = $('select option:selected').val();
    const commitmentValue = $('input#setCommitment').val();
    const commitmentDays = (distanceFromGoal / commitmentValue)
    const commitmentWeeks = (distanceFromGoal / commitmentValue / 7)
    const commitmentMonths = (distanceFromGoal / commitmentValue / 7 / 4.345)

    const commitmentTime = `It will take ${commitmentDays} days | ${commitmentWeeks} weeks | ${commitmentMonths} months`

    const commitmentTimeWeek = `It will take ${commitmentDays * 7} days | ${commitmentWeeks * 7} weeks | ${commitmentMonths * 7} months`

    const commitmentTimeMonth = `It will take ${commitmentDays * 7 * 4.345} days | ${commitmentWeeks * 7 * 4.345} weeks | ${commitmentMonths * 7 * 4.345} months`

    if (commitmentValue > 0 && distanceFromGoal > 0) {
        if (timeDivision === "day") {
            $('div.timeUntilGoal p').html(commitmentTime);
        } else if (timeDivision === "week") {
            $('div.timeUntilGoal p').html(commitmentTimeWeek);
        } else {
            $('div.timeUntilGoal p').html(commitmentTimeMonth);
        }
    } else {
        $('div.timeUntilGoal p').empty();
    }
}

// 

moneyCounter.init = function() {
    moneyCounter.setGoal();
    moneyCounter.setCommitment();
}

$(function(){
    moneyCounter.init();
});