"use strict";
let userMedia = [];
let intersectionUserList = [];
function vaQuery(input) {
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
    document.querySelector(`#top`).innerHTML = "";
    document.querySelector(`#bottom`).innerHTML = "";
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
   if(data.data.Staff.characters.edges[0] != undefined) {
    document
    .querySelector(`#bottom`)
    .appendChild(
      createAnimeCard(data.data.Staff, data.data.Staff.characters.edges[0])
    );
   }
    
   if(data.data.Staff.characters.edges[1] != undefined) {
    document
    .querySelector(`#bottom`)
    .appendChild(
      createAnimeCard(data.data.Staff, data.data.Staff.characters.edges[1])
    );
   }
   if(data.data.Staff.characters.edges[2] != undefined) {
    document
    .querySelector(`#bottom`)
    .appendChild(
      createAnimeCard(data.data.Staff, data.data.Staff.characters.edges[2])
    );
   }
   if(data.data.Staff.characters.edges[3] != undefined) {
    document
    .querySelector(`#bottom`)
    .appendChild(
      createAnimeCard(data.data.Staff, data.data.Staff.characters.edges[3])
    );
   }
  }

  // On Error
  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }

  // Helper method to create the VA Card HTML
  function createVACard(staff) {
    let card = document.createElement("div");
    card.classList.add("card", "mr-5", "ml-5");

    let vaImageAnchor = document.createElement("a");
    vaImageAnchor.href = staff.siteUrl;
    vaImageAnchor.target = "_blank";

    let vaImage = document.createElement("img");
    vaImage.classList.add("card-img");
    vaImage.id = staff.name.full.replace(/\s+/g, "");
    vaImage.src = staff.image.large;

    vaImageAnchor.appendChild(vaImage);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let vaNameAnchor = document.createElement("a");
    vaNameAnchor.href = staff.siteUrl;

    let vaNameText = document.createElement("h5");
    vaNameText.classList.add("card-title");
    vaNameText.textContent = staff.name.full;

    let vaNameNativeAnchor = document.createElement("a");
    vaNameNativeAnchor.href = staff.siteUrl;

    let vaNameNativeText = document.createElement("small");
    vaNameNativeText.classList.add("text-muted");
    vaNameNativeText.textContent = staff.name.native;
    console.log(staff.name.native);

    vaNameAnchor.appendChild(vaNameText);
    vaNameAnchor.target = "_blank";

    vaNameNativeAnchor.appendChild(vaNameNativeText);
    vaNameNativeAnchor.target = "_blank";

    cardBody.appendChild(vaNameAnchor);
    cardBody.appendChild(vaNameNativeAnchor);

    card.appendChild(vaImageAnchor);
    card.appendChild(cardBody);

    return card;
  }

  function createAnimeCard(va, character) {
    //console.log(va.name.full);
    //console.log(character);
    //console.log(character.node.name.full);
    //console.log(character.media);

    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("m-3");

    let cardHead = document.createElement("div");

    let animeAnchor = document.createElement("a");
    animeAnchor.href = character.media[0].siteUrl;
    let animeImage = document.createElement("img");
    animeImage.classList.add("card-img");
    animeImage.src = character.media[0].coverImage.large;

    animeAnchor.appendChild(animeImage);
    animeAnchor.target = "_blank";

    let characterAnchor = document.createElement("a");
    characterAnchor.href = character.node.siteUrl;
    let characterImage = document.createElement("img");
    characterImage.classList.add("card-img");
    characterImage.src = character.node.image.large;

    characterAnchor.appendChild(characterImage);
    characterAnchor.target = "_blank";

    cardHead.appendChild(animeAnchor);
    cardHead.appendChild(characterAnchor);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let characterNameAnchor = document.createElement("a");
    characterNameAnchor.href = character.node.siteUrl;
    let characterName = document.createElement("h5");
    characterName.classList.add("card-title");
    characterName.textContent = character.node.name.full;

    characterNameAnchor.appendChild(characterName);
    characterNameAnchor.target = "_blank";

    let animeNameAnchor = document.createElement("a");
    animeNameAnchor.href = character.media[0].siteUrl;
    let animeName = document.createElement("small");
    animeName.classList.add("text-muted");
    animeName.textContent = character.media[0].title.romaji;

    animeNameAnchor.appendChild(animeName);
    animeNameAnchor.target = "_blank";

    cardBody.appendChild(characterNameAnchor);
    cardBody.appendChild(animeNameAnchor);

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
    alert("Search failed");
    console.error(error);
  }
}

function userListQuery(input) {
  console.log(input);
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
    console.log(data);
    userMedia = data.data.MediaListCollection.lists;
  }

  // On Error
  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }
}

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
