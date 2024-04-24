generateAllrecipes();

function generateAllrecipes() {

    fetch('http://localhost:3000/getAllPosts')
        .then(response => response.json())
        .then(recipes => {
            console.log(recipes);
            document.querySelector(".feed").innerHTML = generatePostsHtml(recipes);
            return recipes;
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

        let recipeHTML = `<div id="postCard${recipe.id}" class="postCard">
            <div class="postImage" id="postImage${recipe.id}"  onclick="detailView(${recipe.id})" style="background-image: url('uploads/${recipe.imgLink}');"></div>
    
            <div class="postContent">
                <div class="postHeading">
                    <h1 class="postTitle editable">${recipe.title}</h1>
                    <div class="editPostDiv"></div>
                </div>
                <div class="interaction-heading">
                <div class="postRating">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                    <img src="img/CheffsHatGood.png">
                </div>
                    <img class="postBookmark" id="false" src="img/icons/bookmark.svg" onclick="changePostSavestate(this)"">
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
        recipesHTML += recipeHTML;
    }

    return recipesHTML;
}

function generateIngredientsHtmlSmallView(ingredients) {
    let ingredientsHTML = "";
    const MAX_INGREDIENTS_LENGTH = 5;
    for (let j = 0; j < ingredients.length; j++) {
        if (j < MAX_INGREDIENTS_LENGTH) {
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

function detailView(recipeId) {
//<p className="postPreparation">${recipe.preparation}</p>
    let postCard = document.getElementById('postCard' + recipeId);
    postCard.classList.add("detailView");

    fetch('http://localhost:3000/getPost/' + recipeId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            postCard.querySelector('#postImage' + recipeId).setAttribute('onclick', `closeDetailView(${recipeId})`);
            let preparation = postCard.querySelector(".postPreparation");
            preparation.style.margin = "8%";
            preparation.innerHTML += "<h2>How to Cook:</h2>";
            preparation.innerHTML += '<div class="editable preperationContent">' + data.preparation + '</div>';

            let ingredients = postCard.querySelector(".postIngredients");
            ingredients.innerHTML = "";
            for (let i = 0; i < data.ingredients.length; i++) {
                ingredients.innerHTML += '<p>- ' + data.ingredients[i] + '</p>';
            }
            ingredients.classList.add("postPreparationDetailView");

            //TODO: use icon instead of button, styling
            postCard.querySelector('.editPostDiv').innerHTML += `<div class="editPostButton" onclick=" hideCurrentElement(this); editPost(${data.id});"><img src="img/icons/lock-closed.svg"></div>`;
        })
        .catch(err => console.log(err));

}

function hideCurrentElement(element) {
    console.log(element.style.display)
    element.style.display = 'none';
}

function closeDetailView(recipeId) {
    let postCard = document.getElementById('postCard' + recipeId);
    postCard.classList.remove("detailView")
    postCard.querySelector('#postImage' + recipeId).setAttribute('onclick', 'detailView(' + recipeId + ')');
    postCard.querySelector(".postPreparation").innerHTML = "";
    postCard.querySelector('.editPostDiv').innerHTML = "";

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
        "imgLink": document.querySelector("#imgLink").files[0].name,
        "date": new Date().toISOString().slice(0, 10),
        "ingredients": document.querySelector("#ingredients").value.split(","),
        "tags": document.querySelector("#tags").value.split(","),
        "description": document.querySelector("#description").value,
        "preparation": document.querySelector("#preparation").value,
    }
    console.log(recipe);
    savePost(recipe);
}

function savePost(postData) {
    console.log(postData);
    fetch('http://localhost:3000/addPost', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(postData)
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
        bookmark.src = "img/icons/bookmark-saved.svg"
        bookmark.id = 'true'
    } else if (bookmark.id === 'true') {
        bookmark.src = "img/icons/bookmark.svg"
        bookmark.id = 'false'
    }
}

function editPost(postIdToEdit) {
    let postToEdit = document.getElementById('postCard' + postIdToEdit);
    let postContent = postToEdit.querySelector('.postContent');
    let footer = postToEdit.querySelector('.editPostDiv');

    footer.innerHTML += '<div class="editPostButton" onClick="hideCurrentElement(this); saveEdits(' + postIdToEdit + ');"><img src="img/icons/lock-open.svg"></div>';

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
    let footer = postToEdit.querySelector('.editPostDiv');

    footer.innerHTML += '<div class="editPostButton" onClick="editPost(' + postIdToEdit + ')"><img src="img/icons/lock-closed.svg"></div>';
    //<div onClick="editPost(' + postIdToEdit + ')">edit Post</div>

    console.log(postContent.getElementsByClassName('editable'));
    let editableElements = postContent.getElementsByClassName('editable');
    for (let i = 0; i < editableElements.length; i++) {
        editableElements[i].setAttribute('contenteditable', 'false');
    }

    let tags = postContent.querySelector(".postTags").innerHTML.split("#");
    tags.shift();
    tags.forEach(tag => tag.trim());

    let ingredients = postContent.querySelector(".postIngredients").innerHTML.split("<p>- ").filter(Boolean).map(ingredient => ingredient.slice(0, -4));
    ingredients.forEach(ingredient => ingredient.trim());

    let recipe = {
        "id": postIdToEdit,
        "title": postContent.querySelector(".postTitle").innerHTML.trim(),
        "ingredients": ingredients,
        "tags": tags,
        "description": postContent.querySelector(".postDescription").innerHTML,
        "preparation": postContent.querySelector(".preperationContent").innerHTML,
        "date": postContent.querySelector(".postDate").innerHTML,
    }

    updatePost(recipe);
}

function updatePost(postData) {
    fetch('http://localhost:3000/updatePost', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(postData)
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

window.onload = function() {
    // Check if the current page is search.html
    console.log("Hurensohn" + window.location.pathname);
    if (window.location.pathname.endsWith('search.html')) {
        populateTable();
    }
};

function populateTable() {
    console.log("Populating table")
    fetch('http://localhost:3000/getAllPosts') // Fetch posts from local posts.json file
        .then(response => response.json())
        .then(posts => {
            const tableBody = document.querySelector('.postsTable tbody');
            tableBody.innerHTML = ''; // Clear the table body

            posts.posts.forEach(post => {
                const tr = document.createElement('tr');

                // const tdUserImage = document.createElement('td');
                // tdUserImage.className = 'tdUserImage';
                // const imgUser = document.createElement('img');
                // imgUser.src = '/uploads/' + post.imgLink; // Use the image link from the post data
                // imgUser.alt = 'User Image';
                // tdUserImage.appendChild(imgUser);

                const tdRating = document.createElement('td');
                tdRating.className = 'tdRating';
                tdRating.innerHTML = `<p>4/5</p><img src="./img/CheffsHatGood.png" alt="Chef Hat">`; // Replace 4/5 with the actual rating

                const tdTitle = document.createElement('td');
                tdTitle.className = 'tdTitle';
                tdTitle.textContent = post.title;

                const tdDescription = document.createElement('td');
                tdDescription.className = 'tdDescription';
                tdDescription.textContent = post.description;

                const tdIngredients = document.createElement('td');
                tdIngredients.className = 'tdIngredients';
                tdIngredients.innerHTML = `<h5>Ingredients:</h5><p>${generateIngredientsHtmlSmallView(post.ingredients)}</p>`;

                const tdTags = document.createElement('td');
                tdTags.className = 'tdTags';
                tdTags.textContent = generateTagsHtml(post);

                const tdBookmark = document.createElement('td');
                tdBookmark.className = 'tdBookmark';
                const imgBookmark = document.createElement('img');
                imgBookmark.src = './img/icons/bookmark.svg';
                tdBookmark.appendChild(imgBookmark);

                // tr.append(tdUserImage, tdRating, tdTitle, tdDescription, tdIngredients, tdTags, tdBookmark);
                tr.append(tdTitle, tdRating, tdDescription, tdIngredients, tdTags, tdBookmark);
                tableBody.appendChild(tr);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Call the function when the page loads
window.onload = populateTable;