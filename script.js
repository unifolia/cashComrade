moneyCounter = {};

moneyCounter.buttonClicks = 0;

document.querySelector("input").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
    }
});

moneyCounter.setGoal = function(){
    $('form.setUserGoal').keyup(function(){
        const userInput = $('input').val();
        
        if (userInput !== '') {
            $('h2').html(`$${userInput}`);
        } else {
            $('h2').empty();
        }

        $('.progressBar').html(`<progress value="0" max="${userInput}"></progress>`)

        moneyCounter.setCommitment(userInput);
    });

    $('form.setUserGoal').on("submit", function(event){
        event.preventDefault();

        // Change const name so it's different value
        const userInput = $('input').val();

        moneyCounter.AddOrSubtract(userInput);
        moneyCounter.setCommitment(userInput);

        $('.setUserGoal input').val('')
        console.log(moneyCounter.buttonClicks, 'sg sub');

    })
}

moneyCounter.AddOrSubtract = function(userInput){
    $('button.add').on("click", function(event){
        event.preventDefault();
        moneyCounter.buttonClicks = moneyCounter.buttonClicks + 1;

        const myValue = $('#contribute').val();
        const myValueNumber = parseInt(myValue);

        let progressBarUpdate = myValueNumber * moneyCounter.buttonClicks;
        
        console.log(myValueNumber);
        console.log(moneyCounter.buttonClicks);
        console.log(progressBarUpdate);
        $(".progressBar").html(`<progress value="${progressBarUpdate}" max="${userInput}"></progress>`);    
    })

    
    // $('button.subtract').on("click", function (event) {
        //     event.preventDefault();
        //     const myValue = $('#contribute').val();
        //     console.log(myValue);
        //     $('.progressBar').html(`<progress value="20" max="${userInput}"></progress>`)
        // })
    };

moneyCounter.setCommitment = function(userInput){
    $('form.commitment').keyup(function(){

        $('p').removeClass("displayNone");

        const commitmentValue = $('input#setCommitment').val();
        const commitmentDays = (userInput / commitmentValue).toFixed(2)
        const commitmentWeeks = (userInput / commitmentValue / 7).toFixed(2)
        const commitmentMonths = (userInput / commitmentValue / 7 / 4.345).toFixed(2);


        const commitmentTime = `It will take ${commitmentDays} days | ${commitmentWeeks} weeks | ${commitmentMonths} months`

        if (commitmentValue > 0 && userInput > 0){
            $('div.timeUntilGoal p').html(commitmentTime);
        } else {
            $('div.timeUntilGoal p').empty();
        }
    })

    $('form.commitment').on("submit", function(event){
        event.preventDefault();
    })

    const commitmentValue = $('input#setCommitment').val();
    const commitmentDays = (userInput / commitmentValue).toFixed(2)
    const commitmentWeeks = (userInput / commitmentValue / 7).toFixed(2)
    const commitmentMonths = (userInput / commitmentValue / 7 / 4.345).toFixed(2);
    
    const commitmentTime = `It will take ${commitmentDays} days | ${commitmentWeeks} weeks | ${commitmentMonths} months`

    if (commitmentValue > 0 && userInput > 0){
        $('div.timeUntilGoal p').html(commitmentTime);
    } else {
        $('div.timeUntilGoal p').empty();
    }
}

// 

moneyCounter.init = function() {
    moneyCounter.setGoal();
    // moneyCounter.AddOrSubtract();
    moneyCounter.setCommitment();
}

$(function(){
    moneyCounter.init();
});