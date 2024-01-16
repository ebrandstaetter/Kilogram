generateAllRecepies();

function getRecepies() {
}

function generateAllRecepies() {
    let recepiesHTML = "";

    fetch('http://localhost:3000/getAllPosts')
    .then(response => response.json())
    .then(recepies => {
        console.log(recepies);


        for (let i = 0; i < recepies.posts.length; i++) {
            let recepie = recepies.posts[i];
            let tagsHTML = "";
            for (let j = 0; j < recepie.tags.length; j++) {
                tagsHTML += `#${recepie.tags[j]} `;
            }
            let ingredientsHTML = "";
            for (let j = 0; j < recepie.ingredients.length; j++) {
                ingredientsHTML += `${recepie.ingredients[j]}`;
                if (j < recepie.ingredients.length - 1) {
                    ingredientsHTML += ` | `;
                }
            }
            let recepieHTML = `
                <div class="postImage"></div>
                <div class="postContent">
                    <h1 class="postTitle">${recepie.title}</h1>
                    <div class="postRating"></div>
                    <p class="postDescription">${recepie.description}</p>
                    <h2>Ingredients:</h2>
                    <p class="postIngredients">${ingredientsHTML}</p>
                    <p class="postPreparation">${recepie.preparation}</p>
                    <div class="postFooter">
                        <p class="postTags">${tagsHTML}</p>
                        <p class="postDate">Posted on: ${recepie.date}</p>
                        <img class="postUserIcon" src="../Kilogram/Assets/Images/default_profile_icon.png">
                        <p class="postUserName">${recepie.userName}</p>
                    </div>
                </div>
            `;
            console.log(recepieHTML);
            recepiesHTML += recepieHTML;
        }
        
        console.log(recepiesHTML);
        document.querySelector(".postCard").innerHTML = recepiesHTML;
    })
    .catch(err => console.log(err));
}





// HTML FORMAT OF RECEPIE
//                     <div class="postImage"></div>
//                     <div class="postContent">
//                         <h1 class="postTitle">Tasty Tomato Pasta</h1>
//                         <div class="postRating"></div>
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


// JSON FORMAT OF RECEPIE
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