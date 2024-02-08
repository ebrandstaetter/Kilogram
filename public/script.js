generateAllrecipes();

function generateAllrecipes() {

    fetch('http://localhost:3000/getAllPosts')
        .then(response => response.json())
        .then(recipes => {
            console.log(recipes);
            document.querySelector(".feed").innerHTML = generatePostsHtml(recipes);
        })
        .catch(err => console.log(err));
}

function generatePostsHtml(recipes) {
    let recipesHTML = "";

    for (let i = 0; i < recipes.posts.length; i++) {
        let recipe = recipes.posts[i];
        let tagsHTML = generateTagsHtml(recipe);

        let ingredientsHTML = generateIngredientsHtmlSmallView(recipe.ingredients);
         //TODO: Add rating mechanic
          //TODO: Add image upload instead of URL input

        //TODO: image upload function
        /*var loadFile = function(event) {
            var image = document.getElementById('postImage'+recipe.id);
            image.style.backgroundImage = url();//event.target.files[0]; //image.src = URL.createObjectURL(event.target.files[0]);
        };*/

        let recipeHTML = `<div id="postCard${recipe.id}" class="postCard" onclick="detailView(this, ${recipe.id})">
            <div class="postImage" id="postImage${recipe.id}" style="background-image: url(./img/data/${recipe.imgLink}.jpg);"></div>

            <div class="postContent">
                <h1 class="postTitle editable">${recipe.title}</h1>
                <div class="interaction-heading">
                <div class="postRating">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                </div>
                    <img class="postBookmark" id="false" src="img/icons/bookmark.svg" onclick="changePostSavestate(this)" onmouseenter="changePostSavestate(this)" onmouseleave="changePostSavestate(this)">
                </div>
                <p class="postDescription editable">${recipe.description}</p>
                <h2>Ingredients:</h2>
                <p class="postIngredients editable">${ingredientsHTML}</p>
                <div class="postPreparation"></div>
                <div class="postFooter">
                   <p class="postDate editable">${recipe.date}</p>
                    <p class="postTags editable">${tagsHTML}</p>
                </div>
            </div>
            </div>
        `;
        console.log(recipeHTML);
        recipesHTML += recipeHTML;
    }

    return recipesHTML;
}

function generateIngredientsHtmlSmallView(ingredients) {
    let ingredientsHTML = "";
    const MAX_INGREDIENTS_LENGTH = 5;
    for (let j = 0; j < ingredients.length; j++) {
        if(j < MAX_INGREDIENTS_LENGTH) {
            ingredientsHTML += `${ingredients[j]}`;
        } else {
            ingredientsHTML += `...`;
            break;
        }
        if (j < ingredients.length - 1) {
            ingredientsHTML += ` | `;
        }
    }
    return ingredientsHTML;
}

function generateTagsHtml(recipe) {
    let tagsHTML = "";
    for (let j = 0; j < recipe.tags.length; j++) {
        tagsHTML += `#${recipe.tags[j]} `;
    }
    return tagsHTML;
}

function detailView(postCard, recipeId) {
//<p className="postPreparation">${recipe.preparation}</p>
    postCard.classList.add("detailView");

    fetch('http://localhost:3000/getPost/' + recipeId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            postCard.setAttribute('onclick', 'closeDetailView(this, ' + recipeId + ')');
            let preparation = postCard.querySelector(".postPreparation");
            preparation.style.margin = "8%";
            preparation.innerHTML += "<h2>How to Cook:</h2>";
            preparation.innerHTML += '<div class="editable">' + data.preparation + '</div>';

            let ingredients = postCard.querySelector(".postIngredients");
            ingredients.innerHTML = "";
            for (let i = 0; i < data.ingredients.length; i++) {
                ingredients.innerHTML += '<p>- ' + data.ingredients[i] + '</p>';
            }
            ingredients.classList.add("postPreparationDetailView");

            //TODO: use icon instead of button, styling
            document.querySelector('.postFooter').innerHTML += '<button onclick="editPost(' + data.id + ')">edit Post</button>';
        })
        .catch(err => console.log(err));

}

function closeDetailView(postCard, recipeId) {
    console.log('closeDetailView');
    postCard.classList.remove("detailView")
    postCard.setAttribute('onclick', 'detailView(this, ' + recipeId + ')');
    postCard.querySelector(".postPreparation").innerHTML = "";

    fetch('http://localhost:3000/getPost/' + recipeId)
        .then(response => response.json())
        .then(recipe => {
            let ingredients = postCard.querySelector(".postIngredients");
            ingredients.innerHTML = generateIngredientsHtmlSmallView(recipe.ingredients);

            postCard.querySelector(".postIngredients").classList.remove("postPreparationDetailView");
            document.querySelector('.postFooter').innerHTML = `
                   <p class="postDate">${recipe.date}</p>
                    <p class="postTags">${generateTagsHtml(recipe)}</p>
            `
        });
}

