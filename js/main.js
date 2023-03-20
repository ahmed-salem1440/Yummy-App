// Variables
let yummyData = document.getElementById("yummyData")
let search = document.getElementById("search")
let sbmtBtn;

let searchLi = document.getElementById("searchLi")
let CatLi = document.getElementById("CatLi")
let AreaLi = document.getElementById("AreaLi")
let IngrdsLi = document.getElementById("IngrdsLi")
let contactLi = document.getElementById("contactLi")

let isNameInputfocus = false
let isEmailInputfocus = false
let isPhoneInputfocus = false
let isAgeInputfocus = false
let isPassInputfocus = false
let isRePassInputfocus = false

let nameRegexValidation = /^[a-zA-Z ]+$/
let emailRegexValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let phoneRegexValidation = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
let ageRegexValidation = /^(0?[1-9]|[1-9][0-9]|[1][1-2][1-9]|130)$/ //for max age 130
let passwardRegexVAlidation = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //Minimum eight characters, at least one letter and one number
//home 
$(document).ready(()=>{
    nameSearch("").then(()=> {
        $(".loadingScreen").fadeTo(500,0)
        $("body").css("overflow", "visible")
    })
})
//Add Eventns to Lis
searchLi.addEventListener("click", ()=>{
    displaySearchInputs()
    closeNav()
})
CatLi.addEventListener("click", ()=>{
    getMealsCategories()
    closeNav()
})
AreaLi.addEventListener("click", ()=>{
    getByArea()
    closeNav()
})
IngrdsLi.addEventListener("click", ()=>{
    getMealIngredients()
    closeNav()
})
contactLi.addEventListener("click", ()=>{
    displaySignUpInputs()
    closeNav()
})
// Side Nav 
function openNav(){
    $(".sideNavbar").animate({
        left:0
    },500)
    $("#openClosedIcon").removeClass("fa-bars")
    $("#openClosedIcon").addClass("fa-xmark")

    for(let i =0 ; i < 5; i++){
        timer = (i+5) *150
        $('.navlink').eq(i).animate({top:0},timer)

    }
}
function closeNav(){
let transMenuWidth = $('.sideNavbar .transPart').outerWidth()
$('.sideNavbar').animate({
    left: -transMenuWidth
},500)
$("#openClosedIcon").removeClass("fa-xmark")
$("#openClosedIcon").addClass("fa-bars")

$('.navlink').animate({
    top: 300
},500)
}

closeNav()

$('#openClosedIcon').click(()=>{
    if ($('.sideNavbar').css('left') == '0px'){
        closeNav()
    }else{
        openNav()
    }
})

// Meals functions

function displayMeals(meals){
    let cards = ``
    for (let i =0 ; i < meals.length ; i++){
        cards +=`
        <div class="col-md-3 col-sm-6">
            <div onclick="getDetailsById('${meals[i].idMeal}')" class="mealCard position-relative overflow-hidden rounded-2 pointer">
                <img class="w-100" src="${meals[i].strMealThumb}" alt="" >
                <div class="MealLayer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `
    }

    yummyData.innerHTML = cards
}

// Get Categories

async function getMealsCategories(){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    search.innerHTML = ""
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    let mealsJSON = await response.json()
    displayMealsCategories(mealsJSON.categories)
    $(".loadingScreen").fadeTo(300,0);

    

}

// display categories 

function displayMealsCategories(cats){
    let cards = ""
    for(i = 0 ; i<cats.length;i++){
        let catDisc = cats[i].strCategoryDescription.split(" ").slice(0,20)
        cards += `
        <div class="col-md-3 col-sm-6">
            <div onclick="getMealsByCat('${cats[i].strCategory}')" class="mealCard position-relative overflow-hidden rounded-2 pointer">
                <img class="w-100" src="${cats[i].strCategoryThumb}" alt="" >
                <div class="MealLayer position-absolute text-center text-black p-2">
                    <h3>${cats[i].strCategory}</h3>
                    
                    <p>${cats[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        </div>
        `
    }
    yummyData.innerHTML = cards
}
// get by area 
async function getByArea(){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    search.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let areaJSON = await response.json()
    displayByArea(areaJSON.meals)
    $(".loadingScreen").fadeTo(300,0);
}
// Display by Area 
function displayByArea(areaArr){
    let cards = ``
    for(i=0; i<areaArr.length; i++){
        cards += `
        <div class="col-md-3 col-sm-6">
        <div onclick="getByAreaMeals('${areaArr[i].strArea}')" class="text-center rounded-2 pointer">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${areaArr[i].strArea}</h3>
        </div>
    </div>`
    }
    yummyData.innerHTML = cards
}
// get ingredients 
async function getMealIngredients(){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    search.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let ingredientsJSON = await response.json()
    displayMealIngredients(ingredientsJSON.meals.slice(0,20))
    $(".loadingScreen").fadeTo(300,0);
}
// display Ingredients 
function displayMealIngredients(IngrdsArr){
    let ingrds = ``
    for (let i=0; i<IngrdsArr.length; i++){
        let mealDescrp = IngrdsArr[i].strDescription.split(" ").slice(0,20)
        ingrds+= `
        <div class="col-md-3 col-sm-6">
            <div onclick="getByIngrdsMeals('${IngrdsArr[i].strIngredient}')" class="text-center rounded-2 pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${IngrdsArr[i].strIngredient}</h3>
                <p>${mealDescrp.join(" ")}</p>
            </div>
        </div>
        `
    }
    yummyData.innerHTML = ingrds
}

