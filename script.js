"use strict";
let userCharacters = [];
let staffCharacters = [];
let intersectionUserList = [];
let login = false;
function characterQuery(input, number, romaji) {
  var query = `
  query ($search: String) {
    Character(search: $search) {
      name {
        full
      }
      media(type:ANIME, sort:POPULARITY_DESC) {
        edges {
          node {
            title{
              romaji
            }
          }
          voiceActors(language: JAPANESE, sort:FAVOURITES_DESC) {
            name {
              full
            }
          }
        }
      }
    }
  }
  `;

  // Query Variables
  var variables = {
    search: input,
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

  //send a VA query using the voice actor name found
  function handleData(data) {
    vaQuery(
      data.data.Character.media.edges[0].voiceActors[0].name.full,
      number,
      romaji
    );
  }

  //if the user searches for a VA instead of character, 404 error will be thrown
  function handleError(error) {
    vaQuery(input, number, romaji);
  }
}
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
          siteUrl
          characters(sort:FAVOURITES_DESC) {
            edges {
              node {
                id
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
    localStorage.setItem("va", input);
    localStorage.setItem("number", number);
    localStorage.setItem("romaji", romaji);
    compileStaffMedia(data.data.Staff);

    //reset the page
    document.querySelector(`#top`).innerHTML = "";
    document.querySelector(`#bottom`).innerHTML = "";

    //add the VA card based on the query
    document.querySelector(`#top`).appendChild(createVACard(data.data.Staff));

    //cross reference the user list and va list
    if (userCharacters.length != 0) {
      intersectionUserList = [];
      for (let i = 0; i < staffCharacters.length; i++) {
        //need to check against ID to prevent false flagging characters with the same name (36309 is the general Narrator id)
        if (
          userCharacters.includes(staffCharacters[i][0]) &&
          staffCharacters[i][0] != 36309
        ) {
          //push the chracter's name
          intersectionUserList.push(staffCharacters[i][1]);
        }
      }
    }

    //if not imported, add ${number} anime cards to the bottom based on character popularity
    //the if checks to make sure the VA has the given number of roles
    //edges[3] == undefined means that the va only has 2 roles
    if (number == 0) {
      number = 4;
    }
    //array for tracking how many and which characters have been added so far
    let addedCharacters = [];
    //loop through the staff character list, adding any that are intersected
    for (let i = 0; i < data.data.Staff.characters.edges.length; i++) {
      if (
        data.data.Staff.characters.edges[i] != undefined &&
        addedCharacters.length < number
      ) {
        if (
          intersectionUserList.includes(
            data.data.Staff.characters.edges[i].node.name.full
          )
        ) {
          document
            .querySelector(`#bottom`)
            .appendChild(
              createAnimeCard(
                data.data.Staff,
                data.data.Staff.characters.edges[i],
                romaji,
                true
              )
            );
          addedCharacters.push(
            data.data.Staff.characters.edges[i].node.name.full
          );
        }
      }
    }
    for (let i = 0; i < data.data.Staff.characters.edges.length; i++) {
      if (
        data.data.Staff.characters.edges[i] != undefined &&
        addedCharacters.length < number
      ) {
        if (
          !addedCharacters.includes(
            data.data.Staff.characters.edges[i].node.name.full
          )
        ) {
          document
            .querySelector(`#bottom`)
            .appendChild(
              createAnimeCard(
                data.data.Staff,
                data.data.Staff.characters.edges[i],
                romaji,
                false
              )
            );
          addedCharacters.push(
            data.data.Staff.characters.edges[i].node.name.full
          );
        }
      }
    }
    addedCharacters = [];
    //close the modal window and reset the form
    document.querySelector(`#search`).reset();
    $("#searchModal").modal("hide");
  }

  // On Error
  function handleError(error) {
    alert("Search failed, please check your spelling!");
    console.error(error);
  }

  //add all the characters from this VA to the global staffChracters[]
  function compileStaffMedia(staff) {
    //empty the array
    staffCharacters = [];
    for (let i = 0; i < staff.characters.edges.length; i++) {
      staffCharacters.push([
        staff.characters.edges[i].node.id,
        staff.characters.edges[i].node.name.full,
      ]);
    }
  }

  //create the VA Card HTML
  function createVACard(staff) {
    //the VA card
    let card = document.createElement("div");
    card.classList.add("card", "mr-5", "ml-5", "border", "border-secondary");
    card.setAttribute("data-aos", "zoom-in");

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
  function createAnimeCard(va, character, romaji, seen) {
    //create the card representing the anime and character
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("m-3");
    card.setAttribute("data-aos", "zoom-in");

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
    if (character.media[0].title.english != undefined && !romaji) {
      animeName.textContent = character.media[0].title.english;
    } else {
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

    if (seen) {
      card.classList.add("border", "border-secondary");
    } else {
      card.classList.add("border", "border-primary", "unseen");
    }
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
    localStorage.setItem("username", input);
    //close the import modal window
    $("#importModal").modal("hide");
    //set the user avatar
    document.querySelector(`#profile-picture`).src =
      data.data.User.avatar.large;
    //set the profile name
    document.querySelector(`#profile-name`).textContent = data.data.User.name;
    //set the picture link
    document.querySelector(`#profile-picture-link`).href =
      data.data.User.siteUrl;
    //set the name link
    document.querySelector(`#profile-name-link`).href = data.data.User.siteUrl;
    //query for the user's anime list
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
        name
        entries {
          media {
            id
            title {
              english
              romaji
            }
            characters(sort:FAVOURITES_DESC) {
              edges {
                node {
                  id
                  name{
                    full
                  }
                }
              }
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
    compileUserMedia(data);
  }

  //add all the characters from the user's show list into the userCharacters array
  function compileUserMedia(data) {
    userCharacters = [];
    let list = [];
    for (let i = 0; i < data.data.MediaListCollection.lists.length; i++) {
      list = list.concat(data.data.MediaListCollection.lists[i].entries);
    }
    //let list = data.data.MediaListCollection.lists[2];
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].media.characters.edges.length; j++) {
        userCharacters.push(list[i].media.characters.edges[j].node.id);
      }
    }
  }

  // On Error
  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }
}

function reset() {
  localStorage.clear();
  window.location.reload();
}

function urlQuery() {
  let urlString = window.location.href;
  let paramString = urlString.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  let flag = false;

  for (let pair of queryString.entries()) {
    if (pair[0] == "search") {
      characterQuery(pair[1], 24, false);
      flag = true;
    }
  }
  return flag;
}

(function () {
  if (!(localStorage.getItem("username") === null)) {
    userQuery(localStorage.getItem("username"));
    document.querySelector(
      `#top`
    ).innerHTML = `<div class="btn btn-red p-3 m-5" style="text-align: center;">Loading Data From Your Last Session...</div>`;
    setTimeout(function () {
      if (!(localStorage.getItem("va") === null) && !urlQuery()) {
        vaQuery(
          localStorage.getItem("va"),
          localStorage.getItem("number"),
          localStorage.getItem("romaji")
        );
        
      }
    }, 2000);
  } else {
    urlQuery();
  }
})();