function addPost() {
    let recipe = {
        "title": document.querySelector("#title").value,
        "imgLink": document.querySelector("#imgLink").value,
        "date": new Date().toISOString().slice(0, 10),
        "ingredients": document.querySelector("#ingredients").value.split(","),
        "tags": document.querySelector("#tags").value.split(","),
        "description": document.querySelector("#description").value,
        "preparation": document.querySelector("#preparation").value,
    }
    console.log(recipe);

    fetch('http://localhost:3000/addPost', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(recipe)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            generateAllrecipes();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function changePostSavestate(bookmark) {
    if (bookmark.id === 'false') {
        bookmark.src = "img/i" + "cons/bookmark-saved.svg"
        bookmark.id = 'true'
    } else if (bookmark.id === 'true') {
        bookmark.src = "img/icons/bookmark.svg"
        bookmark.id = 'false'
    }
}

function editPost(postIdToEdit) {
    let postToEdit = document.getElementById('postCard' + postIdToEdit);
    let postContent = postToEdit.querySelector('.postContent');
    let footer = postToEdit.querySelector('.postFooter');

    footer.innerHTML += '<button onclick="saveEdits(' + postToEdit + ')">save Post</button>';

    let editableElements = findAllChildrenWithClass(postContent, 'editable');
    console.log(editableElements);

    for (let i = 0; i < editableElements.length; i++) {
        editableElements[i].setAttribute('contenteditable', 'true');
    }
}
function findAllChildrenWithClass(element, className) {
    let childrenWithClass = [];

    // Überprüfe, ob das aktuelle Element die gesuchte Klasse hat
    if (element.classList.contains(className)) {
        childrenWithClass.push(element);
    }

    // Durchlaufe alle direkten Kinder des aktuellen Elements
    element.childNodes.forEach(child => {
        // Überprüfe, ob das Kind ein Elementknoten ist (Knotentyp 1)
        if (child.nodeType === 1) {
            // Rekursiver Aufruf für jedes Kind
            childrenWithClass = childrenWithClass.concat(findAllChildrenWithClass(child, className));
        }
    });

    return childrenWithClass;
}

function saveEdits(postIdToEdit) {
    let postToEdit = document.getElementById('postCard' + postIdToEdit);
    let postContent = postToEdit.querySelector('.postContent');
    let footer = postToEdit.querySelector('.postFooter');

    footer.innerHTML += '<button onclick="editPost(' + postIdToEdit + ')">edit Post</button>';

    console.log(postContent.getElementsByClassName('editable'));
    let editableElements = postContent.getElementsByClassName('editable');
    for (let i = 0; i < editableElements.length; i++) {
        editableElements[i].setAttribute('contenteditable', 'false');
    }

    let recipe = {
        "title": postContent.querySelector(".postTitle").innerHTML.trim(),
        "ingredients": postContent.querySelector(".postIngredients").innerHTML.split("|"),
        "tags": postContent.querySelector(".postTags").innerHTML.split("#"),
        "description": postContent.querySelector(".postDescription").innerHTML,
        "preparation": postContent.querySelector(".postPreparation").innerHTML,

    }
}


// HTML FORMAT OF recipe
//                     <div class="postImage"></div>
//                     <div class="postContent">
//                         <h1 class="postTitle">Tasty Tomato Pasta</h1>
//                         <div class="postRating">
//                             <img src="img/CheffsHatGood.png">
//                             <img src="img/CheffsHatGood.png">
//                             <img src="img/CheffsHatGood.png">
//                             <img src="img/CheffsHatGood.png">
//                             <img src="img/CheffsHatGood.png">
//                         </div>
//                         <p class="postDescription">Easy to make, delicious noodles.</p>
//                         <h2>Ingredients:</h2>
//                         <p class="postIngredients">Noodles | Tomatosauce | Water</p>
//                         <p class="postPreparation">Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, iusto blanditiis? Nisi ab sapiente, minus aperiam est amet! Vitae architecto enim modi accusantium quaerat exercitationem provident rerum dolor ratione tempora.</p>
//                         <div class="postFooter">
//                             <p class="postTags">#Easy, #Noodles, #Yummy</p>
//                             <p class="postDate">Posted on: 2024-01-04</p>
//                             <img class="postUserIcon" src="../Kilogram/Assets/Images/default_profile_icon.png">
//                             <p class="postUserName">SuperUser146</p>
//                         </div>
//                     </div>


// JSON FORMAT OF recipe
// {
//     "posts" : [
//         {
//             "id": "1",
//             "title": "Tasty Tomato Pasta",
//             "imgLink": "#",
//             "date": "2024-01-04",
//             "ingredients": ["Noodles", "Tomatosauce", "Water"],
//             "tags": ["Easy", "Noodles", "Yummy"],
//             "description": "Easy to make, delicious noodles.",
//             "preparation": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae facilis illo placeat voluptatum illum? Maiores assumenda quia reprehenderit iusto enim ratione animi, laudantium, cum officiis laboriosam debitis illo, nemo ipsum!"
//         }
//     ]
// }