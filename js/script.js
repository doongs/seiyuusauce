"use strict";
let userMedia = [];
let intersectionUserList = [];
function vaQuery(input, number, romaji) {
  var query = `
    query ($name: String) { # Define which variables will be used in the query (id)
        Staff (search: $name) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          name {
            full
            native
          }
          image {
            large
          }
          staffMedia {
            nodes {
              id
            }
          }
          siteUrl
          characters(sort:FAVOURITES_DESC) {
            edges {
              id
              node {
                name{
                  full
                }
                image {
                  large
                }
                siteUrl
              }
              media {
                title {
                  romaji
                  english
                }
                id
                siteUrl
                coverImage {
                  extraLarge
                  large
                  medium
                  color
                }
              }
            }
          }
        }
      }
  `;

  // Query Variables
  var variables = {
    name: input,
  };

  // Api request config
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  // Make the HTTP Api request
  fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

  // Use the data recieved
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData(data) {
    console.log(data.data.Staff);

    //reset the page
    document.querySelector(`#top`).innerHTML = "";
    document.querySelector(`#bottom`).innerHTML = "";
  
    //add the VA card based on the query
    document.querySelector(`#top`).appendChild(createVACard(data.data.Staff));
    //TODO implement cross referencing between VA list and userList
    /*
    if (userMedia != []) {
      console.log(userMedia);
      for(let i=0; i<userMedia.length; i++)
      {
        //console.log(userMedia[i].entries);
        //intersectionUserList.push(intersection(userMedia[i].entries, data.data.Staff.staffMedia.nodes));
        //console.log(intersectionUserList)
      }
    }
    */
    //if not imported, add ${number} anime cards to the bottom based on character popularity
    //the if checks to make sure the VA has the given number of roles
    //edges[3] == undefined means that the va only has 2 roles
    if(number == 0)
    {
      number = 4;
    }
    for (let i = 0; i < number; i++) {
      if (data.data.Staff.characters.edges[i] != undefined) {
        document
          .querySelector(`#bottom`)
          .appendChild(
            createAnimeCard(
              data.data.Staff,
              data.data.Staff.characters.edges[i],
              romaji
            )
          );
      }
    }
    //close the modal window and reset the form
    document.querySelector(`#search`).reset();
    $("#searchModal").modal("hide");
  }

  // On Error
  function handleError(error) {
    alert("VA search failed, please check your spelling");
    console.error(error);
  }

  //create the VA Card HTML
  function createVACard(staff) {
    //the VA card
    let card = document.createElement("div");
    card.classList.add("card", "mr-5", "ml-5");

    //the VA's picture, wrapped in a link
    let vaImageAnchor = document.createElement("a");
    vaImageAnchor.href = staff.siteUrl;
    vaImageAnchor.target = "_blank";
    let vaImage = document.createElement("img");
    vaImage.classList.add("card-img");
    vaImage.id = staff.name.full.replace(/\s+/g, "");
    vaImage.src = staff.image.large;

    //add the VA picture to the link
    vaImageAnchor.appendChild(vaImage);

    //the card body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //the VA's name in romaji, wrapped in a link
    let vaNameAnchor = document.createElement("a");
    vaNameAnchor.href = staff.siteUrl;
    vaNameAnchor.target = "_blank";
    let vaNameText = document.createElement("h5");
    vaNameText.classList.add("card-title");
    vaNameText.textContent = staff.name.full;

    //add the VA's romaji name to the link
    vaNameAnchor.appendChild(vaNameText);

    //the VA's name in kanji, wrapped in a link
    let vaNameNativeAnchor = document.createElement("a");
    vaNameNativeAnchor.href = staff.siteUrl;
    vaNameNativeAnchor.target = "_blank";
    let vaNameNativeText = document.createElement("small");
    vaNameNativeText.classList.add("text-muted");
    vaNameNativeText.textContent = staff.name.native;
    console.log(staff.name.native);

    //add the VA's kanji name to the link
    vaNameNativeAnchor.appendChild(vaNameNativeText);

    //add the VA's names to the card body
    cardBody.appendChild(vaNameAnchor);
    cardBody.appendChild(vaNameNativeAnchor);

    //add the image and body to the card
    card.appendChild(vaImageAnchor);
    card.appendChild(cardBody);

    return card;
  }

  //create the card representing the anime and character
  function createAnimeCard(va, character, romaji) {
    //console.log(va.name.full);
    //console.log(character);
    //console.log(character.node.name.full);
    //console.log(character.media);

    //create the card representing the anime and character
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("m-3");

    //the card's head
    let cardHead = document.createElement("div");

    //the anime's image, wrapped in a link
    let animeAnchor = document.createElement("a");
    animeAnchor.href = character.media[0].siteUrl;
    animeAnchor.target = "_blank";
    let animeImage = document.createElement("img");
    animeImage.classList.add("card-img");
    animeImage.src = character.media[0].coverImage.large;

    //add the anime's picture to the link
    animeAnchor.appendChild(animeImage);

    //the character's picture, wrapped in a link
    let characterAnchor = document.createElement("a");
    characterAnchor.href = character.node.siteUrl;
    characterAnchor.target = "_blank";
    let characterImage = document.createElement("img");
    characterImage.classList.add("card-img");
    characterImage.src = character.node.image.large;

    //add the character's picture to the link
    characterAnchor.appendChild(characterImage);

    //add the anime and character pictures to the card
    cardHead.appendChild(animeAnchor);
    cardHead.appendChild(characterAnchor);

    //body of the card
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //the character's name, wrapped in a link
    let characterNameAnchor = document.createElement("a");
    characterNameAnchor.href = character.node.siteUrl;
    characterNameAnchor.target = "_blank";
    let characterName = document.createElement("h5");
    characterName.classList.add("card-title");
    characterName.textContent = character.node.name.full;

    //add the character name text to the link
    characterNameAnchor.appendChild(characterName);

    //the anime's name, wrapped in a link
    let animeNameAnchor = document.createElement("a");
    animeNameAnchor.href = character.media[0].siteUrl;
    animeNameAnchor.target = "_blank";
    let animeName = document.createElement("small");
    animeName.classList.add("text-muted");
    
    //if the english title exists and romaji not selected
    if(character.media[0].title.english != undefined && !romaji) 
    {
      animeName.textContent = character.media[0].title.english;
    } else{
      animeName.textContent = character.media[0].title.romaji;
    }
    

    //add the anime's name to the link
    animeNameAnchor.appendChild(animeName);

    //add the character name and anime name to the body
    cardBody.appendChild(characterNameAnchor);
    cardBody.appendChild(animeNameAnchor);

    //add the head and body to the card
    card.appendChild(cardHead);
    card.appendChild(cardBody);

    return card;
  }
}