// get by categories
async function getMealsByCat(category){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let catJSON = await response.json()
    displayMeals(catJSON.meals.slice(0,20))
    $(".loadingScreen").fadeTo(300,0);

}

// get Meals By area
async function getByAreaMeals(area){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let areaMealsJSON = await response.json()
    displayMeals(areaMealsJSON.meals.slice(0,20))
    $(".loadingScreen").fadeTo(300,0);
    
}   

// get by Ingredients
async function getByIngrdsMeals(ingrds){
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrds}`)
    let ingrdsJSON = await response.json()
    displayMeals(ingrdsJSON.meals.slice(0,20))
    $(".loadingScreen").fadeTo(300,0);
    
}

// get by meal ID

async function getDetailsById(mealId){
    closeNav()
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    search.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let mealsJSON =await response.json()

    displayDetails(mealsJSON.meals[0])
    $(".loadingScreen").fadeTo(300,0);

}

// display details by meal
function displayDetails(meal){
    search.innerHTML = ""
    let ingrds = ``
    for (let i = 1 ; i<21; i++){
        if(meal[`strIngredient${i}`]){
            ingrds += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if(!tags) {
        tags = []
    }
    let tagsStr = ``
    for(let i = 0 ; i<tags.length ; i++){
        tagsStr +=`
        <li class = "alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let card = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}"alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingrds}
        </ul>

        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
        </ul>

        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`
    yummyData.innerHTML = card

}

// show search inputs 
function displaySearchInputs(){
    search.innerHTML = `
    <div class="searchCard row py-4">
            <div class="col-md-6">
                <input oninput="nameSearch(this.value)" type="text" placeholder="Search By Name" class="searchInput form-control bg-transparent text-white">
            </div>
            <div class="col-md-6">
                <input oninput="firstLetterSearch(this.value)" class="searchInput form-control bg-transparent text-white" type="text" placeholder="Search By First Letter" maxlength="1">
            </div>
        </div>
    `
    yummyData.innerHTML = ""

}
// search by name
async function nameSearch(name){
    closeNav()
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let resultJSON = await response.json()
    if(resultJSON.meals){
        displayMeals(resultJSON.meals)
    }else{
        displayMeals([])
    }
    $(".loadingScreen").fadeTo(300,0);

}
async function firstLetterSearch(firstLetter){
    closeNav()
    yummyData.innerHTML = ""
    $(".loadingScreen").fadeTo(300,1);
    if(firstLetter == ""){
        firstLetter = "a"
    }
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    let resultJSON = await response.json()

    if(resultJSON.meals){
        displayMeals(resultJSON.meals)
    }else{
        displayMeals([])
    }
    $(".loadingScreen").fadeTo(300,0);

}

function displaySignUpInputs(){
    search.innerHTML = ``
    yummyData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="inputName" class="form-control" placeholder="Your Name" type="text">
                <div id="nameAlert" class="alert alert-danger w-100 my-2 d-none">
                    Special Characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="inputEmail" type="email" placeholder="Your Email" class="form-control">
                <div id="emailAlert" class="alert alert-danger w-100 my-2 d-none">
                    Email not valid *example@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input type="text" name="" id="mobileInput" class="form-control" placeholder="Your Phone Number">
                <div id="mobileAlert" class="alert alert-danger w-100 my-2 d-none">
                    Enter a valid phone number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" class="form-control" placeholder="Your Age" type="number">
                <div id="ageAlert" class="alert alert-danger w-100 my-2 d-none">
                    Enter a valid age
                </div>
            </div>
            <div class="col-md-6">
                <input type="password" id="passInput" class="form-control" placeholder="Enter Your Password">
                <div class="alert alert-danger w-100 my-2 d-none" id="passAlert">
                    Enter a valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="rePassInput" class="form-control" placeholder="Rewrite Your Password" type="password">
                <div class="alert alert-danger w-100 my-2 d-none" id="rePassAlert">
                    Enter a valid password
                </div>
            </div>
        </div>
        <button id="sbmtBtn" disabled class="btn btn-outline-danger px-2 m-3 " >Submit</button>
    </div>
</div>

    `
    sbmtBtn = document.getElementById("sbmtBtn")
    document.getElementById("inputName").addEventListener("focus",()=>{
        isNameInputfocus = true
    })
    document.getElementById("inputEmail").addEventListener("focus",()=>{
        isEmailInputfocus = true
    })
    document.getElementById("mobileInput").addEventListener("focus",()=>{
        isPhoneInputfocus = true
    })
    document.getElementById("ageInput").addEventListener("focus",()=>{
        isAgeInputfocus = true
    })
    document.getElementById("passInput").addEventListener("focus",()=>{
        isPassInputfocus = true
    })
    document.getElementById("rePassInput").addEventListener("focus",()=>{
        isRePassInputfocus = true
    })

//add Events to contact inputs
    document.getElementById("inputName").addEventListener("input",()=>{
        contactValidation()
    })
    document.getElementById("inputEmail").addEventListener("input",()=>{
        contactValidation()
    })
    document.getElementById("mobileInput").addEventListener("input",()=>{
        contactValidation()
    })
    document.getElementById("ageInput").addEventListener("input",()=>{
        contactValidation()
    })
    document.getElementById("passInput").addEventListener("input",()=>{
        contactValidation()
    })
    document.getElementById("rePassInput").addEventListener("input",()=>{
        contactValidation()
    })

}
function nameValidation(){
    let inputName = document.getElementById("inputName")
    return (nameRegexValidation.test(inputName.value))
}
function emailValidation(){
    let inputEmail = document.getElementById("inputEmail")
    return (emailRegexValidation.test(inputEmail.value))
}
function phoneValidation(){
    let mobileInput = document.getElementById("mobileInput")
    return (phoneRegexValidation.test(mobileInput.value))
}
function ageValidation(){
    let ageInput = document.getElementById("ageInput")
    return (ageRegexValidation.test(ageInput.value))
}
function passwardValidation(){
    let passInput = document.getElementById("passInput")
    return (passwardRegexVAlidation.test(passInput.value))
}
function rePasswardValidation(){
    let passInput = document.getElementById("passInput")
    let rePassInput = document.getElementById("rePassInput")
    return (rePassInput.value == passInput.value)
    
}
function contactValidation(){
    let nameAlert = document.getElementById("nameAlert")
    if(isNameInputfocus){
        if(nameValidation()){
            nameAlert.classList.replace("d-block", "d-none")
        }else{
            nameAlert.classList.replace("d-none","d-block")
        }
    }

    let emailAlert = document.getElementById("emailAlert")
    if(isEmailInputfocus){
        if(emailValidation()){
            emailAlert.classList.replace("d-block", "d-none")
        }else{
            emailAlert.classList.replace("d-none","d-block")
        }
    }

    let mobileAlert = document.getElementById("mobileAlert")
    if(isPhoneInputfocus){
        if(phoneValidation()){
            mobileAlert.classList.replace("d-block", "d-none")
        }else{
            mobileAlert.classList.replace("d-none","d-block")
        }
    }

    let ageAlert = document.getElementById("ageAlert")
    if(isAgeInputfocus){
        if(ageValidation()){
            ageAlert.classList.replace("d-block", "d-none")
        }else{
            ageAlert.classList.replace("d-none","d-block")
        }
    }

    let passAlert = document.getElementById("passAlert")
    if(isPassInputfocus){
        if(passwardValidation()){
            passAlert.classList.replace("d-block", "d-none")
        }else{
            passAlert.classList.replace("d-none","d-block")
        }
    }

    let rePassAlert = document.getElementById("rePassAlert")
    if(isRePassInputfocus){
        if(rePasswardValidation()){
            rePassAlert.classList.replace("d-block", "d-none")
        }else{
            rePassAlert.classList.replace("d-none","d-block")
        }
    }

    if (nameValidation() &&
    emailValidation() &&
    phoneValidation()&&
    ageValidation() &&
    passwardValidation()&&
    rePasswardValidation()
    ){
        sbmtBtn.removeAttribute("disabled")
    }else {
        sbmtBtn.setAttribute("disabled",true)
    }
}