function userQuery(input) {
  var query = `
    query ($name: String) { 
        User(name: $name) {
          id
          siteUrl
          name
          avatar {
            large
            medium
          }
        }
    }
  `;

  // Query Variables
  var variables = {
    name: input,
  };

  // Api request config
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  // Make the HTTP Api request
  fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

  // Handle API response
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  // Use the data recieved
  function handleData(data) {
    //close the import modal window
    $("#importModal").modal("hide");
    console.log(data.data.User);
    console.log(data.data.MediaList);
    document.querySelector(`#profile-picture`).src =
      data.data.User.avatar.large;
    document.querySelector(`#profile-name`).textContent = data.data.User.name;
    document.querySelector(`#profile-picture-link`).href =
      data.data.User.siteUrl;
    document.querySelector(`#profile-name-link`).href = data.data.User.siteUrl;
    userListQuery(data.data.User.id);
  }

  // On Error
  function handleError(error) {
    alert("Failed to get user, please check your spelling");
    console.error(error);
  }
}

function userListQuery(input) {
  var query = `
    query ($id: Int) { 
      MediaListCollection(userId: $id, type: ANIME) {
        lists {
          entries {
            id
            media {
              title {
                romaji
              }
            }
          }
        }
      }
    }
  `;

  // Query Variables
  var variables = {
    id: input,
  };

  // API request config
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  // Make the HTTP API request
  fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

  // Handle API response
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  // Use the data recieved
  function handleData(data) {
    console.log(data);
    userMedia = data.data.MediaListCollection.lists;
  }

  // On Error
  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }
}

//returns the list of anime that is on the user's list and on the VA's list
function intersection(userMediaArray, mediaArray) {
  return userMediaArray.filter((x) => mediaArray.includes(x));
}

/*

Example of VA Card (goes in #top):

<div class="card">
    <a href="https://anilist.co/staff/95185/Kana-Hanazawa"><img class="card-img" id="KanaHanazawa" src="resources/kana.jpg"></a>
    <div class="card-body">
    <a href="https://anilist.co/staff/95185/Kana-Hanazawa"><h5 class="card-title">Kana Hanazawa</h5></a>
    <small class="text-muted">花澤香菜</small>
    </div>
</div>

*/
